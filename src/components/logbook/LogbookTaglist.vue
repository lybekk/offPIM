<template>
  <div>
    <v-treeview
      :load-children="fetch"
      :items="items"
      :open.sync="treeOpen"
      open-on-click
      activatable
      expand-icon="mdi-chevron-down"
      indeterminate-icon="mdi-bookmark-minus"
      transition
    >
      <template
        slot="label"
        slot-scope="{ item }"
      >
        <v-chip
          v-if="!item.children"
          class="ma-2"
          label="label"
          @click="getByTag(item)"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div
                left
                v-on="on"
              >
                <v-icon>mdi-label</v-icon>{{ item.name }}
              </div>
            </template>
            <span
              v-text="tagCount(item)"
            />
          </v-tooltip>
        </v-chip><span v-else>{{ item.name }}</span>
      </template>
    </v-treeview>
  </div>
</template>

<script>
export default {
  name: "Logbooktaglist",
  components: {},
  data: () => ({
    tags: [],
    isLoading: false,
    tree: [],
    treeActive: [],
    treeOpen: [],
    letters: []
  }),
  computed: {
    items() {
      const children = this.letters.map(letter => ({
        id: letter,
        name: this.getName(letter),
        children: this.getChildren(letter)
      }));

      return [
        {
          id: 1,
          name: "Tags",
          children
        }
      ];
    }
  },
  watch: {
    tags(val) {
      this.letters = val
        .reduce((acc, cur) => {
          let t;
          if (!cur.key[0]) {
            t = "Untagged";
          } else {
            t = cur.key[0];
          }
          const letter = t;

          if (!acc.includes(letter)) acc.push(letter);

          return acc;
        }, [])
        .sort();
    }
  },
  mounted() {},
  methods: {

    async fetch() {
      if (this.tags.length) return;
      try {
        var result = await window.db.query("offpim/logs-tag-count", {
          group: true
        });
        this.tags = result.rows;
        return;
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          text: error,
          color: "error"
        });
      }
    },

    getChildren(letter) {
      const tags = [];

      for (const tag of this.tags) {
        if (tag.key[0] !== letter) continue;

        tags.push({
          ...tag,
          name: this.getName(tag.key),
          id: tag.key
        });
      }

      return tags.sort((a, b) => {
        return a.key > b.key ? 1 : -1;
      });
    },

    getName(name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
    },

    getByTag: async function(item) {
      const tag = item.key;
      if (!item.children) {
        this.$store.commit("loaderActive");
        let mango = {
          selector: {
            "@type":"Event",
            keywords: {
              $in: [tag]
            }
          },
          limit: 100
        };
        if (tag == "inbox" || tag == "untagged") {
          mango.selector.keywords = [];
        }

        try {
          let data = await window.db.find(mango);
          this.$store.commit("addDataArray", data.docs);
          this.$store.commit("loaderInactive");
        } catch (error) {
          this.$store.dispatch("infoBridge", {
            text: error,
            color: "error"
          });
        }
      }
    },

    tagCount: function(item) {
      const x = this.tags.find(tag => tag.key === item.key);
      return x.value;
    }
  }
};
</script>
