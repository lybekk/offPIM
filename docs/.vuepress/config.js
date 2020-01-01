module.exports = {
    title: 'PIMPIM',
    description: 'PIMPIM Documentation',
    base: '/pimpim/',
    head: [
      ['link', { rel: 'icon', href: '/pimpim-logo.png' }]
    ],
    themeConfig: {
        logo: '/pimpim-logo.png',
        lastUpdated: 'Last Updated',
        smoothScroll: true,
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Getting Started', link: '/gettingstarted/' },
            {
                text: 'Handy links',
                ariaLabel: 'Handy links menu',
                items: [
                  { text: 'CouchDB', link: 'https://couchdb.apache.org/' },
                  { text: 'PouchDB', link: 'https://pouchdb.com/' }
                ]
            }
        ],
        sidebar: [
            '/',
            '/introduction',
            '/gettingstarted',
            '/models/',
            '/apps/',
            '/roadmap'
          ],
        repo: 'lybekk/pimpim',
        repoLabel: 'Contribute!',
        docsDir: 'docs',
        docsBranch: 'master',
        // defaults to false, set to true to enable
        editLinks: true,
        // custom text for edit link. Defaults to "Edit this page"
        editLinkText: 'Help improve this page'
      },
  }
  