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

<style>
.tile.is-child {
    transition: transform .1s;
}
.tile.is-child:hover {
    transform: scale(1.2)
}
.tile.is-child:hover:after {
    content: "🖉";
    float: right;
    position: absolute;
    top: 10%;
    right: 10%;
}
</style>        

<div class="section container">
    <div class="columns">
        <div class="column is-one-fifth">
            <aside class="menu">
                <p class="menu-label">
                    NOTES
                </p>
                <ul class="menu-list">
                    <li onclick="new_entry_form()"><a>New entry</a></li>
                    <li onclick="get_last_entries_by_count(30)"><a>30 latest notes</a></li>
                </ul>
                <p class="menu-label">
                    Tags
                </p>
                <ul class="menu-list">
                    <li>
                        <ul id="tags_list">
                            <li>No tags</li>
                        </ul>
                    </li>
                </ul>
            </aside>
        </div>
        <div class="column">
            <div id="view_container">
                <article class="message is-primary">
                    <div class="message-body">
                      Notes.
                    </div>
                </article>
            </div>
        </div>
    </div>
</div>
        
<template id="templateFormNewEntry">
    <div class="card" style="margin-bottom: 1.8rem;">
        <form class="" 
                name="FormNewEntry" 
                method="POST" 
                onsubmit="result_notification()" 
                target="notification_frame">
        <div class="card-content">
            <p class="subtitle">
                New Note:
            </p>
                <div class="field">
                    <label for="_id" class="label is-small">Generated ID</label>
                    <input class="input is-small" type="text" name="_id" value="">
                </div>
                <div class="field">
                    <label class="label" for="title">Title</label>
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
                        <input class="input" type="text" placeholder="Each, tag, separated, by, commas" name="tags">
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

<script>
    var module_name = "notes";
    var main_container = document.querySelector("#view_container");
    let modal = document.querySelector("#modal");

function new_entry_form(){
    template = document.querySelector("#templateFormNewEntry");
    clone = document.importNode(template.content, true);
    let _id = uuidv4();
    let form = clone.querySelector("form");
    form.action = "/" + database + "/_design/pimpim/_update/postnote";
    clone.querySelector("input[name=_id]").value = _id;
    main_container.insertBefore(clone, main_container.firstChild);
}

function get_last_entries_by_count(count) {
    main_container.innerHTML = "";
    loader_toggle();
    let now = new Date().toISOString().slice(0, 16);
    let mango = {
                    "selector": {
                        "realm": "productivity",
                        "type":"note",
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
        
        if (data.docs.length == 0) {
            main_container.innerHTML = "No notes matching criteria";
            loader_toggle(false);
            return
        }
        make_tile_ancestor();
        data.docs.forEach( (doc, index) => {
            populate(doc);
            if (index + 1 == data.docs.length) {loader_toggle(false)}
        });
    })
    .catch(function(error) {
        console.log("Looks like there was a problem: ", error);
    });
}

function populate(doc) {
    let tile_ancestor = document.querySelector("#tiles");
    /*if length > blabla is-4*/
    /* if no description, use title as description. Less dominant */    
    let size = "is-3";
    let template = `
        <div class="tile is-child box ${size}" 
            data-id="${doc._id}" 
            onclick="view_note(this)" 
            style="margin: 1% !important;">
            <p class="subtitle">
                ${doc.title}
                <span style="visibility: hidden;">
                    &#9999;
                </span>
            </p>
            <p>${doc.description}</p>
        </div>
    `;
    tile_ancestor.insertAdjacentHTML("beforeend", template);
}

function render_tags_list() {
    let tags = document.querySelector("#tags_list");
    fetch(`${window.location.origin}/${database}/_design/pimpim/_view/note-tag-count?group=true`)
    .then((resp) => resp.json())
    .then(function(data) {
        if (data.rows.length > 0) {
            tags.textContent = "";
            data.rows.forEach( (aggregate) => {
                let item = document.createElement("LI");
                item.dataset.tag = aggregate.key;
                item.onclick = function() {
                    get_notes_by_tag(this.dataset.tag);
                };
                item.style.cursor = "pointer";
                let itemContent = document.createElement("A");
                itemContent.textContent = aggregate.key + " (" + aggregate.value + ")";
                item.appendChild(itemContent);
                tags.appendChild(item);
            });
        }
    });
}

