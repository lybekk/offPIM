# pimpim
Pretty Insecure Modular Personal Information Management
A CouchDB PIM

## Description
Quick and dirty personal information management system (PIM).
In an age where everything is about collaboration and sharing. This is a counterweight to that. Not eveything needs to be shared.
Semi-opinionated with a few customization options.
Some drawbacks to doing it this way:
	poor/no syntax highlighting for html
For tasks, notes, projects, journalling/logging. It includes a messaging module as well. Used for general purpose information between devices and such.

## Table of Contents
WIP. Use githubs TOC markdown

## Installation

Can be done complicated, or easy. Installation/deployment options coming.

See documentation (URL) for more information

### Requirements
If no customization needed:
* CouchDB or PouchDB server.

If need for customizattion:
* Node.JS
* NPM

### Standard

1. Insert pimpim.json into a database called 'vault'. Can be done with curl or just copy-pasting via Fauxton.
2. Visit localhost:5984/vault/_design/pimpim/index/ (the trailing backslash is kind of important)

### Customized
Use 'pusher.py'.
See [Customization](#cust) for details.

## Usage
refine:
    You also get this sexy/handy view filtered open tasks and such.

Tested with 30 000 documents and seems to work fine. Optmization tips are welcome.

<h2 id="cust">Customization</h2>
If you want to use another database, change settings in pusher.py and run it on the command line.

```Shell
$ python3 pusher.py
```

```Shell
$ npm run build
```

The user needs write permission.
either put these in .profile, on Linux
export pimpim_user="yourUsername"
export pimpim_pass="yourPassword"

*Or*

Put credentials directly in main.js:

```Javascript
USERNAME="youruser"
PASSWORD="cleverSecretP455w0rd"
```

Old:
pusher.py struggles somewhat with single quotes <code>'</code> and <code>//</code> when pushing "_shows"/html-files. CouchDB treats these as escapes and such.

### Modules

Drop a js-file in the "shows" folder, run <code>npm run build</code> and the world's your oyster.
Limitations: Can't use single quote ' in the html-files. CouchDB gets easily confused and starts misbehaving.

### Security
This tool has no in-built security (i.e. authentication). Anyone with read-access to the database can access it.

## Contributing
Contributions, ideas, suggestions and feedback is welcomed and always appreciated.

## Roadmap
* User created modules (drop in module-folder, run pusher, and et voila).
* Android app (using couchbase lite)
* Standalone Node.js application (PouchDB & Electron?)
* CGI/WSGI variant

## Credits
Creators of:
* CouchDB
* Nano - NPM library for CouchDB
* Bulma CSS
* Cloudant library from IBM

## License
MIT