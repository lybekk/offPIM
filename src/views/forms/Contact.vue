<template lang="pug">
  v-container
    v-card(flat)
        v-card-text
            v-container
                v-row
                    v-col(cols="6")
                      v-btn(
                        outlined
                        block
                        color="primary"
                        @click="createContact(newPerson)"
                      )
                        v-icon mdi-account
                        span Person
                    v-col(cols="6")
                      v-btn(
                        outlined
                        block
                        color="primary"
                        @click="createContact(newOrganization)"
                      )
                        v-icon mdi-domain
                        span Organization

</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "formsNewContact",
  mixins: [pouchMixin],
  data: () => ({
    newPerson: {
      "@type": "Person",
      contactPoint: [],
      givenName: "New",
      familyName: "Contact",
      additionalName: null,
      gender: null,
      nationality: null,
      spouse: {
        identifier: null,
        name: null
      },
      keywords: [],
      birthDate: null,
      knowsAbout: [],
      description: null,
      knowsLanguage: [],
      jobTitle: null,
      telephone: null,
      email: null,
      url: null,
      address: {
        streetAddress: null,
        addressLocality: null,
        postalCode: null,
        addressRegion: null,
        addressCountry: null
      }
    },

    newOrganization: {
      "@type": "Organization",
      address: {
        streetAddress: null,
        addressLocality: null,
        addressCountry: null
      },
      email: null,
      url: null,
      legalName: "New contact",
      description: null,
      telephone: null,
      contactPoint: [],
      keywords: [],
      location: {
        "@type": "Place",
        geo: {
          "@type": "GeoCoordinates",
          latitude: null,
          longitude: null
        }
      },
      additionalType: null
    }
  }),
  methods: {
    createContact: async function(obj) {
      obj.created = new Date().toISOString();
      const response = await this.putDoc(obj);
      if (response.ok) {
        const freshDoc = await this.getDoc(response.id);
        this.$store.commit("setSelectedDoc", freshDoc);
        this.$router.push({ name: "contacts" });
        // INFO: Timeout set due to lag on route change concurrent with getContacts
        setTimeout(() => {
          this.$store.commit("dialogItemDetailedShow");
        }, 850);
      }
    }
  }
};
</script>