function get_notes_by_tag(tag="No tag") {
    main_container.innerHTML = "";
    loader_toggle();
    let mango = {
                    "selector": {
                        "realm": "productivity",
                        "type":"note",
                        "tags": {
                            "$in": [tag]
                        }
                    },
                    "limit": 25,
                    "sort": [
                        { "created": "desc" }
                    ]
                };
    if (tag == "No tag") {
        mango.selector.tags = []
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
        
        if (data.docs.length == 0) {
            main_container.innerHTML = "No notes matching criteria";
            loader_toggle(false);
            return
        }
        make_tile_ancestor();
        data.docs.forEach( (doc, index) => {
            populate(doc);
            if (index + 1 == data.docs.length) {loader_toggle(false)}
        });
    })
    .catch(function(error) {
        console.log("Looks like there was a problem: ", error);
    });
}

function make_tile_ancestor() {
    let tile_ancestor = document.createElement("DIV");
    tile_ancestor.classList.add("tile","is-ancestor");
    tile_ancestor.setAttribute("style","flex-wrap: wrap;");
    tile_ancestor.id = "tiles";
    main_container.appendChild(tile_ancestor);
}

function view_note(obj) {
    let container = modal.querySelector(".modal-content");
    container.textContent = "";
    let box = document.createElement("DIV");
    box.classList.add("box", "content");
    box.innerHTML = `<button class="button is-danger is-light is-pulled-right" 
                    onclick="delete_note(this)">Delete note</button>`;
    let table = document.createElement("TABLE");
    table.classList.add("table","is-hoverable");
    table.id = "note_iterated";
    let tbody = document.createElement("TBODY");
    table.appendChild(tbody);
    box.appendChild(table);

    fetch(`${window.location.origin}/${database}/${obj.dataset.id}`)
    .then((resp) => resp.json())
    .then(function(data) {
        Object.keys(data).forEach( key => {
            
            let row = tbody.insertRow(-1);

            let cell1 = row.insertCell(0);
            cell1.innerHTML = key;
            cell1.classList.add("is-family-code", "has-text-grey-dark");

            let cell2 = row.insertCell(1);
            cell2.dataset.key = key;
            if (data[key] == "" || data[key] == null) {
                cell2.textContent = "Empty";
                cell2.classList.add("is-light");
            } else {
                cell2.textContent = data[key];
            }

            if (key == "title") {
                cell2.classList.add("subtitle");
            }
            if (key == "tags") {
                if (data[key].length > 0) {
                    let tags_html = "";
                    /*
                    let k = data.tags;
                    let tags_arr = k.split(",");
                    */
                    for (x of data.tags) {
                        /*let y = tags_arr[x].trim();*/
                        tags_html += `<span class="tag">${x}</span>`;
                    };
                    let template = `<div class="tags">${tags_html}</div>`;
                    cell2.innerHTML = template;
                }
            }
        });

        let details = document.createElement("DETAILS");
        let summary = document.createElement("SUMMARY");
        summary.textContent = "Raw document";
        details.appendChild(summary);
        let pre = document.createElement("PRE");
        pre.textContent = JSON.stringify(data, null, 2);
        details.appendChild(pre);
        box.appendChild(details);
        /* edit raw document */
    });
    container.appendChild(box);
    /* editable fields */
    modal_toggle();
}

async function delete_note(obj) {
    let doc_id = obj.parentNode.querySelector("[data-key=_id]").textContent;
    let doc_rev = obj.parentNode.querySelector("[data-key=_rev]").textContent;

    let result = await delete_document(doc_id);
    let r = JSON.parse(result);
    if (r.ok) {
        notify("Successfully deleted: " + r.id,"is-success");
        obj.parentNode.classList.add("notification","is-danger");
        obj.textContent = "DELETED";
        let tile = document.querySelector(`[data-id="${doc_id}"]`);
        tile.classList.add("notification","is-danger");
        tile.innerHTML = "DELETED<br>ID: " + doc_id;
    } else {
        notify("Could not delete note: " + result,"is-danger");
    }
}

render_tags_list();

</script>


/* update handler */

function(doc, req) {

    if (doc) {
        return [doc, toJSON({'error': 'request already filed'})]
    }

    var date    = new Date();
    var newdoc  = req.form;
    newdoc.start= date.toISOString();
    newdoc.end  = date.toISOString();
    newdoc.realm = 'productivity';
    newdoc.created = date.toISOString();
    newdoc.type = "note";
    newdoc.status = "plan";
    newdoc.project = "Undefined";
    newdoc.priority = 4;
    newdoc.due = null;
    newdoc.context = null;

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