<template lang="pug">
v-content
  v-container(
    class="fill-height"
    fluid
  )
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

</template>

<script>

export default {
  name: 'welcome',
  components: {
  },
  data: () => ({
  }),
  computed: {
  },
  created () {
  },
  mounted () {
    setTimeout(() => {
      this.$router.push('dashboard')
    }, 800);
  },
}
</script>
