import sys
import datetime
import json
import requests

#   #   #   #   #
#   SETTINGS    #
#   #   #   #   #

USERNAME = 'yourusername' # CouchDB user with at least read permission. Set to 'None' if no authentication needed.
PASSWORD = 'password1234-is_a_BadPassword'
DATABASE_URL = 'http://localhost:5984/vault' # No trailing slash
SHOW_HOW_MANY_TASKS = 10
PRESENTATION = "terminal" # terminal or json

#   #   #   #
#   CODE    #
#   #   #   #

# Consider merging||integration with email_report
    # Implement argparse with options for email report, terminal report and clean json data dump

date_now = datetime.datetime.now()
date_today = date_now.strftime("%Y-%m-%d")

tasks_graded = []

def db_fetch_with_view():
    """
    # Fetch tasks

    This one fetches tasks..

    .. todo::
        Finish documentation

    .. todo::
        Consider, instead of sys.exit, plain message, skipping operations
    """
    try:
        if PRESENTATION == 'terminal':
            print('Fetching tasks from CouchDB view: pimpim/task-status-count')
        url = f'{DATABASE_URL}/_design/pimpim/_view/task-status-count?reduce=false&keys=["wait","plan","todo","next","doing"]&include_docs=true'
        if USERNAME:
            r = requests.get(url = url, auth=(USERNAME, PASSWORD))
        else:
            r = requests.get(url = url)
        j = r.json()
        error_msg = j.get("error")
        if error_msg:
            print(j)
            sys.exit("Authorization failed")
        return j
    except Exception as e:
        print(e)
        sys.exit("Exited script prematurely. See error details above")

def grade_tasks():
    if PRESENTATION == 'terminal':
        print('Grading tasks...')
    tasks = db_fetch_with_view()
    priority_weighting = {
        1:500,
        2:400,
        3:200,
        4:100,
        5:50,
        6:-50,
        7:-100,
        8:-200,
        9:-300,
        10:-500
    }
    status_weighting = {
        "doing": 100,
        "next": 50,
        "todo": 25,
        "plan": 10,
        "wait": -100
    }
    for row in tasks["rows"]:
        task = row["doc"]
        task["score"] = 0
        task["discoveries"] = []

        task["score"] += status_weighting[ task["status"] ]

        if task["description"] != None:
            task["score"] += 5

        start = task.get("start")
        if start:
            d0 = datetime.datetime.now()
            d1 = datetime.datetime.strptime( task["start"][:10], '%Y-%m-%d' )
            delta = d0 - d1
            task["score"] += delta.days // 10

        if task["priority"] != None:
            pri_value = priority_weighting[ task["priority"] ]
            task["score"] += pri_value
            if task["priority"] == 1:
                task["discoveries"].append( "Important and urgent" )

        dependency = task.get("dependency")
        if dependency:
            task["discoveries"].append( "Task has a dependency" )

        if task["tags"] != None:
            task["score"] += 20

        due = task.get("due")
        if due:
            if task["due"][:10] == date_today:
                task["score"] += 1000
                task["discoveries"].append( "Due today" )

            if task["due"][:10] <= date_today:
                task["score"] += 2000
                task["discoveries"].append( "Overdue" )

        tasks_graded.append(task)

def sort_graded(task):
    """Sorts all tasks in the tasks_graded list, 
    where tasks with the highest score is placed last in the list """
    return task['score']

grade_tasks()
tasks_graded.sort(key=sort_graded)
# tasks_graded.sort(key=sort_graded, reverse=True) # if reverse needed

def present_terminal():
    print(f"* Top {SHOW_HOW_MANY_TASKS} tasks by importance *")
    for task in tasks_graded[-SHOW_HOW_MANY_TASKS:]:
        print(f"""[TASK]
        * {task["title"]}""")
        if len(task["discoveries"]):
            print('\t[NOTES]')
            for d in task["discoveries"]:
                print('\t\t* ',d)
        print(f'\t[SCORE] {task["score"]}')

if PRESENTATION == 'terminal':
    present_terminal()
elif PRESENTATION == 'json':
    print(json.dumps( tasks_graded[-SHOW_HOW_MANY_TASKS:] ) )