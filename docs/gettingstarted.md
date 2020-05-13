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

* "offPIM-Electron" is currently only built and tested on Linux (though it is possible to build for another OS yourself)
1. Download [this AppImage file](https://lybekk.tech/downloads/offpim_desktop.AppImage)
2. Make it executable `$ chmod a+x path-to-file/offpim_desktop.AppImage`
3. and run! `$ ./path-to-file/offpim_desktop.AppImage`

### The still-easy-but-requires-a-few-more-steps way (for techies)

1. [Download self-hosted offPIM](https://lybekk.tech/downloads/offpim_self_hosted.zip)
2. Copy contents of the zip-file into a directory (or root) to an HTTP-server of your choosing.

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

### Customization

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

## Misc
For synchronization, CouchDB can be used.
Installation instructions [Install CouchDB](https://docs.couchdb.org/en/latest/install/index.html)

::: warning
offPIM implements no security measures. Be sure no one else has access to the database.
:::
