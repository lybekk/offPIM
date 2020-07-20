<template lang="pug">
v-container(fluid)
  p Bank accounts (investment, savings, retirement):
  v-card
    v-card-title <!-- data.length? -->
      v-spacer
      v-text-field(
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      )
    v-data-table(
      :headers="headers"
      :items="this.$store.getters.getData"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
      :loading="this.$store.getters.loaderState"
      loading-text="Looking for accounts"
      no-data-text="No accounts matching request"
    )
      template(v-slot:item.active="{ item }")
        v-icon(
          v-text="item.active ? 'mdi-check' : 'mdi-close'"
          :color="item.active ? 'success' : 'error'"
          )
      template(v-slot:item.balance="{ item }")
        v-chip(
          label
          :text-color="getColor(item.balance) + ' darken-4'"
          :color="getColor(item.balance) + ' lighten-5'"
        ) {{ item.balance }}
      template(v-slot:item.description="{ item }")
        v-btn(
          text
          @click="openDoc(item)"
        )
          v-icon mdi-text
    //- details/note: show icon for details-dialog/popup
      navigation drawer to the right? bottom sheetpopup?
      { item.description }}
      Subscriptions in expenses?
      p subcriptions and memberships
      p subscription
      membership/subscription (Opes)
        memberships
          free
          cost/expense/costsMoney
</template>
<script>

export default {
  name: 'FinancesAccounts',
  components: {
  },
  data: () => ({
    search: null,
    headers: [
      { text: 'Active', value: 'active' },
      { text: 'Account name', value: 'name' },
      { text: 'Institution', value: 'institution' },
      { text: 'Account number', value: 'number' },
      { text: 'Balance', value: 'balance' },
      { text: 'Currency', value: 'currency' },
      { text: 'Type', value: 'type' },
      { text: 'Category', value: 'category' },
      { text: 'Description', value: 'description' },
    ]
  }),
  computed: {
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('getFinancialData', 'account');
  },
  beforeDestroy() {
  },
  methods: {
    getColor: function(number) {
      return (number >= 0) ? "success" : "error";
    },
    openDoc: function(item) {
      console.log(item)
    }
  }
}

</script>