<template lang="pug">
div
  v-treeview(
    :load-children="fetch"
    :items="items"
    :open.sync="treeOpen"
    open-on-click
    activatable
    expand-icon="mdi-chevron-down"
    indeterminate-icon="mdi-bookmark-minus"
    transition
  )
    template(slot="label" slot-scope="{ item }")
      v-chip(
        v-if="!item.children"
        class="ma-2"
        label
        @click="getByTag(item)"
      )
        v-tooltip(bottom)
          template(v-slot:activator="{ on }")
            div(left v-on="on")
              v-icon mdi-label
              | {{ item.name }}
          span(v-text="tagCount(item)")
      span(v-else) {{ item.name }}
</template>

<script>

export default {
  name: 'logbooktaglist',
  components: {
  },
  data: () => ({
    tags: [],
    isLoading: false,
    tree: [],
    treeActive: [],
    treeOpen: [],
    letters: [],
  }),
  computed: {
    items () {
      const children = this.letters.map(letter => ({
        id: letter,
        name: this.getName(letter),
        children: this.getChildren(letter),
      }))

      return [{
        id: 1,
        name: 'Tags',
        children,
      }]
    },
  },
  watch: {
    tags (val) {
      this.letters = val.reduce((acc, cur) => {
        let t;
        if ( !cur.key[0] ) {
          t = 'Untagged'
        } else {
          t = cur.key[0]
        }
        const letter = t

        if (!acc.includes(letter)) acc.push(letter)

        return acc
      }, []).sort()
    },
  },
  mounted () {
  },
  methods: {
    fetch () {
      if (this.tags.length) return
      let url = this.$store.getters.urlDB;
      return fetch(url + '/_design/pimpim/_view/logs-tag-count?group=true')
        .then(res => res.json())
        .then(data => (this.tags = data.rows))
        .catch(err => console.log(err))
    },
    getChildren (letter) {
      const tags = []

      for (const tag of this.tags) {
        if (tag.key[0] !== letter) continue

        tags.push({
          ...tag,
          name: this.getName(tag.key),
          id: tag.key,
        })
      }

      return tags.sort((a, b) => {
        return a.key > b.key ? 1 : -1
      })
    },
    getName (name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    getByTag: function (item) {
      if (!item.children) {
        this.$store.dispatch('getLogEntriesByTag', item.name)
      }
    },
    tagCount: function (item) {
      const x = this.tags.find(tag => tag.key === item.name)
      return x.value
    },
  }
};
</script>
