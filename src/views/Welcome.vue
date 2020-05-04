<template lang="pug">
  v-container(
    class="fill-height"
  )
    v-row(
      align="center"
      justify="center"
    )
      v-col(
        v-for="link in links"
        cols="12"
        sm="3"
        class="text-center"
      )
        v-hover(v-slot:default="{ hover }")
          v-btn(
            icon
            :to="link.link"
            x-large
            height="10vw"
            width="10vw"
            :elevation="hover ? 16 : 1"
          )
            v-icon(
              v-text="link.icon" 
              
              color="primary"
              :size="hover ? '9vw' : '8vw'"
            )
            v-scroll-y-reverse-transition
              v-overlay(v-if="hover" absolute color="primary")
                span(v-text="link.text")
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
