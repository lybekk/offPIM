<template lang="pug">
v-content
  v-container(
    fluid
  ) 
    // removed: class="fill-height"
    v-row
      v-col
        v-toolbar
          v-toolbar-title Locally configured theme: 
            span(v-text="currentTheme")
          v-spacer
          v-btn(
            @click="setThemeInLocalStorage(false)"
          ) Reset to default
    v-row
      v-col(cols="6")
        v-row
          v-col
            v-card
              v-card-title Themes
        v-row
          v-col(
            v-for="(theme, i) in themes" 
            :key="i"
            cols="12"
            )
            v-card
              v-card-title {{ i }}
              v-card-text
                v-chip(
                  v-for="btn in theme"
                  label
                  :color="btn" 
                  v-text="btn"
                )
              v-card-actions
                v-btn(
                  outlined
                  @click="applyLightTheme(i)"
                ) Apply for session
                // Use (used in this browser only)
                v-btn(
                  outlined
                  @click="setThemeInLocalStorage(i)"
                ) Apply permamently for this browser                
      v-col(cols="6")
        v-card(
        )
          v-card-title Applied theme: 
            span(v-text="appliedTheme")
          v-card-text
            h4 Buttons
            v-btn(
              v-for="btn in colors"
              :color="btn" 
              v-text="btn"
            )
            h4 Text buttons
            v-btn(
              v-for="btn in colors"
              text
              :color="btn" 
              v-text="btn"
            )
            //-v-btn(
              v-for="btn in colors"
              :color="btn" 
              v-text="btn"
              )
            h4 Alerts
            v-alert(
              v-for="alert in ['success','info','warning','error']"
              :type="alert" 
            ) {{ alert }}
</template>

<script>

export default {
  name: 'themes',
  components: {
  },
  data: () => ({
    appliedTheme: null
    //colors: ["primary","secondary","info","error","warning","success"],
  }),
  computed: {
    colors: function() {
      return this.$store.getters.getThemeColors
    },
    themes: function() {
      return this.$store.getters.getThemes
    },
    currentTheme: function() {
      let x = localStorage.getItem("currentTheme")
      if (x) {
        return x
      } else {
        return 'None' 
      }
    }
  },
  created () {
  },
  mounted () {
    let ct = localStorage.getItem("currentTheme");
    if (ct) {
      this.appliedTheme = ct
    } else {
      this.appliedTheme = 'Default'
    }
  },
  methods: {
    applyLightTheme: function(themeName) {
      this.$store.dispatch('applyLightTheme', themeName)
      this.appliedTheme = themeName
    },
    setThemeInLocalStorage: function(themeName) {
      this.$store.dispatch('setThemeInLocalStorage', themeName)
      if (!themeName) {
        this.appliedTheme = 'Default'
      }
    }
    /*
    applyLightTheme: function(themeName) {
      const obj = this.themes[themeName]
      let l = this.$vuetify.theme.themes.light;
      Object.keys(obj).forEach(element => {
        l[element] = obj[element]
      });
    }
    */
  }
}
</script>
