import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from '../views/Welcome.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'welcome',
        component: Welcome
    },
    {
        path: '/new',
        name: 'formsNew',
        redirect: { name: 'formsNewTask' },
        component: () =>
            import ( /* webpackChunkName: "forms" */ '../views/Forms.vue'),
        children: [{
                path: 'task',
                name: 'formsNewTask',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Task.vue')
            },
            {
                path: 'note',
                name: 'formsNewNote',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Note.vue')
            },
            {
                path: 'log',
                name: 'formsNewLog',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Log.vue')
            },
            {
                path: 'message',
                name: 'formsNewMessage',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Message.vue')
            },
            {
                path: 'contact',
                name: 'formsNewContact',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Contact.vue')
            },
            {
                path: 'finance',
                name: 'formsNewFinance',
                component: () =>
                    import ( /* webpackChunkName: "forms" */ '../views/forms/Finance.vue')
            },
        ]
    },
    {
        path: '/contacts/:list?',
        name: 'contacts',
        component: () =>
            import ( /* webpackChunkName: "contacts" */ '../views/Contacts.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () =>
            import ( /* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () =>
            import ( /* webpackChunkName: "tasks" */ '../views/Tasks.vue'),
        redirect: 'tasks/overview',
        children: [{
                path: 'overview',
                name: 'tasksOverview',
                component: () =>
                    import ( /* webpackChunkName: "tasks" */ '../views/tasks/Overview.vue')
            },
            {
                path: 'list/:list',
                name: 'tasksList',
                component: () =>
                    import ( /* webpackChunkName: "tasks" */ '../views/tasks/List.vue')
            },
            {
                path: 'project/:projectid',
                name: 'tasksProject',
                component: () =>
                    import ( /* webpackChunkName: "tasks" */ '../views/tasks/Project.vue'),
                props: true
            },
            {
                path: 'completed_projectless',
                name: 'completedProjectless',
                component: () =>
                    import ( /* webpackChunkName: "tasks" */ '../views/tasks/ArchivalCompletedProjectless.vue')
            },
            {
                path: 'ranking',
                name: 'taskRanking',
                component: () =>
                    import ( /* webpackChunkName: "tasks" */ '../views/tasks/Ranking.vue')
            },
        ]
    },
    {
        path: '/notes',
        name: 'notes',
        component: () =>
            import ( /* webpackChunkName: "notes" */ '../views/Notes.vue'),
        redirect: 'notes/tag/No tag',
        children: [{
            path: 'tag/:tag',
            name: 'notesTag',
            component: () =>
                import ( /* webpackChunkName: "notes" */ '../views/notes/Tag.vue'),
            props: true
        }, ]
    },
    {
        path: '/logbook/:list?',
        name: 'logbook',
        component: () =>
            import ( /* webpackChunkName: "logbook" */ '../views/Logbook.vue'),
        props: true
    },
    {
        path: '/maps',
        name: 'maps',
        component: () => import ( /* webpackChunkName: "maps" */ '../views/Maps.vue'),
    },
    {
        path: '/messages/:tag?',
        name: 'messages',
        component: () =>
            import ( /* webpackChunkName: "messages" */ '../views/Messages.vue')
    },
    {
        path: '/setup',
        name: 'setup',
        component: () =>
            import ( /* webpackChunkName: "setup" */ '../views/Setup.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () =>
            import ( /* webpackChunkName: "settings" */ '../views/Settings.vue')
    },
    {
        path: '/inventory',
        name: 'inventory',
        component: () =>
            import ( /* webpackChunkName: "inventory" */ '../views/Inventory.vue')
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ( /* webpackChunkName: "search" */ '../views/Search.vue')
    },
    {
        path: '/themes',
        name: 'themes',
        component: () =>
            import ( /* webpackChunkName: "themes" */ '../views/Themes.vue')
    },
    {
        path: '/tools',
        name: 'tools',
        component: () =>
            import ( /* webpackChunkName: "tools" */ '../views/Tools.vue')
    },
    {
        path: '/finances',
        redirect: { name: 'financesOverview' },
        name: 'finances',
        component: () =>
            import ( /* webpackChunkName: "finances" */ '../views/Finances.vue'),
        children: [{
                path: 'overview',
                name: 'financesOverview',
                component: () =>
                    import ( /* webpackChunkName: "finances" */ '../views/finances/Overview.vue'),
            },
            {
                path: 'budget',
                name: 'budget',
                component: () =>
                    import ( /* webpackChunkName: "finances" */ '../views/finances/Budget.vue'),
            },
            {
                path: 'transactions',
                name: 'transactions',
                component: () =>
                    import ( /* webpackChunkName: "finances" */ '../views/finances/Transactions.vue'),
            },
            {
                path: 'accounts',
                name: 'accounts',
                component: () =>
                    import ( /* webpackChunkName: "finances" */ '../views/finances/Accounts.vue'),
            },
            {
                path: 'assets',
                name: 'assets',
                component: () =>
                    import ( /* webpackChunkName: "finances" */ '../views/finances/Assets.vue'),
            }
        ]
    },
    {
        path: '/bookmarks',
        name: 'bookmarks',
        component: () =>
            import ( /* webpackChunkName: "bookmarks" */ '../views/Bookmarks.vue')
    },
]

const router = new VueRouter({
    routes
})

export default router
