# Introduction

PIMPIM - A PIM - A Personal information management system

A little-to-no configuration web/localhost application designed to be easily deployed onto any HTTP-server, even CouchDB's own HTTP-server.

PIMPIM doesn't include any security features. With this in mind, it's a good idea to keep an eye open on where your data travels.
Using HTTPS, enforcing database permissions and other security best practices are recommended. 

## Creating your own apps

Work in progress.

The goal is to provide a way of "dropping" apps in a sub-directory, et-voila-style.

If you have an idea on how to design PIMPIM so apps can be dropped in a folder and used ad-hoc in an elegant way, let your voice be heard.

## Design choices

### Frontend only

No backend is provided or required (except, of course, a CouchDB/PouchDB/Cloudant database).

In the future, an optional, auxilliary Python (CGI/WSGI) backend is planned to enable server-side heavy lifting like report generation, insights (machine learning), inter-system communication and such.

### UI (CSS)

The choice of UI/CSS frameworks landed on Vuetify. Feature-rich and integrates exceptionally well with Vue.

### Vue Single File Components

Vue's sexy [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) (SFC) provides an excellent separation of concerns and does a good job in helping reduce spaghetti code.

The drawback to SFC, some would say, is the reliance on Webpack.
The advantages one gets by utilizing Vue's entire ecosystem (Vue CLI, SFC, Router, Vuex) makes it worth it, however.