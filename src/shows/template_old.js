var appTasks = new Vue({
    el: "#app",
    template: `
    <div id="app-Tasks">
    <div class="section container">
    <div class="columns">
        <div class="column is-one-quarter">
            <aside class="menu">
                <p class="menu-label">
                    TASKS
                </p>
                <ul class="menu-list">
                    <li onclick="new_entry_form()"><a>New task</a></li>
                    <li v-on:click="getTasks('today')"><a>Today & overdue</a></li>
                </ul>
                <p class="menu-label">
                    By status
                </p>
                <ul class="menu-list">
                    <li data-tag="doing" v-on:click="getTasks('statusdoing')">
                        <a>Doing <span class="tag">{{ taskStatuses.doing }}</span></a></li>
                    <li data-tag="next" v-on:click="getTasks('statusnext')">
                        <a>Next <span class="tag">{{ taskStatuses.next }}</span></a></li>
                    <li data-tag="todo" v-on:click="getTasks('statustodo')">
                        <a>Todo <span class="tag">{{ taskStatuses.todo }}</span></a></li>
                    <li>
                        <ul>
                            <li data-tag="done" v-on:click="getTasks('statusdone')">
                                <a>Done <span class="tag">{{ taskStatuses.done }}</span></a></li>
                            <li data-tag="cancelled" v-on:click="getTasks('statuscancelled')">
                                <a>Cancelled <span class="tag">{{ taskStatuses.cancelled }}</span></a></li>
                        </ul>
                    </li>
                </ul>
            </aside>
        </div>
        <div class="column">
            <article class="message is-primary">
                <div class="message-body">
                    Task management
                    <br>
                    <p>Showing {{ tasks.length }} tasks</p>
                </div>
            </article>
            <div id="view_container">
                <productivity-task
                    v-for="task in tasks" 
                    v-bind:key="task._id" 
                    v-bind:task="task"
                ></productivity-task>
            </div>
        </div>
    </div>
</div>
</div>
    `,
    data: {
        taskStatuses: {
            "plan":0,
            "wait":0,
            "next":0,
            "todo":0,
            "cancelled":0,
            "done":0,
            "doing":0
        },
        statusColors: {
            wait:"is-light",
            plan:"is-dark",
            todo:"is-primary",
            next:"is-warning",
            doing:"is-info",
            done:"is-success",
            cancelled:"is-danger"
        },
        tasks: []
    },
    methods: {
        renderStatusList: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/task-status-count?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
                data.rows.forEach( (aggregate) => {
                        appTasks.taskStatuses[aggregate.key] = aggregate.value;
                });
                
            });
        },
        /*getTasks: function (list = "today") {*/
        getTasks: function (list) {
            this.tasks = [];
            loader_toggle();
            let d = new Date();
            d.setDate(d.getDate() + 1);
            mango = { "selector": {
                        "realm": "productivity",
                        "type": "task",
                        "$nor": [
                            {"status": "cancelled"},
                            {"status": "done"},
                            {"due": null}
                        ],
                        "due": {"$lt": d.toISOString().slice(0,10)}
                        },
                    "limit": 100
                    };
            if (list.slice(0,6) == "status") {
                delete mango.selector["$nor"];
                delete mango.selector.due;
                mango.selector.status = list.slice(6);
            };
            fetch(url_mango, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mango)
            })
            .then((resp) => resp.json())
            .then(function(dbData) {
                dbData.docs.forEach( (doc, index) => {
                    appTasks.tasks.push(doc);
                    if (index + 1 == dbData.docs.length) {loader_toggle(false)}
                });
                if (dbData.docs.length == 0) {loader_toggle(false)};
            })
            .catch(function(error) {
                errorHandler(error);
            });
        }
    }
});

