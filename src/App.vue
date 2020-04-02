<template lang="pug">
  v-app(id="inspire")
    v-navigation-drawer(
      v-model="drawer"
      app
    )
      NavbarApps
      v-switch(
        v-model="isDarkMode" 
        class="ma-2" 
        label="Dark mode" 
        dense 
        color="black"
      )
    v-app-bar(app)
      v-app-bar-nav-icon(
        @click.stop="drawer = !drawer"
      )
      div(class="d-flex align-center")
        v-img(
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        )
        span(class="title") pimpim
      v-tabs(
        fixed-tabs
        background-color="transparent"
        grow
        color="transparent"
      )
        v-tab(@click.stop="drawer = !drawer")
      NavbarActions
      v-btn(
        href="https://lybekk.github.io/pimpim/"
        target="_blank"
        text
      )
        span(class="mr-2") Docs
        v-icon mdi-open-in-new
      v-progress-linear(
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="primary"
      )
    AlertBox
    v-scroll-x-transition(mode="out-in")
      router-view
    v-snackbar(
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color"
      bottom
    ) {{ snackbar.text }}
    DatabaseConnectionDialog

</template>

<script>
import NavbarApps from '@/components/app/NavbarApps.vue'
import NavbarActions from '@/components/app/NavbarActions.vue'
import AlertBox from '@/components/app/AlertBox.vue'
import DatabaseConnectionDialog from '@/components/app/DatabaseConnectionDialog.vue'

import PimpimDesignDoc from '@/components/designdocs/pimpim_design_doc.json'
import MangoDesignDoc from '@/components/designdocs/mango_indexes.json'

/* If pouch-vue is to be used
import Vue from 'vue'
import PouchVue from 'pouch-vue'

Vue.use(PouchVue, {
  //pouch: PouchDB, // optional if `PouchDB` is available on the global object
  //defaultDB: 'vaulttest' // this is used as a default connect/disconnect database
  defaultDB: 'vaulttest' // remoteDbName // this is used as a default connect/disconnect database
  //defaultDB: 'remoteDbName' // remoteDbName // this is used as a default connect/disconnect database
  //debug: '*' // optional - See `https://pouchdb.com/api.html#debug_mode` for valid settings (will be a separate Plugin in PouchDB 7.0)

  //defaultDB: 'remoteDbName',  // this is used as a default connect/disconnect database
  //optionDB: {}, // this is used to include a custom fetch() method (see TypeScript example)

})
*/

export default {
  name: 'App',
  components: {
    NavbarApps,
    NavbarActions,
    AlertBox,
    DatabaseConnectionDialog
  },
  data: () => ({
    //drawer: false
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.getters.isLeftDrawerOpen
      },
      set(state) {
        this.$store.commit('setLeftDrawer', state)
      }
    },    
    snackbar() {
      return this.$store.state.snackbar
    },
    loading() {
      return this.$store.getters.loaderState
    },
    isDarkMode: {
      get() {
        return this.$vuetify.theme.dark
      },
      set(state) {
        if (state) {
          localStorage.setItem('darkMode', true);
        } else {
          localStorage.removeItem('darkMode');
        }
        this.$vuetify.theme.dark = state
      }
    }
  },
  created () {},
  mounted () {
    this.startupcheck()
    //this.createMangoIndexes();
    this.$vuetify.theme.dark = localStorage.getItem('darkMode');
  },
  methods: {
    startupcheck: async function () {
      let v = this.$store;
      v.dispatch('checkThemeSettings'); //store/themes.js
      v.dispatch('localDBInfo')

      console.log('Before!!!')
      try {
        //const pDoc = await v.dispatch( 'startupIndexCheck', { doc: 'pimpim', version: window.pimpim.pimpimDesignDoc.version } )
        //const mDoc = await v.dispatch( 'startupIndexCheck', { doc: 'pimpim_mango_indexes', version: window.pimpim.mangoIndexes.version } )
        const pDoc = await v.dispatch( 'startupIndexCheck', { doc: 'pimpim', version: PimpimDesignDoc.version } )
        const mDoc = await v.dispatch( 'startupIndexCheck', { doc: 'pimpim_mango_indexes', version: MangoDesignDoc.version } )
        if (!pDoc || !mDoc) {
          this.$router.push('/setup')
        }
        v.dispatch('setTotals')
        v.dispatch('setMessagesUnreadCount');
      } catch(err) {
        console.log('Design docs not up to date. Redirecting to setup: ',err)
        this.$router.push('/setup')
      }

      //v.dispatch('setTotals')
      //v.dispatch('setMessagesUnreadCount');

    },
    /*
    createMangoIndexes: async function () {
      // if less indexes than x, initiate
      // or
      // if localstorage array length != indexes.length
        // account for if othen indexes are in database
      const indexes = [
        [ 'noteslatest2',[ 'created', 'realm' ] ],
        [ 'genericrealm',[ 'realm' ] ] //messagesunread uses this
      ]

      for await (let idx of indexes) {
        try {
          let result = await window.db.createIndex({
            index: {
              fields: idx[1],
              name: idx[0],
              ddoc: idx[0],
              type: 'json',
            }
          });
          console.log('Index creation result: ', result)
        } catch (err) {
          console.log(err);
        }
      }
      // create localstorage array of all indexes when done indexing

    }
    */
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>