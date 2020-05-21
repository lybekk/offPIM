const tasks = {
    state: {
        tasksAggregate: {
            today: 0,
            overdue: 0,
            tomorrow: 0,
            doneToday: 0,
            initiated: false
        },
        statusColors: {
            cancelled: "error",
            wait: "secondary",
            plan: "secondary",
            todo: "primary",
            next: "warning",
            doing: "info",
            done: "success"
        },
        statusIcons: {
            cancelled: "mdi-close-circle",
            wait: "mdi-progress-clock",
            plan: "mdi-progress-wrench",
            todo: "mdi-circle-double",
            next: "mdi-arrow-right-circle-outline",
            doing: "mdi-circle-slice-5",
            done: "mdi-check-circle"
        },
        taskStatuses: {
            "plan": 0,
            "wait": 0,
            "next": 0,
            "todo": 0,
            "cancelled": 0,
            "done": 0,
            "doing": 0
        },
        taskPriorities: {
            1: 0,
            2: 0,
            3: 0,
            4: 0
        },
        postponed: [],
        openProjects: []
    },
    mutations: {
        setTaskField(state, payload) {
            const index = state.data.findIndex(({ _id }) => _id === payload._id);
            let task = state.data[index];
            task[payload.field] = payload.value;
            this.dispatch('insertDocument', { doc: task });
        },
        setTaskStatuses(state, payload) {
            state.taskStatuses[payload.key] = payload.value;
        },
        setTaskPriorities(state, payload) {
            state.taskPriorities[payload.key] = payload.value;
        },
        addPostponed(state, payload) {
            state.postponed.push(payload)
        },
        setTasksAggregate(state, payload) {
            state.tasksAggregate[payload.key] = payload.value;
        },
        flushOpenProjects(state) {
            state.openProjects = []
        },
        addOpenProjects(state, payload) {
            state.openProjects = payload
        },

    },
    actions: {
        tasksDueAggregation: async function (context) {
            let aggregate = {
                today: 0,
                tomorrow: 0,
                overdue: 0
            }

            let today = new Date();
            const todayDate = today.toISOString().slice(0, 10);
            let tomorrowMilli = new Date().setDate(today.getDate() + 1);
            let tomorrow = new Date(tomorrowMilli);
            const tomorrowDate = tomorrow.toISOString().slice(0, 10);
            let dayAfterTomorrowMilli = new Date().setDate(today.getDate() + 2);
            let dayAfterTomorrow = new Date(dayAfterTomorrowMilli);
            const dayAfterTomorrowDate = dayAfterTomorrow.toISOString().slice(0, 10);

            let yesterdayMilli = new Date().setDate(today.getDate() - 1);
            let yesterday = new Date(yesterdayMilli);
            const yesterdayDate = yesterday.toISOString().slice(0, 10);


            try {
                let options = {
                    limit: 400, // consider controlling this value with vuex
                    group: true,
                    include_docs: false
                };
                let data = await window.db.query('offpim/tasks-due', options);
                data.rows.forEach(doc => {
                    if (doc.key > todayDate && doc.key < dayAfterTomorrowDate) {
                        aggregate.tomorrow += doc.value
                    }

                    if (doc.key.slice(0, 10) == todayDate) {
                        aggregate.today += doc.value
                    }
                    if (doc.key < todayDate) {
                        aggregate.overdue += doc.value
                    }
                });

                context.commit('setTasksAggregate', { key: 'today', value: aggregate.today });
                context.commit('setTasksAggregate', { key: 'tomorrow', value: aggregate.tomorrow });
                context.commit('setTasksAggregate', { key: 'overdue', value: aggregate.overdue });
            } catch (error) {
                context.dispatch("infoBridge", {
                    text: 'Task aggregation: ' + error,
                    color: "error",
                });
            }

            try {
                let options = {
                    startkey: yesterdayDate,
                    endkey: tomorrowDate,
                    limit: 400, // consider controlling this value with vuex
                    reduce: false,
                    include_docs: false
                };
                let data = await window.db.query('offpim/tasks-done', options);
                console.log('Fix this. Tasks aggregation tasks done today test: ', data) //dataDoneToday
                context.commit('setTasksAggregate', { key: 'doneToday', value: data.rows.length });
                context.commit('setTasksAggregate', { key: 'initiated', value: true });
            } catch (error) {
                context.dispatch("infoBridge", {
                    text: 'Task aggregation: ' + error,
                    color: "error",
                });
            }
            return true
        },

        async populateOpenProjects(context) {
            this.commit('flushOpenProjects');
            try {
                let data = await window.db.query('offpim/tasks-projects', {
                    reduce: false,
                    keys: ["wait", "plan", "todo", "next", "doing"],
                    include_docs: true
                });
                const projects = []
                for await (let row of data.rows) {
                    projects.push({ _id: row.id, title: row.doc.title })
                }
                context.commit('addOpenProjects', projects)
            } catch (error) {
                context.dispatch("infoBridge", {
                    text: 'Fetching open projects: ' + error,
                    color: "error",
                });
            }
        },

        async getTaskStatuses(context) {

            try {
                var result = await window.db.query('offpim/task-status-count', {
                    group: true
                });
                result.rows.forEach((aggregate) => {
                    context.commit('setTaskStatuses', aggregate)
                });
            } catch (err) {
                console.log('Task status count index missing. If this is the first run. This is completely normal: ', err)
            }
        },
        getTaskPriorities(context) {
            window.db.query('offpim/task-priority-count', {
                group: true
            }).then(function (data) {
                data.rows.forEach((aggregate) => {
                    context.commit('setTaskPriorities', aggregate)
                });
            }).catch(function (error) {
                context.dispatch("infoBridge", {
                    text: 'Getting task priorities failed' + error,
                    color: "error",
                });
            });

        },
        getTasks(context, payload) {
            let list = payload;
            context.commit('toggleLoader');
            let mango = {
                selector:
                {
                    productivity: true,
                    type: "task",
                },
                limit: 50
            };
            if (list.slice(0, 6) == "status") {
                mango.selector.status = list.slice(6);
            } else if (list.slice(0, 7) == "project") {
                mango.selector["$nor"] = [
                    { "status": "cancelled" },
                    { "status": "done" }
                ];
                mango.selector.project = list.slice(7);
            } else if (list.slice(0, 8) == "priority") {
                mango.selector["$nor"] = [
                    { "status": "cancelled" },
                    { "status": "done" }
                ];
                const pri = list.slice(8);
                mango.selector.priority = parseInt(pri);
            } else if (list.slice(0, 11) == "postponed5x") {
                mango.selector["$nor"] = [
                    { "status": "cancelled" },
                    { "status": "done" }
                ];
                mango.selector.postponed = { "$gt": 5 };
            } else if (list.slice(0, 8) == "tomorrow") {
                mango.selector["$nor"] = [
                    { "status": "cancelled" },
                    { "status": "done" },
                    { "due": null }
                ];
                let today = new Date();
                let dayAfterTomorrowMilli = new Date().setDate(today.getDate() + 2);
                let dayAfterTomorrow = new Date(dayAfterTomorrowMilli);
                mango.selector.due = {
                    "$gt": today.toISOString().slice(0, 10),
                    "$lt": dayAfterTomorrow.toISOString().slice(0, 10)
                };
            } else {
                mango.selector["$nor"] = [
                    { "status": "cancelled" },
                    { "status": "done" },
                    { "due": null }
                ];
                let d = new Date();
                d.setDate(d.getDate() + 1);
                mango.selector.due = { "$lt": d.toISOString().slice(0, 10) };
            }

            window.db.find(mango)
                .then(function (data) {

                    context.commit('addDataArray', data.docs)

                }).catch(function (error) {
                    context.commit('toggleLoader');
                    context.dispatch("infoBridge", {
                        text: 'Getting tasks failed: ' + error,
                        color: "error",
                    });
                });

        },
        getTasksTagList: async function (context) {
            try {
                const result = await window.db.query('offpim/tasks-tag-count', {
                    group: true
                });
                context.commit('setTagList', result)

            } catch (error) {
                context.dispatch("infoBridge", {
                    text: 'Failed fetching tasks tag count: ' + error,
                    color: "error",
                });
            }

        }
    },
    getters: {
        getOpenProjects: state => {
            return state.openProjects
        },
        getTaskStatus: (state) => (id) => {
            console.log(state)
            let task = state.data.find(task => task._id === id)
            return task.status
        },
        getTaskStatuses: state => {
            return state.taskStatuses
        },
        getTaskPriorities: state => {
            return state.taskPriorities
        },
        getPostponedTasks: state => {
            return state.postponed
        },
        getTasksAggregate: state => {
            return state.tasksAggregate
        },
        getStatusColors: state => {
            return state.statusColors
        },
        getStatusIcons: state => {
            return state.statusIcons
        },
    },
}

export default tasks