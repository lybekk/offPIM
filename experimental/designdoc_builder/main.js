console.time('buildTime');
const fs = require('fs');
const base = require('./components/base.js'); // HTML base template

console.log("Building CouchDB document");

// Settings
let DESIGN_DOC = '_design/pimpim';
let DATABASE = 'vault';

let USERNAME, PASSWORD;
try {
    USERNAME = process.env.pimpim_user;
    PASSWORD = process.env.pimpim_pass;
} catch(error) {
    console.log("Username and Password not set as environment variables: ", error);
    process.exit()
}

// Nano -> CouchDB Connection
let URL = `http://${USERNAME}:${PASSWORD}@localhost:5984`;
const nano = require('nano')(URL);
const db = nano.db.use(DATABASE);

// Building
let doc = {
    _id: DESIGN_DOC,
    files: {},
    shows: {},
    views: {},
    language: "javascript"
};

let APPS = []

function setJavascript(fileName, folder) {
    //const jsfile = fs.readFileSync(folder + file, 'utf8');
    const content = fs.readFileSync(folder + fileName, 'utf8');
    doc.files[fileName] = content;
    doc.shows[fileName] = `function(doc, req) { 
        return {
            'headers': {
                'Content-Type' : 'text/javascript'
            },
            'body': this.files["${fileName}"]
        }
    }`;
};

const componentsFolder = './designdoc_builder/components/';
let jsComponents = ["pimpim.js","vue.js"];
jsComponents.forEach(file => {
    setJavascript(file, componentsFolder);
});

// CSS
const css = fs.readFileSync(componentsFolder + "main.css", 'utf8');
doc.files["main.css"] = css;
doc.shows["main.css"] = `function(doc, req) { 
    return {
        'headers': {
            'Content-Type' : 'text/css'
        },
        'body': this.files["main.css"]
    }
}`;

// Views
const viewsFolder = './designdoc_builder/views/';
let viewsList = fs.readdirSync(viewsFolder);
viewsList.forEach( (file) => {
    let viewName = file.replace('.json', '');
    let content = fs.readFileSync(viewsFolder + file, 'utf8');
    doc.views[viewName] = JSON.parse(content);
});

// Apps
const appsFolder = './designdoc_builder/shows/';
let appList = fs.readdirSync(appsFolder);

appList.forEach(moduleName => {
    let appName = moduleName.replace('.js', '');
    APPS.push(appName);
});

appList.forEach( (file, index) => {

    // HTML
    let appName = file.replace('.js', '');
    let html = base(DATABASE, appName, JSON.stringify(APPS));
    //let htmlName = file.replace('.js', '.html');
    let htmlName = file.replace('.js', '');
    doc.files[htmlName] = html;
    doc.shows[htmlName] = `function(doc, req) { 
        return this.files["${htmlName}"];} 
    `;

    // Javascript
    setJavascript(file, appsFolder);

    if (index + 1 == appList.length) {
        uploadDesignDocument(doc)
    }
});

async function uploadDesignDocument(doc) {
    async function asyncCall() {
        try {
            const response = await db.insert(doc, DESIGN_DOC);
            console.log("Doc insert result: ", response)
        } catch(error) {
            if (error.error == "conflict") {
                const headers = await db.head(DESIGN_DOC);
                doc._rev = headers.etag.replace(/["]+/g, '');
                const response = await db.insert(doc, DESIGN_DOC);
                console.log("Design doc exists");
                console.log("Updated design document: ", response)
            };
        };
      }
        asyncCall();
};

// Save JSON to disk
const storeData = (data, path) => {
    try {
    fs.writeFileSync(path, JSON.stringify(data, null, 4))
    } catch (err) {
    console.error(err)
    }
};
storeData(doc, './ready/easy_insert/pimpim_main_design_document.json');


/*

###########
# Updates #
###########

postmessage_raw = open("updates/postmessage.js", "r")
postjournal_raw = open("updates/postjournal.js", "r")
postnote_raw = open("updates/postnote.js", "r")
doc["updates"] = {}
doc["updates"]["postmessage"] = postmessage_raw.read()
doc["updates"]["postjournal"] = postjournal_raw.read()
doc["updates"]["postnote"] = postnote_raw.read()


postmessage_raw = open("updates/postmessage.js", "r")
doc["updates"]["postmessage"] = postmessage_raw.read()

#####################
# Write to database #
#####################

# Create mango indexes
does_design_doc_exist = '_design/pimpim_mango_indexes' in vault
if does_design_doc_exist:
    print("Design doc for Mango query indexes exists. Great!")
else:
    mango_indexes_file = open("components/mango_indexes.json", "r")
    mf = mango_indexes_file.read()
    mj = json.loads(mf)
    doc_mango_indexes = vault.create_document(mj)
    if doc_mango_indexes.exists():
        print('SUCCESS! Inserted document containing the mango indexes.')


client.disconnect()
*/


function closingRemarks() {
    let msg = 'Script concluded';
    console.log("-".repeat(msg.length))
    console.log(msg);
    //console.timeLog('buildTime');
    console.timeEnd('buildTime');
};
//process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('exit', closingRemarks);