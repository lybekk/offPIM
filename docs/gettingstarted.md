# Getting started

Getting PIMPIM up and running can be done in several ways.

[[toc]]

## Installation

### The easy way

1. If not installed already, [Install CouchDB](https://docs.couchdb.org/en/latest/install/index.html)
2. Create a database named `vault`.
3. [Download PIMPIM](https://lybekk.tech/pimpim/downloadpimpim/pimpim_20200207.zip)
4. Copy contents of the zip-file to an HTTP-server of your choosing. Preferably in a sub-directory named /pimpim. If another sub-directory is wanted, see instructions below.

### The still-easy-but-requires-a-few-more-steps way

1. Clone the repository
2. install dependencies
3. Create a database named `vault`
4. (work in progress)
5. run `npm run build`

If you want to use another database name or URL, change settings in `settings.js` in pimpims root directory (if using finished build, else found in public/settings.js).

```Shell
$ yarn build
```

### Customization

Database name and URL can be edited in settings.js (placed in pimpim directory).

::: warning
PIMPIM implements no security measures. Be sure no one else has access to the database.
:::

## Tested setups / Deployment options

pimpim is run successfully on the following deployment setups

### CouchDB+Apache (Ubuntu)
* Couchdb 2.3
* Apache/2.4.29 (Ubuntu)

### CouchDB HTTP server
* Couchdb 2.3
Dist contents placed directly in Fauxton's directory
Serving pimpim with CouchDB's HTTP server.
use pimpim/ or another sub-directory if you wish. Using pimpim for simplicity here.

- Change vue.config.js publicPath to /_utils/pimpim/
- put files in opt/couchdb/share/www/pimpim/
- visit http://localhost:5984/_utils/pimpim/

Added bonus: Turning on CORS is not necessary if put directly in CouchDB's www folder.
