<template lang="pug">
  v-app(id="inspire")
    v-navigation-drawer(
      v-model="drawer"
      app
    )
      navbar-apps
      v-switch(
        v-model="isDarkMode" 
        class="ma-2" 
        label="Dark mode" 
        dense 
        color=""
      )
      v-btn(
        href="https://lybekk.github.io/offpim/"
        target="_blank"
        text
      )
        span(class="mr-2") Docs
        v-icon mdi-open-in-new
    v-app-bar(app)
      v-app-bar-nav-icon(
        @click.stop="drawer = !drawer"
      )
      div(class="d-flex align-center")
        span(
          class="title"
          @click.stop="drawer = !drawer"
        ) offPIM
      v-tabs(
        fixed-tabs
        background-color="transparent"
        grow
        color="transparent"
      )
        v-tab(@click.stop="drawer = !drawer")
      NavbarActions
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

import offPIMDesignDoc from '@/components/designdocs/offpim_design_doc.json'
import MangoDesignDoc from '@/components/designdocs/mango_indexes.json'

export default {
  name: 'App',
  components: {
    NavbarApps,
    NavbarActions,
    AlertBox,
    DatabaseConnectionDialog
  },
  data: () => ({
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
    this.$vuetify.theme.dark = localStorage.getItem('darkMode');
  },
  methods: {
    startupcheck: async function () {
      let v = this.$store;
      v.dispatch('checkThemeSettings'); //store/themes.js
      v.dispatch('localDBInfo')

      try {
        const pDoc = await v.dispatch( 'startupIndexCheck', { doc: 'offpim', version: offPIMDesignDoc.version } )
        const mDoc = await v.dispatch( 'startupIndexCheck', { doc: 'offpim_mango_indexes', version: MangoDesignDoc.version } )
        if (!pDoc || !mDoc) {
          this.$router.push('/setup')
        }
        v.dispatch('setTotals')
        v.dispatch('setMessagesUnreadCount');
      } catch(err) {
        console.log('Design docs not up to date. Redirecting to setup: ',err)
        this.$router.push('/setup')
      }

    },

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