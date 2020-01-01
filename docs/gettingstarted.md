# Getting started

Getting PIMPIM up and running can be done in several ways.

[[toc]]

## Installation

### The easy way

1. If not installed already, [Install CouchDB](https://docs.couchdb.org/en/latest/install/index.html)
2. Create a database named `vault`
3. Insert [these two documents](https://github.com/lybekk/pimpim/tree/master/dist/easy_upload) in the database (I.E. `curl` or copy+paste in Fauxton)
4. Visit `http://localhost:5984/vault/_design/pimpim/_show/dashboard.html`

### The still-easy-but-requires-a-few-more-steps way

1. Clone the repository
2. install dependencies
3. Create a database named `vault`
4. 
5. run `npm run build`

If you want to use another database name, clone the repository and change settings in `src/main.js` and run build on the command line.

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


::: warning
PIMPIM implements no security measures. Be sure no one else ha access to the database.
:::
