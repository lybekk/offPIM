<template lang="pug">
v-content
  v-container(
    class="fill-height"
  )
    //fluid?
    v-row(
      align="center"
      justify="center"
    )
      v-col(
        cols="12"
        sm="8"
        md="4"
      )
        p(class="text-center display-3") Welcome.
    //v-row(v-if="!dbChoice")
      v-col(class="text-center")
        p Which database would you like to use?
        //-v-img(src="../assets/vuetify-logo-dark.png")
        //-v-item-group(multiple)
        v-row
          //-align="center"
          //-justify="center"
          v-col(
            v-for="db in ['PouchDB','CouchDB']"
            :key="db"
            cols="6"
            class="text-center"
          )
            v-img(
              height="25vh"
              contain
              :src="require(`@/assets/${db}-logo.png`)"
            )
            v-btn(
              ripple
              outlined
              color="primary"
              @click="setDbChoice(db)"
            ) { db }}
        //-v-item-group
          v-container
            v-row(
              align="center"
              justify="center"
            )
              v-col(
                v-for="n in ['pouchdb','couchdb']"
                :key="n"
                cols="12"
                md="4"
              )
                v-item(v-slot:default="{ active, toggle }")
                  v-card(
                    :color="active ? 'success' : ''"
                    class="d-flex align-center"
                    height="25vh"
                    @click="toggle"
                  )
                    v-scroll-y-transition
                      div(
                        v-if="active"
                        class="display-3 flex-grow-1 text-center secondary--text"
                      ) OK
</template>

<script>

export default {
  name: 'welcome',
  components: {
  },
  data: () => ({
    //dbChoice: localStorage.getItem('dbChoice')
    //active: null
  }),
  computed: {
  },
  created () {
  },
  mounted () {
    this.allIsWell()
    /*
    if (this.dbChoice) {
      this.allIsWell()
    }
    */
    //console.log(this.dbChoice)    
  },
  methods: {
    allIsWell: function () {
      setTimeout(() => {
        this.$router.push('dashboard')
      }, 600);
    }
    /*
    setDbChoice: function (choice) {
      localStorage.setItem('dbChoice', choice)
      if (localStorage.getItem('dbChoice') == 'PouchDB') {
        this.$store.commit('setGenericStateBooleanTrue', 'isPouchDB')
      }
      this.$store.dispatch(
        'startup'
        //localStorage.getItem('dbChoice')
      )
      this.allIsWell()
    }
    */
  }
}
</script>
