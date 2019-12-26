function result_notification() {
    document.getElementById("result_notification").style.display = "block";
}

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
}

function loader_toggle(status=true) {
    if (status) {
        let p = document.createElement("progress");
        p.id = "loadingBar";
        p.classList.add("progress", "is-medium", "is-primary");
        p.setAttribute("style", "position: fixed; bottom: 0; width: 50vw; left: 25%;");
        p.setAttribute("max", "100");
        p.textContent = "Loading";
        document.body.appendChild(p);
    } else {
        document.querySelector("#loadingBar").remove();
    }
}

async function delete_document(doc_id) {
    const response = await fetch(`${window.location.origin}/${database}/${doc_id}`);
    const doc = await response.json();
    let result;

    try {
        let url = `${window.location.origin}/${database}/${doc._id}?rev=${doc._rev}`;
        const data = await delete_request(url);
        result = JSON.stringify(data);
    } catch (error) {
        result = error;
    }

    async function delete_request(url = "") {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json"
            }
        });
        return await response.json();
    }

    return await result;
}

function notify(text,color="is-info",time=0) {
    var html_content = `<div id="notification-container" 
                            class="notification ${color}">
                        <button class="delete notification-close"></button>
                        <div class="notification-content">
                            ${text}
                        </div>
                    </div>`;
    document.getElementById("notification-area").insertAdjacentHTML("afterbegin", html_content);
    var popup = document.getElementById("notification-container");
    var span = document.getElementsByClassName("notification-close")[0];
    popup.style.display = "block";
    
    span.onclick = function() {
        popup.style.display = "none";
    }
    /*
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }
    */
    if (time != 0) {
        setTimeout(function(){
            popup.style.display = "none";
        }, time);
    }
}

function get_alias() {
    let alias_settings = sessionStorage.getItem("alias");
    let aliases = JSON.parse(alias_settings);
    let pn = document.querySelector("#page_name");
    if (aliases[moduleName]) {
        pn.textContent = aliases[moduleName];
    }
    render_navbar(aliases);
}

function store_settings(data) {
    for (const [key, value] of Object.entries(data)) {
        if (typeof value == "string") {
            sessionStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }
    get_alias();
}

function get_settings() {
    if (!sessionStorage.theme) {
        let db_url = window.location.origin + "/" + database;
        fetch(db_url + "/pimpim_settings")
        .then((resp) => resp.json())
        .then(function(data) {
            if (data.error) {
                let doc_settings = { "_id":"pimpim_settings","theme":"main", "alias":{} };
                fetch(db_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(doc_settings)
                })
                .then((resp) => resp.json())
                .then(function(data) {
                    let msg = "Settings document created: " + JSON.stringify(data);
                    notify(msg, "is-info", 8000);
                    store_settings(doc_settings);
                })
                .catch(function(error) {
                    console.log("Could not create document for settings: ", error);
                });
            }
            store_settings(data);
        })
        .catch(function(error) {
            console.log("Looks like there was a problem: ", error);
        });
    } else {
        get_alias();
    }
}

function render_navbar(aliases) {
    let module_links = document.querySelector("#module_links");
    modules.forEach(element => {
        let a = document.createElement("A");
        a.classList.add("navbar-item", "is-capitalized");
        a.href = element + ".html";
        /*a.href = "../" + element + "/";*/
        if (aliases.hasOwnProperty(element)) {
            element = aliases[element];
        };
        a.textContent = element;
        module_links.appendChild(a);
    });
}

function modal_toggle() {
    modal.classList.toggle("is-active");
}

function toggleNavBarMenu(btn) {
    let menu = document.querySelector("#nav-menu");
    menu.classList.toggle("is-active");
    btn.classList.toggle("is-active");
}

function errorHandler(error) {
    console.log(error);
    notify(error, "is-danger");
    loader_toggle(false)
}

async function update_document(doc) {
    /*
    if rev-error
    const response = await fetch(`${window.location.origin}/${database}/${id}`);
    const doc = await response.json();
     */
    try {
        const response = await fetch(url_database + "/" + doc._id, {
            method: "PUT",
            body: JSON.stringify(doc), 
            headers: {
            "Content-Type": "application/json"
            }
        });
        const result = await response.json();
        /*notify("Success:" + JSON.stringify(result),"is-success",4000);*/
        return await result;
    } catch (error) {
        errorHandler(error);
    }
}