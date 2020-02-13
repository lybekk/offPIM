<template lang="pug">
v-content
  v-container(fluid)
    span Under construction
    p bank accounts & investment
    p credit
    ul
      li Accounts: 0
    //p Setting in pimpim settings document for currency(showed currency)
</template>
<script>

export default {
  name: 'financesOverview',
  components: {
  },
  props: {
    source: String,
  },
  data: () => ({
  }),
  computed: {
  },
  created: function () {
  },
  mounted () {
  },
  beforeDestroy() {
  },
  methods: {
  }
}

</script>