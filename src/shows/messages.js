var app = new Vue({
    el: "#app",
    template: `
    <div>
    </div>
    `,
    data: {
    },
    methods: {
    }
});

Vue.component("productivity-task", {
    props: ["task"],
    methods: {
    },
    computed: {
    },
    template: `
    `
});


/* to migration */

<div class="section container">
    <div class="columns">
        <div class="column is-one-quarter">
            <aside class="menu">
                <p class="menu-label">
                    Messages
                </p>
                <ul class="menu-list">
                    <li onclick="new_message_form()"><a>New message</a></li>
                </ul>
                <p class="menu-label">
                    Tags
                </p>
                <ul id="tags_list" class="menu-list">
                    <li>
                        <a id="tags_inbox" data-tag="inbox" onclick="fill_message_list()">inbox</a>
                        <ul id="tags">
                        </ul>
                    </li>
                </ul>
            </aside>
            <div class="tags has-addons">
                <span class="tag">Mails total</span>
                <a id="mailTotal" class="tag is-primary is-light">0</a>
            </div>
        </div>
        <div class="column">
            <table class="table is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th></th>
                        <th>From</th>
                        <th>Subject</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="message_list">
                </tbody>
            </table>
            <hr>
            <div id="reader" class="box">
                <p>Loading..</p>
            </div>
        </div>
    </div>
</div>
<script>
var module_name = "messages";
let tags_arr = {inbox:0};
let tags = document.querySelector("#tags");
let message_list = document.querySelector("#message_list");
let reader = document.querySelector("#reader");
let mailbox = [];
var url_mango = window.location.origin + "/" + database + "/_find";

function render_tags() {
    tags.textContent = "";
    for (tag in tags_arr) {
        let item = document.createElement("LI");
        let itemContent = document.createElement("A");
        itemContent.dataset.tag = tag;
        itemContent.onclick = function() { 
            fill_message_list(this.dataset.tag);
        };
        itemContent.style.cursor = "pointer";
        itemContent.textContent = tag + " (" + tags_arr[tag] + ")";
        item.appendChild(itemContent);
        if (tag == "inbox") {
            document.querySelector("#tags_inbox").innerHTML = itemContent.textContent;
        } else {
            tags.appendChild(item);
        };
    }
    fill_message_list();
}

function fill_message_list(tag="inbox") {
    let tags_list = document.querySelector("#tags_list");
    let find_active_tag = tags_list.querySelector(".is-active");
    if (find_active_tag) {
        find_active_tag.classList.remove("is-active");
    };
    let set_active_tag = tags_list.querySelector(`[data-tag="${tag}"]`);
    set_active_tag.classList.add("is-active");

    message_list.textContent = "";
    filtered_mailbox = mailbox.filter(msg => {
        if (tag == "inbox") {
            return msg.tags.length == 0;
        }
        return msg.tags.includes(tag);
    });
    for (mail of filtered_mailbox) {
        let row = message_list.insertRow(0);
        row.style.cursor = "pointer";
        row.dataset.mailboxIndex = mailbox.indexOf(mail);
        row.onclick = function() {
            read_mail(this.dataset.mailboxIndex);
        };
        let cell0 = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        cell0.innerHTML = "&#128386;";
        cell1.innerHTML = mail.sender;
        cell2.innerHTML = mail.subject;
        cell3.innerHTML = `<a class="button" 
            onclick="delete_mail(this)" 
            title="Delete message">🗑</a`;
        if (mail.deleted == true) {
            cell0.classList.add("is-danger");
            cell1.classList.add("is-danger");
            cell2.classList.add("is-danger");
            cell3.classList.add("is-danger");
            cell3.innerHTML = "Deleted";
        }
    }
    read_mail();
}

function read_mail(arrIndex="latest") {
    if (arrIndex == "latest") {
        arrIndex = message_list.querySelector("tr").dataset.mailboxIndex;
    }
    let m = mailbox[arrIndex];
    msg = "<p>From: " + m.sender + "</p>";
    msg += "<p>Message: " + m.body + "</p>";
    reader.innerHTML = msg;
}

function delete_mail(obj) {
    let row = obj.closest("tr");
    let m = mailbox[row.dataset.mailboxIndex];
    fetch(`${window.location.origin}/${database}/${m._id}?rev=${m._rev}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log("DELETED: ",data);
        m.deleted = true;
    })
    .catch(function(error) {
        console.log("Looks like there was a problem: ", error);
    });
    let actions_td = row.querySelectorAll("td");
    actions_td[3].textContent = "deleted";
    actions_td.forEach( (td) => {
        td.classList.add("is-danger");
    });
}

function fetch_mail() {
    loader_toggle();
    let mango = {   "selector": {
                    "realm": "messages"
                    },
                "limit": 100
            };
    fetch(url_mango, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mango)
    })
    .then((resp) => resp.json())
    .then(function(data) {
        let mt = document.querySelector("#mailTotal");
        mt.innerHTML = data.docs.length;
        data.docs.forEach( (mail, index) => {
            mailbox.push(mail);
            if (mail.tags.length > 0) {
                for (x of mail.tags) {
                    tags_arr[x] = (tags_arr[x]+1) || 1 ;
                }
            } else {
                tags_arr.inbox ++
            }
            if (index == data.docs.length - 1) {
                render_tags();
                loader_toggle(false);
            }
        });
    })
    .catch(function(error) {
        errorHandler("Looks like there was a problem: " + error);
        loader_toggle(false);
    });
}

function new_message_form() {
    let _id = uuidv4();
    form = `
        <form class="" 
                action="/${database}/_design/pimpim/_update/postmessage" 
                method="post" 
                onsubmit="result_notification()" 
                target="notification_frame">
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
            <button class="button is-primary">Send</button>
        </form>
        `;
    reader.innerHTML = form;
}

fetch_mail();
</script>


/* update handler */

function(doc, req) {

if (doc) {
    return [doc, toJSON({'error': 'request already filed'})]
}

var date = new Date();
var newdoc = req.form;
newdoc.realm = 'messages';
newdoc.created = date.toISOString();

if (req.form.tags.length > 0) {
    var tags_arr = [];
    var tags_str = req.form.tags.split(',');
    for (x in tags_str) {
        y = tags_str[x].trim();
        tags_arr.push(y)
    };
    newdoc.tags = tags_arr;
} else {
    newdoc.tags = [];
}

return [newdoc, toJSON({'success':'ok'})]
}