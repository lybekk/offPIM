# offPIM
**Formerly known as pimpim**
*(rebranded as not to be confused with a "male performance product" solving a different problem)*

>offPIM - A PIM - A Personal information management system
>
>Use as a Progressive Web App (PWA).
>
>Or on the desktop. Supports Windows <img src="assets/img/logo_windows.png" alt="Windows" width="16">, 
>Mac <img src="assets/img/logo_mac.png" alt="Mac OS" width="16">, 
>and Linux <img src="assets/img/logo_linux.png" alt="Linux" width="16">

*Quick access*
[offpim.app](https://offpim.app/)

![offPIM architecture diagram](assets/img/offPIM_diagram.svg)

## Screenshots

### Material design
![Dashboard screenshot](assets/img/dashboard.png)
### Dark mode & mobile ready
![Dark apps screenshot](assets/img/apps_dark.png)

## Description
An easily deployable PIM made for the CouchDB ecosystem.
In an age where everything is about collaboration and sharing... This is a counterweight to that. Not everything needs to be shared. Something is just personal.

### Features
* Works offline, as in offline-first
* Local storage in browser. No server needed
* Sync back and forth to an external database (any DB supporting the CouchDB replication protocol). Full master-master replication
* Export/import to/from JSON
* Apps
    * Task management
    * Notes
    * Contacts
    * Journalling/logging
    * Messaging (Used for general purpose information between devices and such, or whatever you feel like)
    * Search
        * Find items in offPIM by searching
* Progressive web app (PWA)
* Open source. No proprietary technologies. No external requests. No tracking.
* BYOS(Bring Your Own Server). Self-hosted. No backend or complicated installation procedure. Just unzip on a web server.

**Features under development:**

* Personal Finances (Under development)
* Inventory (Under development)
* Maps (Under development)
* Themes

## Use now
[Use a live version of offPIM](https://offpim.app/) (or use it permanently, as it works just as it will anywhere else). You may close the browser and tabs. Your data will still be stored in your browser.

| Host        | Build status    |
| ----------- |:-------------:|
| Netlify     | [![Netlify Status](https://api.netlify.com/api/v1/badges/ac368203-f0ac-4934-9fc2-dc4e68bb3d1d/deploy-status)](https://app.netlify.com/sites/offpim/deploys) |

* **PS:** Your data never leaves your browser, as it uses [PouchDB](https://pouchdb.com/), an in-browser database. The data entered into offPIM will never touch the server it's hosted on, as all code is downloaded to the browser and executed locally, including form submission.
* **PS2:** The downside to this however, is that the data will disappear if the browser cache/data gets deleted during an upgrade or the like. Remember to back up and/or synchronize regularly, as is crucial for all valuable data.
* **PS3:** *(For network nerds)* To verify there's no monkey business going on here, investigate the data flow yourself. Open the developer tab (F12), and check the network tab to see where the traffic goes (or rather, where it doesn't go).

## <a id="downloads"></a>Download

<div class="card">
    <a href="https://github.com/lybekk/offpim/releases/latest/download/offpim_desktop.AppImage" class="btn">
        <img src="assets/img/logo_linux.png" alt="Linux" width="32">
        Linux
    </a>
    <a href="https://github.com/lybekk/offpim/releases/latest/download/offpim_desktop.exe" class="btn">
        <img src="assets/img/logo_windows.png" alt="Windows" width="32">
        Windows
    </a>
    <a href="https://github.com/lybekk/offpim/releases/latest/download/offpim_desktop.dmg" class="btn">
        <img src="assets/img/logo_mac.png" alt="Mac OS" width="32">
        Mac OS
    </a>
    <a href="https://github.com/lybekk/offpim/releases/latest/download/offpim_self_hosted.zip" class="btn">
        <img src="assets/img/logo_self_hosted.png" alt="Self-hosted" width="32">
        Self-hosted
    </a>
</div>

**Note:** *The downloadable versions may be a bit behind the [https://offpim.app](offpim.app) version. A better way to build and distribute is on the drawing board*

## Installation

*Three flavors are currently available*

* **Official app online**
    1. Visit [https://offpim.app](offpim.app)

*OR*

* **Desktop-app (Electron)**
    1. [Download the app for your operating system](#downloads)
    *Windows*
    2. Double-click offpim_desktop.exe to install
    3. Open the app from the start menu.
    *Linux*
    2. Make it executable `$ chmod a+x path-to-file/offpim_desktop.AppImage`
    3. and run! `$ ./path-to-file/offpim_desktop.AppImage`
    *Mac*
    2. Currently no app for Mac OS

    **Note:** "offPIM-Electron" is currently only built and tested on Windows(10) and Linux(Ubuntu), though it is possible to build for another OS yourself.

*OR*

* **Self-hosted static bundle (SPA)**
    1. [Download](#downloads) and unzip contents in any directory (even root) on any HTTP-server.

    **Note:** Suitable for placing on a private VPS served by Apache, or any other http-server (I.E. python http.server or Node.js http.createServer)

See the [documentation](https://lybekk.github.io/offPIM/docs/gettingstarted#installation) for more details and options.

### Requirements

Desktop app
* No requirements. Any computer will do.

Self-hosted
* Any HTTP Server

Synchronization
* A Database supporting the CouchDB replication protocol like:
    * CouchDB
    * PouchDB Server
    * Cloudant
    * Couchbase Sync Gateway

If need for customization, or self-building:
* Node.JS
* NPM

## Usage

For local customization and development, run <code>npm install</code> first.

Tests on mid-end devices with 30 000+ documents (5K in offPIM, while the rest is archived on Remote DB) performs well. 
Index optmizations are done now and then (tips welcome).

### Compiles and hot-reloads for development
```
npm run serve
or
electron:serve
```

### Compiles and minifies for production
```
npm run build
or
npm run electron:build
```

## Customization

See [documentation](https://lybekk.github.io/offPIM/docs/gettingstarted) for customization options.

### Security
offPIM doesn't include any built-in security features (i.e. local encryption), and relies entirely on the surrounding environment. With this in mind, it's a good idea to keep an eye open on where your data travels.
Using HTTPS, enforcing database permissions and other security best practices are recommended. 
Authentication when syncing with an external database is done through PouchDB.

## Contributing
Contributions in any form will be appreciated.

* Ideas, suggestions and feedback.
* Styling tips (Code,Layout,CSS)
* Tips regarding security considerations
* Donations, of course

Commits to github will be instantly reflected on [offpim.app](https://offpim.app).
PWA Service workers may need 24 hours to update to the newest version automatically. A manual cache refresh will force download the newest version.

### Sponsoring
Using, and downloading [Brave Browser](https://brave.com/off167) from [this link](https://brave.com/off167) gets me a cup of coffee as well.

## Roadmap

[Take a look](https://lybekk.github.io/offPIM/docs/roadmap)

## Credits
Creators and maintainers of:
* [PouchDB](https://pouchdb.com/)
* [CouchDB](https://couchdb.apache.org/)
* [Vue](https://vuejs.org/)
* [Vuetify - Vue JS component framework](https://vuetifyjs.com/en/)
* [Electron](https://www.electronjs.org/)
* [Chart.js](https://www.chartjs.org/)
* [Lunr.js](https://lunrjs.com/)
* [Nano - NPM library for CouchDB](https://www.npmjs.com/package/nano)

## License
MIT
