---
title: Getting started
---

Getting PIMPIM up and running can be done in several ways.

* TOC
{:toc}

## Installation

### The easy way - Desktop app

* "PIMPIM-Electron" is currently only built and tested on Linux (though it is possible to build for another OS yourself)
1. Download [this AppImage file](https://lybekk.tech/downloads/pimpim_desktop.AppImage)
2. Make it executable `$ chmod a+x path-to-file/pimpim_desktop.AppImage`
3. and run! `$ ./path-to-file/pimpim_desktop.AppImage`

### The still-easy-but-requires-a-few-more-steps way (for techies)

1. [Download self-hosted PIMPIM](https://lybekk.tech/downloads/pimpim_self_hosted.zip)
2. Copy contents of the zip-file to an HTTP-server of your choosing. Preferably in a sub-directory named /pimpim. If another sub-directory is wanted, see instructions below.

### The hard way - Build it yourself
1. Clone the repository
2. install dependencies
4. run `npm run build` for self-hosted, or `npm run electron:build` for desktop app

Example
```Shell
$ cd /home/user/folder
$ git clone https://github.com/lybekk/pimpim.git
$ npm install
$ npm run electron:build
```

### Customization

## Self-hosted - tested setups / Deployment options

pimpim is run successfully on the following deployment setups

### CouchDB+Apache (Ubuntu)
* Apache/2.4.29 (Ubuntu)
* Couchdb 2.3 (or 3.0)

### CouchDB HTTP server
* Couchdb 2.3
Dist contents placed directly in Fauxton's directory
Serving pimpim with CouchDB's HTTP server.
use pimpim/ or another sub-directory if you wish. Using pimpim for simplicity here.

- Change vue.config.js publicPath to /_utils/pimpim/
- put files in opt/couchdb/share/www/pimpim/
- visit http://localhost:5984/_utils/pimpim/

Added bonus: Turning on CORS is not necessary if put directly in CouchDB's www folder.

## Misc
For synchronization, CouchDB can be used.
Installation instructions [Install CouchDB](https://docs.couchdb.org/en/latest/install/index.html)

::: warning
PIMPIM implements no security measures. Be sure no one else has access to the database.
:::
