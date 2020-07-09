<template>
  <v-main>
    <v-container :fluid="$vuetify.breakpoint.mdAndDown">
      <v-skeleton-loader
        class="mx-auto"
        :loading="this.$store.getters.loaderState"
        transition="scroll-y-reverse-transition"
        type="list-item-avatar-two-line"
      >
        <v-data-iterator
          :items="contactList"
          item-key="_id"
          :items-per-page="50"
          :search="search"
          :sort-by="sortByFormatted"
          :loading="this.$store.getters.loaderState"
          loading-text="Getting Contacts"
          no-data-text="No contacts matching request"
        >
          <template v-slot:header>
            <v-toolbar class="mb-1" color="transparent" flat="flat">
              <v-text-field
                v-model="search"
                clearable="clearable"
                hide-details="hide-details"
                prepend-inner-icon="mdi-magnify"
                label="Filter list"
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-select
                v-model="sortBy"
                flat="flat"
                solo-inverted="solo-inverted"
                hide-details="hide-details"
                :items="keys"
                prepend-inner-icon="mdi-sort-variant"
                label="Sort by"
              ></v-select>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-list two-line="two-line">
              <contacts-item v-for="doc in props.items" :key="doc._id" v-bind:doc="doc"></contacts-item>
            </v-list>
          </template>
        </v-data-iterator>
      </v-skeleton-loader>
      <contacts-item-detailed></contacts-item-detailed>
    </v-container>
  </v-main>
</template>

<script>
import ContactsItem from "@/components/contacts/ContactsItem.vue";
import ContactsItemDetailed from "@/components/contacts/ContactsItemDetailed.vue";
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "contacts",
  components: {
    ContactsItem,
    ContactsItemDetailed
  },
  mixins: [pouchMixin],
  data: () => ({
    search: "",
    sortBy: "Given name",
    keys: ["Given name", "Family name"],
    navTabs: [
      {
        name: "All",
        to: "contacts",
        params: { list: "all" },
        icon: "mdi-all-inclusive"
      },
      {
        name: "People",
        to: "contacts",
        params: { list: "people" },
        icon: "mdi-account"
      },
      {
        name: "Organizations",
        to: "contacts",
        params: { list: "organizations" },
        icon: "mdi-domain"
      },
      {
        name: "Favorites",
        to: "contacts",
        params: { list: "favorites" },
        icon: "mdi-star-circle"
      }
    ]
  }),
  computed: {
    contactList() {
      const data = this.$store.getters.getData;
      const list = this.$route.params.list;

      return data.filter(function(el) {
        if (list == "people") {
          return el["@type"] == "Person";
        } else if (list == "organizations") {
          return el["@type"] == "Organization";
        } else if (list == "favorites") {
          return el.favorite;
        } else {
          return el;
        }
      });
    },

    sortByFormatted() {
      const x = this.sortBy.toLowerCase().split(" ");
      const secondLeg = x[1].charAt(0).toUpperCase() + x[1].slice(1);
      return x[0] + secondLeg;
    }
  },
  mounted() {
    this.getContacts();
    this.$store.commit("appBarTabs", this.navTabs);
  },
  beforeDestroy() {
    this.$store.commit("appBarTabs", []);
  },
  methods: {
    getContacts: async function() {
      try {
        let data = await this.getQuery("offpim/contacts-all", null, null, true);
        this.$store.commit("addDataArray", data);
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          color: "error",
          text: "Unable to get contacts",
          error: error
        });
      }
    }
  }
};
</script>