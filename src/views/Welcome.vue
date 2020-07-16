<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-carousel v-model="carousel" height="25vh" hide-delimiters :show-arrows="false">
        <v-carousel-item v-for="(slide, i) in slides" :key="i" transition="scroll-x-transition">
          <v-sheet height="100%" color="transparent text--disabled">
            <v-row class="fill-height" align="center" justify="center">
              <div class="text-h3 font-weight-black" v-text="slide"></div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-row align="center" justify="center" no-gutters>
            <v-col cols="6">
              <v-sheet>
              <v-navigation-drawer floating permanent>
                <v-list shaped>
                  <v-list-item
                    v-for="item in links"
                    :key="item.title"
                    link
                    @click="$router.push(item.link)"
                  >
                    <v-list-item-icon>
                      <v-icon color="secondary">{{ item.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "welcome",
  data: () => ({
    carousel: 0,
    links: [
      {
        text: "Tasks",
        icon: "mdi-check",
        link: "/tasks"
      },
      {
        text: "Notes",
        icon: "mdi-note",
        link: "/notes"
      },
      {
        text: "Dashboard",
        icon: "mdi-view-dashboard",
        link: "/dashboard"
      },
      {
        text: "Logbook",
        icon: "mdi-book-open",
        link: "/logbook"
      }
    ],
    slides: [
      "hello",
      new Date().toDateString(),
      new Date().toLocaleTimeString()
    ]
    /*
     */
  }),
  computed: {},
  created() {
    this.$store.commit("setLeftDrawer", false);
  },
  mounted() {
    setTimeout(() => {
      this.carousel = 1;
    }, 800);
    setTimeout(() => {
      this.carousel = 2;
    }, 2000);
    /*
    setInterval(updateClock, 1000);
    */
     this.updateClock()
  },
  methods: {
    /* keep. will be used for setting: autopush route dashboard */
    allIsWell: function() {
      setTimeout(() => {
        this.$router.push("dashboard");
      }, 600);
    },

    updateClock: function() {
      var v = this;
      setInterval(function() {
        let t = new Date().toLocaleTimeString();
        v.slides.splice(2, 1, t);
      }, 1000);
    }
  }
};
</script>
