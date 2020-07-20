<template lang="pug">
v-content
  v-container(fluid)
    h3 Total value
    v-container
      v-simple-table
        template(v-slot:default)
          thead
            tr
              th(class="text-left") Metric
              th(class="text-left") Value
          tbody
            tr
              td
                v-btn(to="/finances/accounts" text) Accounts value
              td
                v-btn(
                  v-text="accAgg.valueAccounts"
                  :color="getColor(accAgg.valueAccounts)"
                  text
                  to="/finances/accounts" 
                )
                //class="error--text"
    p Counting account, fixed assets, and inventory
    p Assume inventory as fixed assets
    h3 Assets
    p Assets.(fixed assets?)
    p Work in progress. Assets (Fixed or otherwise) not applicable as an account or inventory. I.e. groups of something, like a stack of collecting cards
    //v-data-table(
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      class="elevation-1"
      )
    pre(v-text="assetsStructureTemporary")
    h3 Inventory
    p Arriving soon. Will fetch stats from inventory app/module
    //TODO Assets (get items from inventory(if marked as asset?)?)
    //assets
    // accounts
    // physical
    //fixed assets
    //assets
      accounts
      inventory (fixed assets)
    //assets not inventoryable. 
    //Other assets.

</template>
<script>

export default {
  name: 'FinancesAssets',
  components: {
  },
  data: () => ({
    headers: [
      'x',
      'xx',
      'xxx'
    ]
  }),
  computed: {
    assetsStructureTemporary: function () {
      const j = {
        _id: '1234-5678-91011-121314',
        realm: 'finance',
        type: 'asset' // type: {string} - The account type in the list ['none', 'bank', 'cash', 'asset', 'credit card', 'liability']
        // category?
      };
      return JSON.stringify(j, null, 2)
    },
    accAgg: function() {
      //return this.$store.getters.getFinancialAggregates.valueAccounts
      return this.$store.getters.getFinancialAggregates
    }
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