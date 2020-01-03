var app = new Vue({
    el: "#app",
    data: {
        showHelp: false,
        todayCount: 0,
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
    template: `
    <div>
        <div class="section container">
            <div class="columns">
                <div class="column is-narrow">
                    <aside class="menu">
                        <p class="menu-label">
                            TASKS
                        </p>
                        <ul class="menu-list">
                            <li onclick="new_entry_form()"><a>New task</a></li>
                            <li v-on:click="getTasks('today')">
                                <a>Today & overdue <span class="tag">{{ todayCount }}</span></a></li>
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
                            <li data-tag="plan" v-on:click="getTasks('statusplan')">
                                <a>Plan <span class="tag">{{ taskStatuses.plan }}</span></a></li>
                            <li data-tag="wait" v-on:click="getTasks('statuswait')">
                                <a>Wait <span class="tag">{{ taskStatuses.wait }}</span></a></li>
                            <li>
                                <ul>
                                    <li data-tag="done" v-on:click="getTasks('statusdone')">
                                        <a>Done <span class="tag">{{ taskStatuses.done }}</span></a></li>
                                    <li data-tag="cancelled" v-on:click="getTasks('statuscancelled')">
                                        <a>Cancelled <span class="tag">{{ taskStatuses.cancelled }}</span></a></li>
                                </ul>
                            </li>
                        </ul>
                        <p class="menu-label">
                            Misc
                        </p>
                        <ul class="menu-list">
                            <li><a @click="help">Help</a></li>
                        </ul>
                    </aside>
                </div>
                <div class="column">
                    <productivity-help
                        v-if="showHelp"
                    ></productivity-help>
                    <article class="message is-primary">
                        <div class="message-body">
                            Task management
                            <br>
                            <p>Showing {{ tasks.length }} tasks</p>
                        </div>
                    </article>
                    <div id="view_container">
                        <transition-group name="tasks" tag="div">
                            <productivity-task
                                v-for="(task, index) in tasks" 
                                v-bind:key="task._id" 
                                v-bind:task="task" 
                                v-bind:index="index" 
                                class="tasks-item"
                            ></productivity-task>
                        </transition-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {
        removeTask: function(index) {
            this.tasks.splice(index, 1);
        },
        help: function () {
            this.showHelp = !this.showHelp;
        },
        renderStatusList: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/task-status-count?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
                data.rows.forEach( (aggregate) => {
                        app.taskStatuses[aggregate.key] = aggregate.value;
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
                    app.tasks.push(doc);
                    if (index + 1 == dbData.docs.length) {loader_toggle(false)}
                });
                if (dbData.docs.length == 0) {loader_toggle(false)};
                if (list == "today") {
                    app.todayCount = dbData.docs.length;
                }
            })
            .catch(function(error) {
                errorHandler(error);
            });
        }
    }
});

Vue.component("productivity-help", {
    template: `
    <p>Hover status tags to change status</p>
    example for tags
    `
});

Vue.component("productivity-task", {
props: ["task"],
methods: {
    setStatus: async function (btn) {
        let txt = btn.path[0].textContent;
        let value = txt.trim().toLowerCase();
        this.task.status = value;
        let result = updateDocument(this.task, true);
        notify( "Task: " + this.task._id + " changed status to: " + this.task.status,"is-success",4000);
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
        let result = await updateDocument(this.task);
        this.rescheduleModal_toggle();
        this.$refs.card.style.filter = "saturate(0.6) opacity(0.2)";
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
        let result = await updateDocument(this.task);
        notify("Postponed task: " + this.task._id,"is-info",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-warning">Due tomorrow</span>`;
        this.$refs.card.style.filter = "saturate(0.6) opacity(0.2)";
        /*this.$delete(this.task, index);
        this.$delete(this.task);
        Vue.delete(this.tasks, index)
        Vue.delete(this.tasks, this.task.key);
        */
       let index = this.$attrs.index;
       app.removeTask(index);
    },
    clearDueDate: function () {
        this.task.due = null;
        let result = updateDocument(this.task, true);
    },
    completeTask: async function() {
        this.task.status = "done";
        this.task.end = new Date().toISOString();
        let result = updateDocument(this.task);
        notify("Completed task:" + this.task._id,"is-success",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-success">Done</span>`;
        this.$refs.card.style.filter = "saturate(0.6) opacity(0.25)";
        this.$refs.card.style.transform = "scale(0.9);";
    },
    cancelTask: async function() {
        this.task.status = "cancelled";
        this.task.end = new Date().toISOString();
        let result = updateDocument(this.task);
        notify("Cancelled task:" + this.task._id,"is-success",4000);
        this.$refs.tags.innerHTML = `<span class="tag is-danger is-light">Cancelled</span>`;
        this.$refs.card.style.filter = "blur(1px) saturate(0.6) opacity(0.4)";
    },
    deleteTask: async function() {
            if (this.$refs.deletebtn.textContent == "Sure?") {
                let result = await deleteDocument(this.task._id);
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
    },
    datePurdifier: function(dateIn) {
        let d = new Date(dateIn);
        let date = d.toDateString();
        let time = d.toLocaleTimeString();
        let dateOut = `${date} ${time}`;
        return dateOut
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
   dueFormatted: function() {
       if (this.task.due == null) {
           return "-"
       }
        return this.datePurdifier(this.task.due)
   },
   startFormatted: function() {
       return this.datePurdifier(this.task.start);
   },
   endFormatted: function() {
        let end = this.task.end;
        if (end == this.task.start || end == null) {
            end = "-";
        } else {
            end = this.datePurdifier(end);
        }
        return end
   },
   statusColors: function () {
       return app.statusColors
   },
    statusColor: function () {
        return app.statusColors[this.task.status]
    },
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
    taskDescription: function () {
        let description = this.task.description;
        if (description == null || description.length == 0) {
            description = "No description";
        };
        return description
    }
},
template: `
    <article class="media">
        <div class="card" 
            ref="card" 
            :data-id="task._id" 
            :data-rev="task._rev" 
            :data-indxz="this.index" 
            style="width: 100%; transition: all 0.5s ease-in-out;">
            <div class="card-content">
                <div class="is-pulled-right">
                    <div class="dropdown is-hoverable is-up is-right">
                    <div class="dropdown-trigger">
                        <div class="" aria-haspopup="true" aria-controls="dropdown-menu4">
                            <span ref="tags" class="tags has-addons">
                            {{ this.index }}
                                <span :class="[statusColor, 'tag is-capitalized']">{{ task.status }}</span>
                                <span v-if="overdue" class="tag is-danger">Overdue</span>
                            </span>
                        </div>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div class="dropdown-content">
                            <div class="dropdown-item">
                                <div class="field has-addons">
                                    <p class="control">
                                        <button @click="setStatus" :class="[statusColors.wait, 'button is-small']">
                                            Wait
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" :class="[statusColors.plan, 'button is-small']">
                                            Plan
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" :class="[statusColors.todo, 'button is-small']">
                                            Todo
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" :class="[statusColors.next, 'button is-small']">
                                            Next
                                        </button>
                                    </p>
                                    <p class="control">
                                        <button @click="setStatus" :class="[statusColors.doing, 'button is-small']">
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
                    <p class="subtitle is-6" style="max-height: 25vh;overflow: auto;">
                        {{ taskDescription }}
                    </p>
                    <nav class="level">
                        <div class="level-left">
                            <div class="level-item">
                                <div class="tags has-addons">
                                    <span class="tag">Project</span>
                                    <span class="tag is-primary">{{ task.project }}</span>
                                </div>
                            </div>
                            <div class="level-item">
                                <div class="tags has-addons">
                                    <span class="tag">Project</span>
                                    <span class="tag is-primary">{{ task.project }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="level-right">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            Due
                                        </td>
                                        <td v-bind:class="[ overdue ? 'is-danger' : '' ]" data-key="due">
                                            <time>{{ dueFormatted }}</time>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Start
                                        </td>
                                        <td>
                                            <time>{{ startFormatted }}</time>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            End
                                        </td>
                                        <td>
                                            <time>{{ endFormatted }}</time>
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
                                <span class="icon is-small has-text-dark" 
                                    @click="postpone1Day" title="Postpone to tomorrow">
                                    ⌚
                                </span>
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
    var template = `
    <div class="modal">
        <div class="modal-background" onclick="removeForm()"></div>
        <div class="modal-content">

        <div class="card" style="margin-bottom: 1.8rem;">
            <div class="card-content">
                <form name="FormNewEntry" >
                    <p class="subtitle">
                        New object
                    </p>
                    <div class="field">
                        <label for="_id" class="label is-small">Generated ID</label>
                        <input class="input is-small" type="text" name="_id" value="">
                    </div>
                    <div class="field">
                        <label class="label is-primary" for="title">Title</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Title" name="title" required>
                        </div>
                    </div>
                    <div class="field">
                        <label for="description" class="label">Description</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Description" name="description">
                        </div>
                    </div>
                    <div class="field">
                        <label for="tags" class="label">Tags</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Each tag, separated, by a comma" name="tags">
                        </div>
                    </div>
                    <details>
                        <summary>More fields</summary>
                        <div class="field is-horizontal">
                            <div class="field-label">
                                <label class="label">Type</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <label class="radio">
                                            <input type="radio" name="type" value="task" checked>
                                            Task
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="type" value="project">
                                            Project
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="type" value="note">
                                            Note
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <div class="field-label">
                                <label class="label">Status</label>
                            </div>
                            <div class="field-body">
                                <div class="field is-narrow">
                                    <div class="control">
                                        <label class="radio">
                                            <input type="radio" name="status" value="plan" checked>
                                            Plan
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="status" value="todo">
                                            Todo
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="status" value="next">
                                            Next
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="status" value="doing">
                                            Doing
                                        </label>
                                        <label class="radio">
                                            <input type="radio" name="status" value="wait">
                                            Wait
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label is-primary" for="project">Project</label>
                            <div class="control">
                                <input class="input" type="text" name="project" value="Undefined">
                            </div>
                        </div>
                        <div class="field is-grouped">
                            <div class="field-label is-normal">
                                <label class="label">Due date</label>
                            </div>
                            <p class="control">
                                <input class="input" type="date" name="due_date">
                            </p>
                            <p class="control">
                                <input class="input" type="time" name="due_time">
                            </p>
                        </div>
                        <div class="field is-grouped">
                            <div class="field-label is-normal">
                                <label class="label">Start</label>
                            </div>
                            <p class="control">
                                <input class="input" type="date" name="start_date">
                            </p>
                            <p class="control">
                                <input class="input" type="time" name="start_time">
                            </p>
                        </div>
                        <div class="field is-grouped">
                            <div class="field-label is-normal">
                                <label class="label">End</label>
                            </div>
                            <p class="control">
                                <input class="input" type="date" name="end_date">
                            </p>
                            <p class="control">
                                <input class="input" type="time" name="end_time">
                            </p>
                        </div>
                        <div class="field">
                            <label class="label is-primary" for="priority">Priority</label>
                            <div class="control">
                                <input class="input" type="number" name="priority" min="1" max="10" value="2" required>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label is-primary" for="context">Context</label>
                            <div class="control">
                                <input class="input" type="text" name="context">
                            </div>
                        </div>
                    </details>
                </form>
            </div>
            <footer class="card-footer">
                <button class="card-footer-item button is-inverted is-link is-paddingless" onclick="submit_form()">Submit</button>
                <button class="card-footer-item button is-inverted is-link is-paddingless" onclick="removeForm()">Cancel</button>
            </footer>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="removeForm()"></button>
</div>
`;
    let clone = document.createElement('DIV');
    clone.id = 'formNewEntry';
    clone.innerHTML = template;
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
    document.body.appendChild(clone);
    let modal = clone.querySelector(".modal");
    modal.classList.add('is-active');
}

async function submit_form() {
    let formcontainer = document.querySelector('#formNewEntry');
    let form = formcontainer.querySelector("form");

    let dueDate = null;
    if (form.due_date.value != "") {
        dueDate = new Date(form.due_date.value + " " + form.due_time.value).toISOString();
    };

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
        priority:parseInt(form.priority.value),
        due:dueDate,
        start:new Date(form.start_date.value + " " + form.start_time.value).toISOString(),
        end:new Date(form.end_date.value + " " + form.end_time.value).toISOString()
    };

    doc.tags = parseTags(form.tags.value);
    postForm(doc);
};

app.renderStatusList();
app.getTasks("today");