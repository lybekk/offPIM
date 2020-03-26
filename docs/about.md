# About

## Electron app
No setup. Download and run.

## Self-hosted
A little-to-no configuration web/localhost application designed to be easily deployed onto any HTTP-server, even CouchDB's own HTTP-server.

## Design choices

### Frontend only
No backend is provided or required. For synchronization, a CouchDB/PouchDB/Cloudant database is needed.

### UI (CSS)

The choice of UI/CSS frameworks landed on Vuetify. Feature-rich and integrates exceptionally well with Vue.

### Vue Single File Components

Vue's sexy [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) (SFC) provides an excellent separation of concerns and does a good job in helping reduce inevitable spaghetti code.

The drawback to SFC, some would say, is the reliance on Webpack.
The advantages one gets by utilizing Vue's entire ecosystem (Vue CLI, SFC, Router, Vuex) makes it worth it, however.