<template lang="pug">
v-content
  v-container(fluid)
    span Under construction
    p Budgeting and cash flow forecasting
    p recurring expenses
    p historical (archived)
    p delete or archive (in data table)
    pre(v-text="budgetStructureTemporary")
    //      Assets (hente inn fra inventory?)
      Liabilities??
      budget
        dining out
        clothing
        Cable or streaming packages
      Clothing, jewelry, etc.
      Dining out
      Special meals at home
      Alcohol
      Movie, concert and event tickets
      Gym or club memberships
      Travel expenses
      Cable or streaming packages
      Home decor items
      Furniture
      Gardener/pool/alarm service
      Other
    //budget
      income
      expenses
    // income
      salary
    // Expenses
      insurance
      Rent/Mortgage
      Electric
      Natural Gas
      Water
      Sewer
      Waste Disposal
      Car Payment
      Car Repairs
      Car Insurance
      Gas
      Phone
      Cell Phone
      Internet
      Clothes
      Entertainment
      School Expenses
      Bank Charges
      Misc.
      //type for accounts (subscriptions/memberships? services?)

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
    budgetStructureTemporary: function () {
      const j = {
        _id: '1234-5678-91011-121314',
        realm: 'finance',
        type: 'income', //income/expense
        category: 'salary' //salary, subscription
      };
      return JSON.stringify(j, null, 2)
    }
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

