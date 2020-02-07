Vue.component("productivity-noteview", {
    props: [],
    methods: {
        deleteNote: function() {
            console.log("Work in progress")
        }
    },
    computed: {
        rawDocument: function () {
            let n = this.$root.$data.notes[activeNoteIndex];
            return JSON.stringify(n, null, 2)
        },
        tags: function () {
            let t = this.$root.$data.notes[activeNoteIndex].tags;
            if (t.length > 0) {
                let tags_html = "";
                for (x of t) {
                    tags_html += `<span class="tag">${x}</span>`;
                };
                let result = `<div class="tags">${tags_html}</div>`;
                return result
            }
            return "No tags"
        },
        activeNoteIndex: function() {
            return this.$root.$data.activeNoteIndex
        },
        activeDoc: function () {
            return this.$root.$data.notes[activeNoteIndex]
        }
    },
    template: `
    <div v-bind:class="[ showViewNoteModal ? 'modal is-active' : 'modal' ]">
        <div class="modal-background" onclick="removeForm()"></div>
            <div class="modal-content">
                <div class="box content">
                    <button class="button is-danger is-light is-pulled-right" 
                        @click="deleteNote">
                        Delete note
                    </button>
                    <table id="noteIterated" class="table is-hoverable">
                        <tbody>

                            <tr v-for="(key, value) in activeDoc">
                                <td class="is-family-code has-text-grey-dark">
                                    {{ key }}
                                </td>
                                <td v-if="value == '' || value == null" class="is-light">
                                    Empty
                                </td>
                                <td v-else-if="key === 'title'" class="subtitle">
                                    {{ value }}
                                </td>
                                <td v-else-if="key === 'tags'">
                                    {{ tags }}
                                </td>
                                <td v-else>
                                    {{ value }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <details>
                        <summary>Raw document</summary>
                        <pre>
                            {{ rawDocument }}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    </div>
    `
});


var app = new Vue({
    el: "#app",
    template: `
    <div class="section container">
        <div class="columns">
            <div class="column is-one-fifth">
                <aside class="menu">
                    <p class="menu-label">
                        NOTES
                    </p>
                    <ul class="menu-list">
                        <li onclick="newEntryForm()"><a>New entry</a></li>
                        <li @click="getLastEntriesByCount(30)"><a>30 latest notes</a></li>
                    </ul>
                    <p class="menu-label">
                        Tags
                    </p>
                    <ul class="menu-list">
                        <li>
                            <ul id="tags">
                                <li v-for="(tag, index) in tagsList" 
                                    v-bind:_id="tag._id" 
                                    v-bind:key="tag.key" 
                                    v-bind:index="index" 
                                    >
                                    <a @click="getNotesByTag(tag.key)" class="is-capitalized">
                                        {{ tag.key }}
                                        <span class="tag is-pulled-right">{{ tag.value }}</span>
                                    </a>
                                </li>
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
                    <div id="tiles" class="tile is-ancestor" style="flex-wrap: wrap;">
                        notes here
                        <productivity-note 
                            v-for="(note, index) in notes" 
                            v-bind:key="note._id" 
                            v-bind:note="note" 
                            v-bind:index="index" 
                            v-bind:activeNoteIndex="activeNoteIndex" 
                            v-bind:showViewNoteModal="showViewNoteModal" 
                            @click="viewNote(index)" 
                        ></productivity-note>
                    </div>
                </div>
            </div>
        </div>
        <productivity-noteview>
        </productivity-noteview>
    </div>
    `,
    data: {
        notes:[],
        tagsList: [],
        //activeNote: 0,
        activeNoteIndex: 0,
        showViewNoteModal: false
    },
    methods: {
        getNotesByTag: function (tag="No tag") {
            this.notes = [];
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
                    loader_toggle(false);
                    return
                }
                data.docs.forEach( (doc, index) => {
                    app.notes.push(doc);
                    if (index + 1 == data.docs.length) {loader_toggle(false)}
                });
            })
            .catch(function(error) {
                errorHandler(error);
            });
        },
        renderTagsList: function () {
            fetch(`${window.location.origin}/${database}/_design/pimpim/_view/note-tag-count?group=true`)
            .then((resp) => resp.json())
            .then(function(data) {
               if (data.rows.length > 0) {
                    data.rows.forEach( (aggregate) => {
                        app.tagsList.push(aggregate);
                    });
                }
            });
        },
        getLastEntriesByCount: function (count = 30) {
            this.notes = [];
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
                    loader_toggle(false);
                    return
                }
                data.docs.forEach( (doc, index) => {
                    app.notes.push(doc);
                    if (index + 1 == data.docs.length) {loader_toggle(false)}
                });
            })
            .catch(function(error) {
                console.log("Looks like there was a problem: ", error);
            });
        }
    }
});

Vue.component("productivity-note", {
    props: ["note", "index"],
    //, "activeNote", "showViewNoteModal"
    methods: {
        viewNote: function () {
            this.$root.$data.activeNoteIndex = this.index;
            this.$root.$data.showViewNoteModal = true;
        }
    },
    computed: {
    },
    template: `
    <div class="tile is-child box is-3" 
        @click="viewNote" 
        style="margin: 1% !important;">
        <p class="subtitle">
            {{ note.title }}
            <span style="visibility: hidden;">
                &#9999;
            </span>
        </p>
        <p>{{ note.description }}</p>
    </div>
    `
});

function newEntryForm(){
    let template = `
    <div class="modal">
        <div class="modal-background" onclick="removeForm()"></div>
        <div class="modal-content">

        <div class="card" style="margin-bottom: 1.8rem;">
            <form class="" 
                    name="FormNewEntry" 
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
                </form>
                <footer class="card-footer">
                    <input type="submit" class="card-footer-item button is-inverted is-link is-paddingless" value="Submit">
                    <input class="card-footer-item button is-inverted is-link is-paddingless" 
                        value="Cancel" onclick="remove_form(this)">
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
    let form = clone.querySelector("form");
    form.querySelector("input[name=_id]").value = _id;
    document.body.appendChild(clone);
    let modal = clone.querySelector(".modal");
    modal.classList.add('is-active');
}



/* OLD code */
/* to migration */
/* to migration */
/* to migration */
/* to migration */
/* to migration */


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

app.renderTagsList();


/* update handler 

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
*/