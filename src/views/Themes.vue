<template>
  <v-content>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-toolbar>
            <v-toolbar-title>Locally configured theme: <span v-text="currentTheme" /></v-toolbar-title>
            <v-spacer />
            <v-btn @click="setThemeInLocalStorage(false)">
              Reset to default
            </v-btn>
          </v-toolbar>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>Themes</v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(theme, i) in themes"
              :key="i"
              cols="12"
            >
              <v-card>
                <v-card-title>{{ i }}</v-card-title>
                <v-card-text>
                  <v-chip
                    v-for="btn in theme"
                    :key="btn"
                    label
                    :color="btn"
                    v-text="btn"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    outlined
                    @click="applyLightTheme(i)"
                  >
                    Apply for session
                  </v-btn>
                  <!-- Use (used in this browser only)-->
                  <v-btn
                    outlined
                    @click="setThemeInLocalStorage(i)"
                  >
                    Apply permamently for this browser
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-card>
            <v-card-title>Applied theme: <span v-text="appliedTheme" /></v-card-title>
            <v-card-text>
              <h4>Buttons</h4>
              <v-btn
                v-for="btn in colors"
                :key="btn"
                :color="btn"
                v-text="btn"
              />
              <h4>Text buttons</h4>
              <v-btn
                v-for="btn in colors"
                :key="btn"
                text
                :color="btn"
                v-text="btn"
              />
              <h4>Alerts</h4>
              <v-alert
                v-for="alert in ['success','info','warning','error']"
                :key="alert"
                :type="alert"
              >
                {{ alert }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>

export default {
  name: 'Themes',
  components: {
  },
  data: () => ({
    appliedTheme: null
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

  }
}
</script>
