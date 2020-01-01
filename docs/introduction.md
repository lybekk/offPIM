# Introduction

PIMPIM - A PIM - A Personal information management system

In total disregard of the recommendation from CouchDB, where it is advised against using CouchDB to serve apps directly to the user. 
This project does exactly the opposite, by serving a PIM directly from the database, that in addition gets synchronized to all your other servers.

With this in mind, it's probably a good idea not to expose the database to the public. PIMPIM doesn't include any security features.

## Creating your own apps

[Bulma](https://bulma.io/) CSS framework is included.
Any apps you make may use CSS classes from Bulma for added simplicity.
It will be fetched and loaded from the PIMPIM design document by default.

## Design choices

### CSS

The choice of CSS frameworks landed on Bulma. Easy to use and customize.
[Node-sass](https://github.com/sass/node-sass) is used to customize the theme. Instructions can be found on [Bulma's website](https://bulma.io/documentation/customize/with-node-sass/).

A dark theme is on the roadmap.

### Vue Single File Components

A tough choice between Vue's sexy [Single File Components](https://vuejs.org/v2/guide/single-file-components.html) (SFC) and standalone "Vue apps" was made, which landed on standalone javascript files.

There is a few drawbacks to doing it this way, like a lack of HTML syntax highlighting.

If you have an idea on how to design PIMPIM with SFC so apps can be dropped in a folder and built ad-hoc into the design document in an elegant way, let your voice be heard.
