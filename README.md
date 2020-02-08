# pimpim
PIMPIM - A PIM - A Personal information management system

## Description
An easily deployable PIM made for the CouchDB ecosystem.
In an age where everything is about collaboration and sharing. This is a counterweight to that. Not eveything needs to be shared. Something is just personal.

It currently has apps for task management, notes, journalling/logging and a messaging app(Used for general purpose information between devices and such, or whatever you feel like)

Semi-opinionated, but customizable.

(work in progress)Create your own 'drop-in' apps with Vue or plain javascript.

## Installation

Download [the latest version](https://github.com/lybekk/pimpim/raw/master/docs/.vuepress/public/downloadpimpim/pimpim_20200207.zip) and unzip contents in a sub-directory named pimpim on any HTTP-server.

See the [documentation](https://lybekk.tech/pimpim/gettingstarted.html#installation) for more details and options.

### Requirements
If no customization needed:
* Any HTTP Server
* CouchDB or PouchDB server(Untested).

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
Creators of:
* CouchDB
* Vue
* Vuetify
* Nano - NPM library for CouchDB

## License
MIT
