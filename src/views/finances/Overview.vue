<template lang="pug">
v-content
  v-container(fluid)
    span Under construction
    p bank accounts & investment
    p credit
    ul
      li Accounts: 0
      li Accounts value
        v-chip(
          v-text="this.$store.getters.getFinancialAggregates.valueAccounts"
          label
          :color="getColor(this.$store.getters.getFinancialAggregates.valueAccounts)"
        )
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
    getColor: function(number) {
      return (number >= 0) ? "success" : "error";
    },
  }
}

</script>