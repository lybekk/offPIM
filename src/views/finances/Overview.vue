<template lang="pug">
  v-container(fluid)
    //-v-content
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
    p One-time expenses go in transactions(href)
    p recurring expenses go in (subscriptions or liabilities?)
</template>
<script>
export default {
  name: "financesOverview",
  components: {},
  props: {
    source: String,
  },
  data: () => ({}),
  computed: {},
  created: function() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    getColor: function(number) {
      return number >= 0 ? "success" : "error";
    },
  },
};
</script>
