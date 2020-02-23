<template lang="pug">
v-content
  v-container(fluid)
    //-span Under construction
    //h3 Budgeting and cash flow forecasting
    h3 Income
    v-card
      v-card-title <!-- data.length? -->
        v-spacer
        v-text-field(
          v-model="searchIncome"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        )
      v-data-table(
        :headers="headers"
        :items="this.$store.getters.getBudget('income')"
        :items-per-page="10"
        :search="searchIncome"
        class="elevation-1"
        :loading="this.$store.getters.loaderState"
        loading-text="Looking for transactions"
        no-data-text="No transactions matching request"
      )
        //-template(v-slot:item.description="{ item }")
          v-btn(
            text
            @click="openDoc(item)"
          )
            v-icon mdi-text
          span(v-text="item.description")
    h3 Expenses (grouped)
    v-card
      v-card-title <!-- data.length? -->
        v-spacer
        v-text-field(
          v-model="searchExpense"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        )
      v-data-table(
        :headers="headers"
        :items="this.$store.getters.getBudget('expense')"
        :items-per-page="10"
        :search="searchExpense"
        class="elevation-1"
        :loading="this.$store.getters.loaderState"
        loading-text="Looking for transactions"
        no-data-text="No transactions matching request"
      )
        //-template(v-slot:item.description="{ item }")
          v-btn(
            text
            @click="openDoc(item)"
          )
            v-icon mdi-text
          span(v-text="item.description")
    h3 Contracts/Subscriptions/Memberships
    //p recurring expenses
    //p historical (archived)
    //p delete or archive (in data table)
    //-pre(v-text="budgetStructureTemporary")
    //
      Liabilities??
      budget
      type for accounts (subscriptions/memberships? services?)

</template>
<script>

export default {
  name: 'financesBudget',
  components: {
  },
  props: {
    source: String,
  },
  data: () => ({
    searchIncome: null,
    searchExpense: null,
    headers: [
      { text: 'Label', value: 'name' },
      { text: 'Institution', value: 'institution' },
      { text: 'Amount', value: 'amount' },
      { text: 'Category', value: 'category' },
      { text: 'Description', value: 'description' },
    ]
  }),
  computed: {
    /*
    budgetStructureTemporary: function () {
      const j = {
        _id: '1234-5678-91011-121314',
        realm: 'finance',
        type: 'income', //income/expense
        category: 'salary' //salary, subscription
      };
      return JSON.stringify(j, null, 2)
    }
    */
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('getFinancialData', 'income');
    this.$store.dispatch('getFinancialData', 'expense');
  },
  beforeDestroy() {
  },
  methods: {
  }
}


/*
                    "Bank Charges",
                    "Cable or streaming packages",
                    "Car Insurance",
                    "Car Payment",
                    "Car Repairs",
                    "Cell Phone",
                    "Clothes",
                    "Clothing, jewelry, etc.",
                    "Dining out",
                    "Electric",
                    "Entertainment",
                    "Furniture",
                    "Gardener/pool/alarm service",
                    "Gas",
                    "Gym or club memberships",
                    "Home decor items",
                    "Insurance",
                    "Internet",
                    "Misc.",
                    "Movie, concert and event tickets",
                    "Natural Gas",
                    "Other",
                    "Phone",
                    "Rent/Mortgage",
                    "School Expenses",
                    "Sewer",
                    "Special meals at home",
                    "Travel expenses",
                    "Waste Disposal",
                    "Water",
*/

</script>

