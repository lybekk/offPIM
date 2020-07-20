<template>
  <v-container fluid>
    <span>Under construction</span>
    <p>bank accounts & investment</p>
    <p>credit</p>
    <ul>
      <li>Accounts: 0</li>
      <li>
        Accounts value
        <v-chip
          label
          :color="getColor(this.$store.getters.getFinancialAggregates.valueAccounts)"
          v-text="this.$store.getters.getFinancialAggregates.valueAccounts"
        />
      </li>
    </ul>
    <p>One-time expenses go in transactions(href)</p>
    <p>recurring expenses go in (subscriptions or liabilities?)</p>
  </v-container>
</template>
<script>
export default {
  name: "FinancesOverview",
  methods: {
    getColor: function(number) {
      return number >= 0 ? "success" : "error";
    },
  },
};
</script>
