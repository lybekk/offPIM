<template lang="pug">
v-container(fluid)
  p <!-- placeholder -->
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
    )
</template>
<script>

export default {
  name: 'financesTransactions',
  components: {
  },
  props: {
    source: String,
  },
  data: () => ({
    search: null,
    headers: [
      { text: 'Amount', value: 'amount' },
      { text: 'Date', value: 'date' },
      { text: 'Sender', value: 'sender' },
      { text: 'Recipient', value: 'recipient' },
      { text: 'Category', value: 'category' },
      { text: 'Description', value: 'description' },
    ]
  }),
  computed: {
  },
  created: function () {
  },
  mounted () {
    this.$store.dispatch('getFinancialData', 'transaction');
  },
  beforeDestroy() {
  },
  methods: {
  }
}

</script>