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

<div class="section">
    <div class="columns">
        <div class="column is-one-quarter">
            <aside class="menu">
                <p class="menu-label">
                    LOGBOOK
                </p>
                <ul class="menu-list">
                    <li onclick="new_journal_form()"><a>New entry</a></li>
                    <li onclick="get_last_entries_by_count(30)"><a>30 last entries</a></li>
                </ul>
            </aside>
        </div>
        <div class="column">
            <div id="view_container">
                <article class="message is-primary">
                    <div class="message-body">
                      Journal. Welcome
                    </div>
                </article>
            </div>
        </div>
    </div>
</div>

<template id="templateFormNewJournalEntry">
    <div class="card" style="margin-bottom: 1.8rem;">
        <form class="" 
                name="FormNewJournalEntry" 
                method="POST" 
                onsubmit="result_notification()" 
                target="notification_frame">
        <div class="card-content">
            <p class="subtitle">
                New entry:
            </p>
                <div class="field">
                    <label for="_id" class="label is-small">Generated ID</label>
                    <input class="input is-small" type="text" name="_id" value="">
                </div>
                <div class="field">
                    <label class="label" for="details">Details</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Details" name="details" required>
                    </div>
                </div>
                <div class="field">
                    <label for="start" class="label">Start (datetime)</label>
                    <div class="control">
                        <input class="input" type="datetime-local" placeholder="Start date+time" name="start" required>
                    </div>
                </div>
                <div class="field">
                    <label for="end" class="label">End (datetime)</label>
                    <div class="control">
                        <input class="input" type="datetime-local" placeholder="End date+time" name="end" required>
                    </div>
                </div>
                <div class="field">
                    <label for="category" class="label">Category</label>
                    <div class="control">
                        <input class="input" type="category" placeholder="Category" name="category" value="Uncategorized" required>
                    </div>
                </div>
            </div> <!-- Weirdly placed div because card footer items will look great -->
            <footer class="card-footer">
                <input type="submit" class="card-footer-item button is-inverted is-link is-paddingless" value="Submit">
                <input class="card-footer-item button is-inverted is-link is-paddingless" 
                    value="Cancel" onclick="remove_form(this)">
            </footer>
        </form>
    </div>
</template>
<!-- <input type="submit" value="Submit"> -->
<!-- logbook, saga, journal -->

<script>
var module_name = "journal";
var main = document.querySelector("#view_container");

function remove_form(obj) {
    obj.closest(".card").remove();
}

function new_journal_form(){
    template = document.querySelector("#templateFormNewJournalEntry");
    clone = document.importNode(template.content, true);
    let _id = uuidv4();
    let form = clone.querySelector("form");
    form.action = "/" + database + "/_design/pimpim/_update/postjournal";
    clone.querySelector("input[name=_id]").value = _id;
    let now = new Date().toISOString().slice(0, 16);
    clone.querySelector("input[name=start]").value = now;
    clone.querySelector("input[name=end]").value = now;
    main.insertBefore(clone, main.firstChild);
}

function get_last_entries_by_count(count) {
    main.innerHTML = "";
    loader_toggle();
    let now = new Date().toISOString().slice(0, 16);
    let mango = {
                    "selector": {
                        "realm": "journal",
                        "created": { "$lte": now }
                    },
                    "limit": count,
                    "sort": [
                        { "created": "desc" }
                    ]
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
        let count = 0;
        data.docs.forEach( (doc) => {
            populate(doc);
            count++;
            if (count == data.docs.length - 1) {loader_toggle(false)}
        });
    })
    .catch(function(error) {
        console.log("Looks like there was a problem: ", error);
    });
}

function populate(doc) {
    let datetime;
    if (doc.start == doc.end) {
        datetime = doc.start;
    } else {
        datetime = doc.start + " - " + doc.end;
    };
    let template = `
        <article class="media">
        <div class="media-content">
            <div class="content">
            <p>
                <strong>${datetime}</strong> <small>@${doc.category}</small>
                <br>
                ${doc.details}
            </p>
            </div>
            <nav class="level is-mobile">
            <div class="level-left">
                <a class="level-item">
                <span class="icon is-small"><i class="fas fa-reply"></i></span>
                </a>
                <a class="level-item">
                <span class="icon is-small"><i class="fas fa-retweet"></i></span>
                </a>
                <a class="level-item">
                <span class="icon is-small"><i class="fas fa-heart"></i></span>
                </a>
            </div>
            </nav>
        </div>
        <div class="media-right">
            <button class="delete"></button>
        </div>
        </article>
    `;
    main.insertAdjacentHTML("beforeend", template);
}

</script>


/* update handler */

function(doc, req) {

if (doc) {
    return [doc, toJSON({'error': 'request already filed'})]
}

/*
start & end, blir den isostring??
*/
var date    = new Date();
var newdoc  = req.form;
var start   = new Date(newdoc.start);
var end     = new Date(newdoc.end);
newdoc.start= start.toISOString();
newdoc.end  = end.toISOString();
newdoc.realm = 'journal';
newdoc.created = date.toISOString();

return [newdoc, toJSON({'success':'ok'})]
}