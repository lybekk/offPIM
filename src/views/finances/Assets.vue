<template lang="pug">
v-content
  v-container(fluid)
    span Under construction
    p Assets
    p Assets.(fixed assets?)
    v-data-table(
      :headers="headers"
      :items="desserts"
      :items-per-page="5"
      class="elevation-1"
    )
    pre(v-text="assetsStructureTemporary")
    p inventory
    //TODO Assets (get items from inventory(if marked as asset?)?)
    //assets
    // accounts
    // physical
    //fixed assets
    //assets
      accounts
      inventory (fixed assets)

</template>
<script>

export default {
  name: 'financesAssets',
  components: {
  },
  props: {
    source: String,
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
    }
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