<template lang="pug">
v-content
  v-container(
    class="fill-height"
    )
    v-row(
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndUp"
      )
      v-col(
        v-for="link,i in links"
        :key="i"
        cols="12"
        sm="3"
        class="text-center"
      )
        v-hover(v-slot:default="{ hover }")
          v-btn(
            :fab="$vuetify.theme.dark"
            :icon="!$vuetify.theme.dark"
            color="secondary"
            :to="link.link"
            x-large
            :height="$vuetify.breakpoint.smAndUp ? '10vw' : '10vh'"
            :width="$vuetify.breakpoint.smAndUp ? '10vw' : '10vh'"
            :elevation="hover ? 4 : 1"
          )
            //-color="transparent"
            v-icon(
              v-text="link.icon" 
              :size="hover ? '8.5vw' : '8vw'"
            )
              //-color="secondary"
            v-scroll-y-reverse-transition
              v-overlay(
                v-if="hover && $vuetify.breakpoint.mdAndUp" 
                opacity="0.8"
                absolute 
                color="primary"
                )
                span(v-text="link.text")
    //-v-row(
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndUp"
      )
      v-col(
        v-for="link,i in links"
        :key="i"
        cols="6"
        sm="3"
        class="text-center"
      )
        v-card(height="25vh")
          v-btn(block height="100%")
            v-icon(x-large) mdi-check

</template>

<script>

export default {
  name: 'welcome',
  components: {
  },
  data: () => ({
    links: [
      {
        text: 'Tasks',
        icon: 'mdi-check',
        link: '/tasks'
      },
      {
        text: 'Notes',
        icon: 'mdi-note',
        link: '/notes'
      },
      {
        text: 'Dashboard',
        icon: 'mdi-view-dashboard',
        link: '/dashboard'
      },
      {
        text: 'Messages',
        icon: 'mdi-email',
        link: '/messages'
      },
    ]
  }),
  computed: {
  },
  created () {
    this.$store.commit('setLeftDrawer', false)
  },
  mounted () {
  },
  methods: {
    /* keep. will be used for setting: autopush route dashboard */
    allIsWell: function () {
      setTimeout(() => {
        this.$router.push('dashboard')
      }, 600);
    }
  }
}
</script>
