<template>
  <v-main>
    <v-navigation-drawer
      v-model="drawer" 
      app 
      right 
      temporary
    >
      <v-sheet
        class="pa-4 primary lighten-2"
        dark
      >
        <v-icon>mdi-tag</v-icon>Tags
      </v-sheet>
      <v-sheet class="pa-1">
        <v-list
          nav
          dense
          subheader
        >
          <v-list-item
            v-for="(tag, i) in tagList"
            :key="i"
            link
            @click="filterByTag = tag"
          >
            <v-list-item-content>
              <v-list-item-title v-text="tag" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>
    <v-container 
      :fluid="isSmallScreen"
      :class="isSmallScreen ? 'pa-0' : ''"
    >
      <v-skeleton-loader
        :loading="this.$store.getters.loaderState"
        transition="scroll-y-reverse-transition"
        type="list-item-avatar-two-line"
      >
        <v-data-iterator
          ref="contactsDataIterator"
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
            <v-toolbar
              class="mb-1"
              dark
              color="primary darken-1"
              elevation="1"
              extended
            >
              <v-btn
                class="ma-2"
                color="secondary"
                @click="drawer = !drawer"
              >
                <v-icon left>
                  mdi-tag
                </v-icon>
                <span>Tags</span>
              </v-btn>
              <v-chip
                v-if="filterByTag"
                class="ma-2"
                close
                color="teal"
                text-color="white"
                close-icon="mdi-close"
                @click:close="filterByTag = null"
              >
                <v-avatar left>
                  <v-icon>mdi-tag</v-icon>
                </v-avatar>
                {{ filterByTag }}
              </v-chip>
              <v-spacer />
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    aria-label="Sync dialog"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="exportAllToVCF">
                    <v-list-item-title>Export all - VCF</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportCurrentListToVCF">
                    <v-list-item-title>Export List - VCF</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="exportToGoogleCSV">
                    <v-list-item-title>Export all - Google CSV</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template v-slot:extension>
                <v-text-field
                  v-model="search"
                  class="ma-2 pb-2"
                  clearable
                  hide-details
                  solo-inverted
                  flat
                  prepend-inner-icon="mdi-magnify"
                  label="Filter list"
                />
                <v-spacer />
                <v-select
                  v-model="sortBy"
                  class="ma-2 pb-2"
                  flat
                  solo-inverted
                  hide-details
                  :items="keys"
                  prepend-inner-icon="mdi-sort-variant"
                  label="Sort by"
                />
              </template>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-list two-line>
              <ContactsItem
                v-for="doc in props.items"
                :key="doc._id"
                :doc="doc"
              />
            </v-list>
          </template>
        </v-data-iterator>
      </v-skeleton-loader>
      <ContactsItemDetailed />
    </v-container>
  </v-main>
</template>

<script>
import ContactsItem from "@/components/contacts/ContactsItem.vue";
import ContactsItemDetailed from "@/components/contacts/ContactsItemDetailed.vue";
import formatMixin from '@/mixins/formatMixin'
import pouchMixin from "@/mixins/pouchMixin";
var vCardsJS = require('vcards-js');
import { saveAs } from 'file-saver';

export default {
  name: "Contacts",
  components: {
    ContactsItem,
    ContactsItemDetailed,
  },
  mixins: [pouchMixin, formatMixin],
  data: () => ({
    drawer: false,
    tagList: [],
    filterByTag: null,
    search: "",
    sortBy: "Full name",
    keys: ["Given name", "Family name", "Full name"],
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
      let data = this.$store.getters.getData;
      const list = this.$route.params.list;

      let f = this.filterByTag;
      if (f) {
        data = data.filter(function(contact) {
          return contact.keywords.includes(f)
        })
      }

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

        for await (let doc of data) {
          if (doc.givenName) {
            doc.fullName = [doc.givenName, doc.additionalName].join(" ");
          } else {
            doc.fullName = doc.legalName;
          }
        }

        this.$store.commit("addDataArray", data);
        this.populateTagList();
      } catch (error) {
        this.$store.dispatch("infoBridge", {
          color: "error",
          text: "Unable to get contacts",
          error: error
        });
      }
    },

    populateTagList: async function() {
      const data = this.$store.getters.getData;
      let tagsFound = new Set();
      for await (let contact of data) {
        let k = contact.keywords;
        if (k.length) {
          tagsFound.add(...k);
        }
      }
      this.tagList = tagsFound;
    },

    exportAllToVCF: async function() {
      const data = this.$store.getters.getData;
      this.convertContactsToVCF(data)
    },

    exportCurrentListToVCF: async function() {
      this.convertContactsToVCF(
        this.contactList
      )
    },

    convertContactsToVCF: async function(data) {
      let exportContent = [];
      for await (let contact of data) {
        let vCard = vCardsJS();
        vCard.firstName = contact.givenName;
        vCard.lastName = contact.familyName;
        vCard.test = 'testings';
        exportContent.push(vCard.getFormattedString())
      }
      const blob = await new Blob(exportContent, {type: "text/plain;charset=utf-8"});
      saveAs(blob, "contacts.vcf");
    },

    exportToGoogleCSV: function() {
      const headers = "Name,Given Name,Additional Name,Family Name,Yomi Name,Given Name Yomi,Additional Name Yomi,Family Name Yomi,Name Prefix,Name Suffix,Initials,Nickname,Short Name,Maiden Name,Birthday,Gender,Location,Billing Information,Directory Server,Mileage,Occupation,Hobby,Sensitivity,Priority,Subject,Notes,Language,Photo,Group Membership,E-mail 1 - Type,E-mail 1 - Value,IM 1 - Type,IM 1 - Service,IM 1 - Value,Website 1 - Type,Website 1 - Value";
      console.log(headers.split(','))
    }

  }
};
</script>
