import Vue from 'vue'
import VueRouter from 'vue-router'
import Welcome from '../views/Welcome.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import(/* webpackChunkName: "tasks" */ '../views/Tasks.vue'),
    redirect: 'tasks/list/today',
    children: [
      {
        path: 'list/:list',
        name: 'tasksList',
        component: () => import(/* webpackChunkName: "tasksList" */ '../views/tasks/List.vue')
      },
      {
        path: 'project/:projectid',
        name: 'tasksProject',
        component: () => import(/* webpackChunkName: "tasksList" */ '../views/tasks/Project.vue'),
        props: true
        //component: () => import(/* webpackChunkName: "tasks" */ '../views/Tasks.vue'),
      }
    ]
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import(/* webpackChunkName: "notes" */ '../views/Notes.vue')
  },
  {
    path: '/logbook',
    name: 'logbook',
    component: () => import(/* webpackChunkName: "logbook" */ '../views/Logbook.vue')
    /*
    children: [
      {
        path: 'tag',
        name: 'logbookTag',
        component: () => import('../views/logbook/Items.vue'),
      }
    ]
    */
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import(/* webpackChunkName: "messages" */ '../views/Messages.vue')
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ '../views/Setup.vue')
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import(/* webpackChunkName: "inventory" */ '../views/Inventory.vue')
  },
  {
    path: '/themes',
    name: 'themes',
    component: () => import(/* webpackChunkName: "tools" */ '../views/Themes.vue')
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import(/* webpackChunkName: "tools" */ '../views/Tools.vue')
  },
  {
    path: '/finances',
    redirect: { name: 'financesOverview' },
    name: 'finances',
    component: () => import(/* webpackChunkName: "finances" */ '../views/Finances.vue'),
    children: [
      {
        path: 'overview',
        name: 'financesOverview',
        component: () => import('../views/finances/Overview.vue'),
      },
      {
        path: 'budget',
        name: 'budget',
        component: () => import('../views/finances/Budget.vue'),
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('../views/finances/Transactions.vue'),
      },
      {
        path: 'accounts',
        name: 'accounts',
        component: () => import('../views/finances/Accounts.vue'),
      },
      {
        path: 'assets',
        name: 'assets',
        component: () => import('../views/finances/Assets.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
