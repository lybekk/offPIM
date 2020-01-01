# pimpim
PIMPIM - A PIM - A Personal information management system

## Table of Contents

[[toc]]

## Description
A PIM served directly from CouchDB.
In an age where everything is about collaboration and sharing. This is a counterweight to that. Not eveything needs to be shared. Something is just personal.

It currently has apps for task management, notes, journalling/logging and a messaging app(Used for general purpose information between devices and such, or whatever you feel like)

Semi-opinionated, but customizable.
Create your own 'drop-in' apps with Vue or plain javascript.

## Installation

For the standard package, just copy+paste(Fauxton) or `curl` the two design documents from `dist/easy_inser/` into a database called `vault`.
Visit `http://localhost:45984/vault/_design/pimpim/_show/dashboard.html`.

See the [documentation](https://lybekk.tech/pimpim/gettingstarted.html#installation) for more details and options.

### Requirements
If no customization needed:
* CouchDB or PouchDB server(Untested).

If need for customizattion:
* Node.JS
* NPM

## Usage
Tested with 30 000+ documents and seems to work fine. Optmization tips are welcome.

## Customization

See [documentation](https://lybekk.tech/pimpim/gettingstarted.html#the-still-easy-but-requires-a-few-more-steps-way) for customization options.

### Security
This tool has no built-in security (i.e. authentication). Anyone with read-access to the database can access it.

## Contributing
Contributions, ideas, suggestions and feedback is welcomed and always appreciated.

## Roadmap

[Take a look](https://lybekk.tech/pimpim/roadmap.html)

## Credits
Creators of:
* CouchDB
* Vue
* Bulma CSS
* Nano - NPM library for CouchDB

## License
MIT