# pimpim
PIMPIM - A PIM - A Personal information management system

Pimpim is not yet ready for regular use. 

![Dashboard screenshot](https://lybekk.tech/pimpim/screenshots/dashboard.png)

## Description
An easily deployable PIM made for the CouchDB ecosystem.
In an age where everything is about collaboration and sharing... This is a counterweight to that. Not eveything needs to be shared. Something is just personal.

It currently has apps for: 
* Task management
* Notes
* Journalling/logging 
* Messaging (Used for general purpose information between devices and such, or whatever you feel like)
* Personal Finances (Under development)
* Inventory (Under development)

Semi-opinionated, but customizable.

No backend needed (just a running database).

(work in progress)Create your own 'drop-in' apps with Vue or plain javascript.

## Installation

*Two flavors are currently available:*

1. **Electron-app (no http-server needed)**
    * "PIMPIM-Electron" is currently only built and tested on Linux (though it is possible to build for another OS yourself)
    1. Download [this AppImage file](https://github.com/lybekk/pimpim/releases/download/v0.1/pimpim-0.1.0.AppImage)
    2. Make it executable `$ chmod a+x path-to-file/pimpim-0.1.0.AppImage`
    3. and run! `$ ./path-to-file/pimpim-0.1.0.AppImage`

**OR**

2. **Static bundle (SPA)**
    * Suitable for placing on a private VPS served by Apache, or any other http-server (I.E. python http.server or Node.js http.createServer())
    1. Download [the latest version](https://github.com/lybekk/pimpim/releases/download/v0.1/pimpim_20200213.zip) and unzip contents in a sub-directory named `pimpim` on any HTTP-server.

> A portable version embedding the brilliant PouchDB is under contruction.
> And an Android app

See the [documentation](https://lybekk.tech/pimpim/gettingstarted.html#installation) for more details and options.

### Requirements
If no customization needed:
* Any HTTP Server
* CouchDB
    * or PouchDB server(Untested).

If need for customization:
* Node.JS
* NPM

## Usage

node_modules have been removed from repository. For local customization and development, run <code>npm install</code> first

Tested with 30 000+ documents and seems to work fine. Optmization tips are welcome.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Customization

See [documentation](https://lybekk.tech/pimpim/gettingstarted.html) for customization options.

### Security
This tool has no built-in security (i.e. authentication), and relies entirely on the surrounding environment.

## Contributing
Contributions, ideas, suggestions and feedback is welcomed and always appreciated.

## Roadmap

[Take a look](https://lybekk.tech/pimpim/roadmap.html)

## Credits
Creators and maintainers of:
* [CouchDB](https://couchdb.apache.org/)
* [PouchDB](https://pouchdb.com/)
* [Vue](https://vuejs.org/)
* [Vuetify - Vue JS component framework](https://vuetifyjs.com/en/)
* [Nano - NPM library for CouchDB](https://www.npmjs.com/package/nano)
* A ton of other JS libraries

## License
MIT
