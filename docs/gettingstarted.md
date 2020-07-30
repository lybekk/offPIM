---
title: Getting started
---

Getting offPIM up and running can be done in several ways.

* TOC
{:toc}

## Installation

### The very easy way - Official app online

1. Visit [https://offpim.app](offpim.app)

### The easy way - Desktop app

1. Download the app for your operating system. [Linux](https://lybekk.tech/downloads/offpim_desktop.AppImage). [Windows](https://lybekk.tech/downloads/offpim_desktop.exe)
*Windows*
2. Double-click offpim_desktop.exe to install
3. Open the app from the start menu.
*Linux*
2. Make it executable `$ chmod a+x path-to-file/offpim_desktop.AppImage`
3. and run! `$ ./path-to-file/offpim_desktop.AppImage`
*Mac*
2. Currently no app for Mac OS

**Note:** "offPIM-Electron" is currently only built and tested on Windows(10) and Linux(Ubuntu), though it is possible to build for another OS yourself.


1. Download [this AppImage file](https://lybekk.tech/downloads/offpim_desktop.AppImage)
2. Make it executable `$ chmod a+x path-to-file/offpim_desktop.AppImage`
3. and run! `$ ./path-to-file/offpim_desktop.AppImage`


### The still-easy-but-requires-a-few-more-steps way (for techies)

1. [Download self-hosted offPIM](https://lybekk.tech/downloads/offpim_self_hosted.zip)
2. Copy contents of the zip-file into a directory (or root) to an HTTP-server of your choosing. *offPIM uses relative paths, so any directory should work*

### The hard way - Build it yourself
1. Clone the repository
2. install dependencies
4. run `npm run build` for self-hosted, or `npm run electron:build` for desktop app

Example
```Shell
$ cd /home/user/folder
$ git clone https://github.com/lybekk/offPIM.git
$ npm install
$ npm run electron:build
```

## Self-hosted - tested setups / Deployment options

offPIM is run successfully on the following deployment setups

### CouchDB+Apache (Ubuntu)
* Apache/2.4.29 (Ubuntu)
* Couchdb 2.3 (or 3.0)

### CouchDB HTTP server
* Couchdb 2.3
Dist contents placed directly in Fauxton's directory
Serving offPIM with CouchDB's HTTP server.
use offpim/ or another sub-directory if you wish. Using offpim for simplicity here.

- Change vue.config.js publicPath to /_utils/offpim/
- put files in opt/couchdb/share/www/offpim/
- visit http://localhost:5984/_utils/offpim/

Added bonus: Turning on CORS is not necessary if put directly in CouchDB's www folder.

### Python HTTPServer
```python
import http.server
import socketserver
import webbrowser

PORT = 8000
# Binds to localhost only. Use "" for exposing this to network interfaces
HOST = "localhost" 

# Launches the server in current working directory in the default web browser
url = 'http://' + HOST + ":" + str(PORT)
webbrowser.open_new_tab(url)

# Magic
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```


## Synchronization
*The following setups have been tested successfully*

* CouchDB 2.x
* CouchDB 3.x
* Cloudant
* PouchDB Server
    * Tested OK on both Desktop and via [Termux on Android](https://lybekk.tech/guide/pouchdb-server-termux).

>Installation instructions for [CouchDB](https://docs.couchdb.org/en/latest/install/index.html)

## Security
::: warning
offPIM implements no security measures. Be sure no one else has access to your browser or database.
:::
