var app = new Vue({
    el: "#app",
    template: `
    <div class="section container">
        <div class="columns">
            <div class="column is-narrow">
                <aside class="menu">
                    <p class="menu-label">
                        Messages
                    </p>
                    <ul class="menu-list">
                        <li onclick="formNewMessage()"><a>New message</a></li>
                    </ul>
                    <p class="menu-label">
                        Tags
                    </p>
                    <ul id="tags_list" class="menu-list">
                        <li>
                            <a id="tags_inbox" data-tag="inbox" @click="getMessages('inbox')">Inbox
                                <span class="tag">{{ inboxCount }}</span>
                            </a>
                            <ul id="tags">
                                <li v-for="(tag, index) in tagsList" 
                                    v-bind:_id="tag._id" 
                                    v-bind:key="tag.key" 
                                    v-bind:index="index" 
                                    >
                                    <a v-on:click="getMessages(tag.key)" class="is-capitalized">
                                        {{ tag.key }}
                                        <span class="tag is-pulled-right">{{ tag.value }}</span>
                                    </a>
                                </li>
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
                <div class="tags has-addons">
                    <span class="tag">Messages total</span>
                    <a class="tag is-primary is-light">{{ totals.messages }}</a>
                </div>
            </div>
            <div class="column">
                <messages-help
                    v-if="showHelp"
                ></messages-help>
                <table class="table is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th class="is-narrow">
                                <span class="tag">{{ messages.length }}</span>
                            </th>
                            <th>From</th>
                            <th>Subject</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="message_list">
                        <messages-listItem 
                            v-for="(msg, index) in messages"  
                            v-bind:key="msg._id" 
                            v-bind:msg="msg" 
                            v-bind:index="index" 
                            @click="readMsg(index)" 
                        ></messages-listItem>
                    </tbody>
                </table>
                <div id="reader" v-if="activeMsgShow">
                    <div class="card">
                        <div class="card-content">
                            <p class="card-header-title">
                                <span v-if="activeMsgDeleted" class="is-danger tag">Deleted</span>
                                {{ activeMsgSubject }}
                            </p>
                            <div class="media">
                                <div class="media-left">
                                <figure class="image is-48x48">
                                    <img style="
                                        background-color: lightgray;
                                        width: 100%;
                                        height: 100%;" 
                                        class="is-rounded">
                                </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-4">{{ activeMsgSender }}</p>
                                    <p class="subtitle is-6">{{ activeMsgSender }}</p>
                                </div>
                            </div>
                            <div class="content">
                                {{ activeMsgBody }}
                                <br>
                                <time datetime="2016-1-1">yyyy-mm-dd</time>
                            </div>
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <a class="level-item">
                                    <small>
                                        <a @click="activeMsgMarkRead">
                                            Mark as read
                                        </a> · 
                                        <a @click="deleteActiveMsg">
                                            Delete
                                        </a> · 
                                        <a onclick="notify('Archiving N/A yet', 'is-warning', 4000)">
                                            Archive
                                        </a>
                                    </small>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data: {
        showHelp: false,
        totals:{
            messages: 0
        },
        tagsList: [],
        messages: [],
        activeMsgShow: false,
        activeMsgIndex:null,
        activeMsgId:null
    },
    methods: {
        activeMsgMarkRead: function () {
            console.log('Work in progress')
        },
        setActiveMsg: function (index) {
            app.activeMsgShow = true;
            app.activeMsgIndex = index;
            app.activeMsgId = app.messages[app.activeMsgIndex]._id;
        },
        deleteActiveMsg: function () {
            /*deleteActiveMsg
            removeTask: function(index) {
                this.tasks.splice(index, 1);
            },
            if not match active index and id, error, already deleted
            app.activeMsgId
            app.messages[
            */
            if (app.activeMsgId == this.messages[this.activeMsgIndex]._id) {
                deleteDocument(app.activeMsgId);
                Vue.set(this.messages[this.activeMsgIndex],'deleted',true);
            } else {
                notify("Already deleted","is-info",6000)
            };
            /* if result ok true? 
            this.messages[this.activeMsgIndex].deleted = true;
            */
        },
        help: function () {
            this.showHelp = !this.showHelp;
        },
        getTotals: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/totals?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
                data.rows.forEach( (aggregate) => {
                    app.totals[aggregate.key] = aggregate.value;
                });
            });
        },
        getTags: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/messages-tag-count?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
                data.rows.forEach( (aggregate) => {
                    app.tagsList.push(aggregate);
                });
            });
        },
        getMessages: function (tag = 'inbox') {
            app.activeMsgShow = false;
            /* create mango index to optimize query time */
            app.messages = [];
            loader_toggle();
            let mango = {
                "selector": {
                    "realm": "messages",
                    "tags": {
                        "$in": [tag]
                    }
                },
                "limit": 100
            };
            if (tag == 'inbox' || tag == 'untagged') {mango.selector.tags = []}
            fetch(url_mango, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(mango)
            })
            .then((resp) => resp.json())
            .then(function(data) {
                data.docs.forEach( (msg, index) => {
                    app.messages.push(msg);
                    if (index + 1 == data.docs.length) {
                        loader_toggle(false);
                        app.setActiveMsg(index);
                    }
                });
                if (data.docs.length == 0) {loader_toggle(false)};
            })
            .catch(function(error) {
                errorHandler("Looks like there was a problem: " + error);
                loader_toggle(false);
            });
        }
    },
    computed: {
        activeMsgDeleted: function () {
            if (app.messages[app.activeMsgIndex].deleted) {
                return true
            }
            return false
        },
        activeMsgSubject: function () {
            /*
            if (!app.activeMsgShow) {return "None"};
            */
            let txt = app.messages[app.activeMsgIndex].subject;
            return txt
        },
        activeMsgBody: function () {
            let txt = app.messages[app.activeMsgIndex].body;
            return txt
        },
        activeMsgSender: function () {
            let txt = app.messages[app.activeMsgIndex].sender;
            return txt
        },
        inboxCount: function () {
            const result = this.tagsList.find( ({ key }) => key === 'untagged' );
            if (this.tagsList.length > 0 && typeof result != 'undefined') {
                if (result.hasOwnProperty('value')) {return result.value};
            };
            return 0
        }
    }
});

Vue.component("messages-help", {
    template: `
    <div class="notification">
        <p>Untagged messages will be show in 'Inbox'</p>
    </div>
    `
});

Vue.component("messages-listItem", {
    props: ["msg"],
    template: `
        <tr :class="[ isSelected ? 'is-selected' : '' ]">
            <td @click="setActiveMsg" v-html="readStatus">&#128386;</td>
            <td @click="setActiveMsg">{{ msg.sender }}</td>
            <td @click="setActiveMsg">{{ msg.subject }}</td>
            <td>
                <div v-if="msgDeleted" class="is-danger tag">
                    Deleted
                </div>
                <div v-else>
                    <a :class="[ isSelected ? 'button is-small is-primary is-light' : 'button is-small is-light' ]" 
                        @click="deleteMsg" 
                        title="Delete message">
                        🗑
                    </a>
                </div>
            </td>
        </tr>
    `,
    methods: {
        deleteMsg: function () {
            /* use deleteDocument from pimpim.js
            deleteDocument(doc_id);
            Vue.set(this.messages[this.activeMsgIndex],'deleted',true);
            this.msg.deleted = true;
            */
           deleteDocument(this.msg._id);
           Vue.set(this.msg,'deleted',true);
            console.log("Delete function - work in progress", this.msg);
        },
        setActiveMsg: function () {
            app.activeMsgShow = true;
            app.activeMsgIndex = this.$attrs.index;
            app.activeMsgId = this.msg._id;
            /*
            is-selected
            app.activeMsg.msg = this.msg;
            app.activeMsg.sender = this.msg.sender;
            app.activeMsg.subject = this.msg.subject;
            app.activeMsg.body = this.msg.body;
            app.activeMsg._id = this.msg._id;
            */
        }
    },
    computed: {
        readStatus: function() {
            let txt = "&#128386;"; /*unread mail unicode icon*/
            if (this.msg.read) {
                txt = "Mark with read icon";
            };
            return txt
        },
        msgDeleted: function () {
            if (this.msg.deleted == true) {return true};
            return false
        },
        isSelected: function () {
            if ( app.activeMsgIndex == this.$attrs.index ) {return true};
            return false    
        }
    }
});



function formNewMessage() {
    let _id = uuidv4();
    var template = `
    <div class="modal">
        <div class="modal-background" onclick="removeForm()"></div>
        <div class="modal-content box">
        <form>
            <div class="field is-horizontal">
                <label class="label">Sender</label>
                <input class="input" type="text" name="sender" value="Reporting system">
                <label class="label">Recipient</label>
                <input class="input" type="text" name="recipient" value="this machine">
            </div>
            <div class="field is-horizontal">
                <label class="label">Subject</label>
                <input class="input" type="text" name="subject" placeholder="A very interesting message">
            </div>
            <div class="field is-horizontal">
                <label class="label">Tags</label>
                <input class="input" type="text" name="tags" placeholder="Separated, by, commas">
            </div>
            <div class="field">
                <label class="label">Body</label>
                <textarea class="textarea" name="body"></textarea>
            </div>
            <div class="field">
                <label class="label">ID</label>
                <input  class="input" type="text" name="_id" value="${_id}">
            </div>
        </form>
        <button class="button is-primary" onclick="submitForm()">Send</button>
        </div>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" onclick="removeForm()"></button>
        `;
    let clone = document.createElement('DIV');
    clone.id = 'formNewEntry';
    clone.innerHTML = template;
    document.body.appendChild(clone);
    let modal = clone.querySelector(".modal");
    modal.classList.add('is-active');
}

async function submitForm() {
    let formcontainer = document.querySelector('#formNewEntry');
    let form = formcontainer.querySelector("form");

    var date = new Date();
    let doc = {
        _id:form._id.value,
        realm:"messages",
        sender:form.sender.value,
        recipient:form.recipient.value,
        subject:form.subject.value,
        body:form.body.value,
        created:date.toISOString(),
        read:false,
    };

    doc.tags = parseTags(form.tags.value);

    postForm(doc);
};


app.getTags();
app.getMessages();
app.getTotals();