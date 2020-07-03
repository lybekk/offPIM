<template lang="pug">
v-main
  v-container(
    class="fill-height"
  )
    v-row(
      align="center"
      justify="center"
    )
      v-col(cols="12" sm="6")
        v-form(@submit.prevent="beginSearch")
          v-text-field(
            v-model="searchInput"
            hide-details
            placeholder="Search"
            outlined
            rounded
          )
          v-row(justify="center")
            v-col(cols="6")
              v-btn(
                type="submit"
                rounded
                block
                :loading="searchInProgress"
                color="secondary"
                ) Search
              //-@click="beginSearch"
        //- TODO - implement search help 
        //- either/or/both link to lunr.js https://lunrjs.com/guides/searching.html 
        //- Tooltip or container for short help text
      //-v-col
        //-v-btn(@click="buildIndex") Build index
        //-v-row
      v-col(cols="12" v-if="indexReady") {{ searchResultsFound }} Results
      v-col(cols="12" v-if="searchResultsFound >= 100") Showing {{ searchResults.length }} 
      v-col(
        cols="12"
        )
        v-list(three-line)
          search-result-item(
            v-for="result in searchResults"
            :key="result._id"
            :doc="result.doc" 
            :score="result.score"
            )

</template>

<script>
import lunr from "lunr";
import pouchMixin from "@/mixins/pouchMixin";
import SearchResultItem from "@/components/search/SearchResultItem.vue";

export default {
  name: "search",
  components: {
    SearchResultItem
  },
  mixins: [pouchMixin],
  data: () => ({
    indexReady: false,
    searchInProgress: false,
    searchInput: null,
    searchResultsFound: 0,
    searchResults: [],
    isActive: false
  }),
  computed: {},
  created() {},
  mounted() {
    // TODO - speed improvement. Checkbox for allDocs, or separate search at app-level
  },
  methods: {
    buildIndex: async function() {
      const documents = await window.db.allDocs({
        include_docs: true
      });

      const fieldList = [
        // Productivity
        "title",
        "description",
        "type",
        "status",
        "tags",
        // Messages
        "message",
        "sender",
        "recipient",
        "subject",
        "body",
        // Contacts
        "givenName",
        "familyName",
        "additionalName",
        "gender",
        "nationality",
        "spouse",
        "@type",
        "keywords",
        "birthDate",
        "knowsAbout",
        "knowsLanguage",
        "jobTitle",
        "telephone",
        "email",
        "url",
        "additionalType",
        "legalName"
      ];

      this.lunrIndex = lunr(function() {
        // may need await
        this.ref("_id");

        fieldList.forEach(element => {
          this.field(element);
        });

        // Contacts
        // TODO: register "contactPoint",
        let addressFields = [
          "streetAddress",
          "addressLocality",
          "postalCode",
          "addressRegion",
          "addressCountry"
        ];
        // Nested contact properties
        for (let field of addressFields) {
          this.field(field, {
            extractor: function(doc = {}) {
              if (doc.address) {
                return doc.address[field];
              }
            }
          });
        }

        // Heavy load
        documents.rows.forEach(function(doc) {
          this.add(doc.doc);
        }, this);
      });

      this.indexReady = true;
    },

    beginSearch: async function() {
      if (!this.searchInput) {
        this.$store.dispatch("infoBridge", {
          text: "Search input empty",
          color: "info",
          timeout: 2000
        });
        return;
      }

      this.searchInProgress = true;

      if (!this.indexReady) {
        await this.buildIndex();
      }

      this.searchResults = [];
      const result = this.lunrIndex.search(this.searchInput);
      this.searchResultsFound = result.length;
      // TODO pri2 - use 'score' property for sending results to segmentation/container

      result.slice(0, 100).forEach(r => {
        window.db
          .get(r.ref)
          .then(doc => this.searchResults.push({ score: r.score, doc: doc }));
      });

      this.searchInProgress = false;
    }
  }
};
</script>
