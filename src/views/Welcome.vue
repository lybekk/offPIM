<template>
  <v-main>
    <v-container class="fill-height text-center" fluid>

  <v-carousel
    v-model="carousel"
    height="25vh"
    hide-delimiters
    :show-arrows="false"
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
      transition="scroll-x-transition"
    >
      <v-sheet
        height="100%"
        color="transparent text--disabled"
      >
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <div class="text-h3 font-weight-black" v-text="slide"></div>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>            
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card flat>
            <v-card-text>
              <v-row align="center" justify="center" no-gutters>
                <v-hover v-slot:default="{ hover }" v-for="(link,i) in links" :key="i">
                  <v-col cols="6">                        
                    <v-sheet
                      :color="hover ? 'secondary lighten-5': 'inherit'"
                      :elevation="hover ? 2 : 0"
                      rounded
                      style="cursor: pointer;"
                      @click="$router.push(link.link)"
                    >
                      <div class="align-self-center" text-center>
                        <v-btn text color="secondary">
                          <v-icon v-text="link.icon" x-large color="secondary"></v-icon>
                        </v-btn>
                      </div>
                      <span v-text="link.text" class="text--secondary font-weight-medium" />
                    </v-sheet>
                  </v-col>
                </v-hover>
              </v-row>
            </v-card-text>
          </v-card>
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
          'hello',
          new Date().toDateString(),
          new Date().toLocaleTimeString(),
        ],
          /*
         */
  }),
  computed: {},
  created() {
    this.$store.commit("setLeftDrawer", false);
  },
  mounted() {
    setTimeout(() => {
      this.carousel = 1
    }, 800);
    setTimeout(() => {
      this.carousel = 2
    }, 2000);
    /*
    setInterval(updateClock, 1000);
     this.updateClock()
    */
  },
  methods: {
    /* keep. will be used for setting: autopush route dashboard */
    allIsWell: function() {
      setTimeout(() => {
        this.$router.push("dashboard");
      }, 600);
    },

    updateClock: function () {
      var v = this;
      setInterval(function () {
       let t = new Date().toLocaleTimeString()
      v.slides.splice(2, 1, t)
    }, 1000);
   },

  }
};
</script>
