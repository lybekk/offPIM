<template>
  <v-app id="inspire">

    <v-app-bar
      app
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <span class="title">pimpim</span>
      </div>

      <v-spacer></v-spacer>
      <NavbarApps/>
      <v-btn
        href="https://lybekk.tech/pimpim/"
        target="_blank"
        text
      >
        <span class="mr-2">Docs</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>

      <v-switch v-model="$vuetify.theme.dark" class="ma-2" label="Dark mode" dense color="black"></v-switch>

      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="primary"
      ></v-progress-linear>

    </v-app-bar>

    <AlertBox/>

    <v-scroll-x-transition mode="out-in">
      <router-view></router-view>
    </v-scroll-x-transition>

    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color"
      bottom
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
import NavbarApps from '@/components/NavbarApps.vue'
import AlertBox from '@/components/AlertBox.vue'
//import { mapMutations } from "vuex"

export default {
  name: 'App',
  components: {
    NavbarApps,
    AlertBox
  },
  data: () => ({
  }),
  computed: {
    snackbar() {
      return this.$store.state.snackbar
    },
    loading() {
      return this.$store.getters.loaderState
    }
    //darkMode: {
    //  get() {
    //    var m = localStorage.getItem('darkMode');
    //    return m
    //    //$vuetify.theme.dark
    //  },
    //  set(state) {
    //    localStorage.setItem('darkMode', state);
    //  }
    //}
  },
  created () {
    // get settings
    this.$store.commit('setSettings', window.pimpimSettings);
    this.$store.dispatch('setTotals');      
  },
  mounted () {
    this.indexCheck('pimpimMain');
    this.indexCheck('mango');
    this.$store.dispatch('setMessagesUnreadCount');
  },
  methods: {
    indexCheck: async function(dDoc) {
      const docs = {
        pimpimMain: ["indexes/pimpim_design_doc.json","pimpim"],
        mango: ["indexes/mango_indexes.json","pimpim_mango_indexes"]
      };

      const getServerDesignDoc = await fetch( docs[dDoc][0] );
      const serverDesignDoc = await getServerDesignDoc.json();

      const urlDB = this.$store.getters.urlDB;

      const getDatabaseDesignDoc = await fetch(urlDB + '_design/' + docs[dDoc][1]);
      const databaseDesignDoc = await getDatabaseDesignDoc.json();

      if (serverDesignDoc.version > databaseDesignDoc.version) {
        console.log('PIMPIM Server design document version is higher than the one in the database. Redirecting to setup');
        if(this.$route.matched[0].name != 'setup') {
          this.$router.push('setup')
        }
      }
    }
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