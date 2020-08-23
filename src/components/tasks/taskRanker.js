
const priorityWeighting = {
    1: 3000,
    2: 1000,
    3: 400,
    4: 200,
    5: 50,
    6: -50,
    7: -100,
    8: -200,
    9: -300,
    10: -500
}

const statusWeighting = {
    doing: 100,
    next: 50,
    todo: 25,
    plan: 10,
    wait: -100,
    cancelled: -20000,
    done: -10000,
}

function rankTask(task) {

    let extraFields = {
        score: 0,
        discoveries: [],
    }
    let t = {
        ...task,
        ...extraFields
    }
    t.score += statusWeighting[t.status]

    if (t.description != null) {
        t.score += 5;
    }

    if (t.start) {
        let dateNow = new Date().getTime();
        let taskDate = new Date(t.start).getTime();
        t.score += Math.round((dateNow - taskDate) / (1000 * 60 * 60 * 24));
    }

    t.score += priorityWeighting[t.priority] || 0;
    if (t.priority === 1) t.discoveries.push("Important and urgent");
    if (t.dependency) t.discoveries.push("Task has a dependency");
    if (t.tags != null) t.score += 20;
    if (t.project != null) t.score += 20;

    /**
     * 
     * @param {Date} d1 
     * @param {Date} d2 
     */
    function isDueToday(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    if (t.due && isDueToday(new Date(t.due), new Date())) {
        t.score += 2000;
        t.discoveries.push("Due today");
    }

    if (new Date(t.due) < new Date()) {
        t.score += 3000;
        t.discoveries.push("Overdue");
    }

    return t
}

/**
 * Used for ranking/grading a tasks (or array of tasks) importance based on a set of criteria's
 * @param {Object} payload - Can be a 'task document' {} or an array of 'tasks' [{},{}]
 */
export default async function (payload) {

    if (Array.isArray(payload)) {
        console.log('Add iterator functionality')
        return await Promise.all(payload.map(async (row) => {
            let task = row.doc || row;
            return rankTask(task)
        }));
    } else {
        return rankTask(payload)
    }

}