Vue.component("productivity-task", {
props: ["task"],
methods: {
    setStatus: async function (btn) {
        let txt = btn.path[0].textContent;
        let value = txt.trim().toLowerCase();
        this.task.status = value;
    },
    rescheduleModal_toggle: function () {
        this.$refs.rescheduleInputDueDate.value = this.task.due.slice(0, 10);
        this.$refs.rescheduleInputDueTime.value = this.task.due.slice(11, 16);
        this.$refs.rescheduleModal.classList.toggle("is-active");
    },
    setDueDate: async function () {
        let d = this.$refs.rescheduleInputDueDate.value;
        let t = this.$refs.rescheduleInputDueTime.value;
        this.task.due = new Date(d + " " + t).toISOString();
        let result = await update_document(this.task);
        this.rescheduleModal_toggle();
    },
    postpone1Day: async function () {
        let datetime_no_timezone = this.task.due.replace("Z","");
        let old_due_date = new Date(datetime_no_timezone);
        let old_due_hour = old_due_date.getHours();
        let old_due_mins = old_due_date.getMinutes();
        let old_due_secs = old_due_date.getSeconds();
        let new_d = new Date();
        new_d.setHours(old_due_hour, old_due_mins, old_due_secs);
        new_d.setDate(new_d.getDate() + 1);
        this.task.due = new_d.toISOString();
        let result = await update_document(this.task);
        notify("Postponed task: " + this.task._id,"is-info",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-warning">Due tomorrow</span>`;
        this.$refs.card.style.filter = "saturate(0.6) opacity(0.2)";
    },
    clearDueDate: function () {
        this.task.due = null;
        let result = update_document(this.task);
    },
    completeTask: async function() {
        this.task.status = "done";
        this.task.end = new Date().toISOString();
        let result = update_document(this.task);
        notify("Completed task:" + this.task._id,"is-success",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-success">Done</span>`;
        this.$refs.card.style.filter = "saturate(0.6) opacity(0.25)";
    },
    cancelTask: async function() {
        this.task.status = "cancelled";
        this.task.end = new Date().toISOString();
        let result = update_document(this.task);
        notify("Cancelled task:" + this.task._id,"is-success",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-danger is-light">Cancelled</span>`;
        this.$refs.card.style.filter = "blur(1px) saturate(0.6) opacity(0.4)";
    },
    deleteTask: async function() {
            if (this.$refs.deletebtn.textContent == "Sure?") {
                let result = await delete_document(this.task._id);
                let result_parsed = JSON.parse(result);
                if(!result_parsed.ok) {
                    errorHandler("Deleting task failed");
                } else {
                    this.$refs.card.style.filter = "blur(1px) saturate(0.6) opacity(0.25)";
                    this.$refs.tags.innerHTML = `<span class="tag is-danger">Deleted</span>`;
                    notify("Deleted task:" + this.task._id,"is-success",4000);
                }
            } else {
                this.$refs.deletebtn.textContent = "Sure?";
            }
        }
},
computed: {
    /*
    dueDateOnly: {
        get: function () {
            let d = new Date(this.task.due);
            let datetime_iso = d.toISOString();
            let date_iso = datetime_iso.slice(0, 10);
            return date_iso
        },
        set: function (value) {
            this.task.due = new Date(value + " " + this.dueTimeOnly).toISOString();
        }
    },
    dueTimeOnly: {
        get: function () {
            let d = new Date(this.task.due);
            let datetime_iso = d.toISOString();
            let time_iso = datetime_iso.slice(11, 16);
            return time_iso
        },
        set: function (value) {
            this.task.due = new Date(this.dueDateOnly + " " + value).toISOString();
        }
    },
    */
    overdue: function () {
        let d = new Date();
        d.setDate(d.getDate() - 1);
        let yesterday = d.toISOString().slice(0,10);
        let d_today = new Date();
        let date_today = d_today.toISOString().slice(0,10);
        let tag_overdue, danger;
        if (date_today > this.task.due && this.task.status != "done" ) {
            danger = "is-danger";
            return true
        }
    },
    overdueTag: function () {
        let d = new Date();
        d.setDate(d.getDate() - 1);
        let yesterday = d.toISOString().slice(0,10);
        let d_today = new Date();
        let date_today = d_today.toISOString().slice(0,10);
        let tag_overdue, danger;
        if (date_today > this.task.due) {
            danger = "is-danger";
        } else {
            tag_overdue = "";
            danger = "";
        };
        return tag_overdue
    },
    statusColor: function () {
        /*
        let statusColors = {
            wait:"is-light",
            plan:"is-dark",
            todo:"is-primary",
            next:"is-warning",
            doing:"is-info",
            done:"is-success",
            cancelled:"is-danger"
        };
        */
        return appTasks.statusColors[this.task.status]
    },
    taskDescription: function () {
        let description = this.task.description;
        if (description == null || description.length == 0) {
            description = "No description";
        };
        return description
    },
    taskEnd: function () {
        let end = this.task.end;
        if (end == this.task.start || end == null) {
            end = "-";
        };
        return end
    }
},
template: `
    <article class="media">
        <div class="card" 
            ref="card" 
            :data-id="task._id" 
            :data-rev="task._rev" 
            style="width: 100%; transition: all 0.5s ease-in-out;">
            <div class="card-content">
                <div class="is-pulled-right">
                    <div class="dropdown is-hoverable is-up is-right">
                    <div class="dropdown-trigger">
                        <div class="" aria-haspopup="true" aria-controls="dropdown-menu4">
                            <span class="tags has-addons">
                                <span :class="[statusColor, \'tag is-light is-capitalized\']">{{ task.status }}</span>
                                <span v-if="overdue" class="tag is-danger">Overdue</span>
                            </span>
                        </div>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">
                                <div class="field has-addons">
                                    <p class="control">
                                        <button @click="setStatus" class="button is-small is-light">
                                            Wait 
                                            
                                            return appTasks.statusColors[this.task.status]
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" class="button is-small is-light">
                                            Plan
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" class="button is-small is-light">
                                            Todo
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" class="button is-small is-light">
                                            Next
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" class="button is-small is-light">
                                            Doing
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="content">
                    <p class="title is-5">
                        {{ task.title }}
                    </p>
                    <p class="subtitle is-6">
                        {{ taskDescription }}
                    </p>
                    <nav class="level">
                        <div class="level-left">
                            <div class="tags has-addons">
                                <span class="tag">Project</span>
                                <span class="tag is-primary">{{ task.project }}</span>
                            </div>
                        </div>
                        <div class="level-right">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            Due
                                        </td>
                                        <td v-bind:class="[ overdue ? \'is-danger\' : \'\' ]" data-key="due">
                                            <time>{{ task.due }}</time>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Start
                                        </td>
                                        <td>
                                            <time>{{ task.start }}</time>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            End
                                        </td>
                                        <td>
                                            <time>{{ task.end }}</time>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </nav>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <div class="level-item">
                                <div class="dropdown is-up is-hoverable">
                                    <div class="dropdown-trigger">
                                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                                            <span>&#9776;</span>
                                        </button>
                                    </div>
                                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                                        <div class="dropdown-content">
                                            <div class="dropdown-item">
                                                <button v-on:click="deleteTask" 
                                                    ref="deletebtn" 
                                                    class="button is-danger is-small is-fullwidth">
                                                        Delete
                                                </button>
                                            </div>
                                            <div class="dropdown-item">
                                                <button v-on:click="cancelTask" 
                                                    class="button is-danger is-light is-small is-fullwidth">
                                                        Cancel
                                                    </button>
                                            </div>
                                            <div class="dropdown-item">
                                                <button v-on:click="completeTask" 
                                                    class="button is-success is-light is-small is-fullwidth">
                                                    Complete
                                                </button>
                                            </div>
                                            <div class="dropdown-item">
                                                <div class="field is-grouped">
                                                    <div class="field-label is-normal">
                                                        <label class="label">Due:</label>
                                                    </div>
                                                    <p class="control">
                                                        <button v-on:click="clearDueDate" 
                                                            class="button is-info is-light is-small is-fullwidth">
                                                            Clear
                                                        </button>
                                                    </p>
                                                    <p class="control">
                                                        <button v-on:click="rescheduleModal_toggle" 
                                                            class="button is-info is-light is-small is-fullwidth">
                                                            Reschedule
                                                        </button>
                                                    </p>
                                                    <p class="control">
                                                        <button v-on:click="postpone1Day" 
                                                            class="button is-info is-light is-small is-fullwidth">
                                                            Postpone 1 day
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                            <hr class="dropdown-divider">
                                            <a href="#" class="dropdown-item">
                                                Change status
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a class="level-item">
                            </a>
                        </div>
                        <div class="level-right">
                            <a class="level-item">
                                <small class="has-text-grey-lighter has-text-weight-light is-7 is-family-code subtitle">{{ task._id }}</small>
                            </a>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <div ref="rescheduleModal" class="modal">
            <div v-on:click="rescheduleModal_toggle" class="modal-background""></div>
            <div ref="rescheduleModalContent" class="modal-content">
                <div class="box content">
                    <form>
                        <div class="field is-grouped">
                            <div class="field-label is-normal">
                                <label class="label">Due date</label>
                            </div>
                            <p class="control">
                                <input ref="rescheduleInputDueDate" class="input" type="date" name="due_date">
                            </p>
                            <p class="control">
                                <input ref="rescheduleInputDueTime" class="input" type="time" name="due_time">
                            </p>
                        </div>
                    </form>
                    <button v-on:click="setDueDate" 
                        class="button is-link is-small is-fullwidth">
                        Save
                    </button>    
                </div>
            </div>
            <button v-on:click="rescheduleModal_toggle" class="modal-close is-large" aria-label="close"></button>
        </div>
    </article>
`
});

function new_entry_form() {
template = document.querySelector("#templateFormNewEntry");
clone = document.importNode(template.content, true);

let _id = uuidv4();
clone.querySelector("input[name=_id]").value = _id;
var d = new Date();
var datetime_iso = d.toISOString();
var date_iso = datetime_iso.slice(0, 10);
var time_iso = datetime_iso.slice(11, 16);
clone.querySelector("input[name=due_date]").value = date_iso;
clone.querySelector("input[name=due_time]").value = time_iso;
clone.querySelector("input[name=start_date]").value = date_iso;
clone.querySelector("input[name=start_time]").value = time_iso;
clone.querySelector("input[name=end_date]").value = date_iso;
clone.querySelector("input[name=end_time]").value = time_iso;

let modal_content = modal.querySelector(".modal-content");
modal_content.textContent = "";
modal_content.appendChild(clone);
modal_toggle();
}

async function submit_form() {
console.log("Work in progress");
let form = modal.querySelector("form");

var date = new Date();
let doc = {
    _id:form._id.value,
    title:form.title.value,
    description:form.description.value,
    realm:"productivity",
    created:date.toISOString(),
    type:form.type.value,
    status:form.status.value,
    project:form.project.value,
    context:form.context.value,
    tags:[],
    priority:parseInt(form.priority.value),
    due:new Date(form.due_date.value + " " + form.due_time.value).toISOString(),
    start:new Date(form.start_date.value + " " + form.start_time.value).toISOString(),
    end:new Date(form.end_date.value + " " + form.end_time.value).toISOString()
};

if (form.tags.value.length > 0) {
    var tags_arr = form.tags.value.split(",");
    for (x in tags_arr) {
        y = tags_arr[x].trim();
        doc.tags.push(y)
    };
}

try {
    const response = await fetch(url_database, {
        method: "POST",
        body: JSON.stringify(doc), 
        headers: {
        "Content-Type": "application/json"
        }
    });
    const json = await response.json();
    notify("Success:" + JSON.stringify(json),"is-success",4000);
} catch (error) {
    errorHandler("Error:" + error,"is-danger");
}
};
