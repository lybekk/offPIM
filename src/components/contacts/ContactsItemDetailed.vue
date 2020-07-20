<template>
  <v-bottom-sheet
    v-model="dialogItemDetailed"
    scrollable
    :inset="$vuetify.breakpoint.mdAndUp"
  >
    <v-card>
      <v-card-title>
        <v-tabs
          v-model="activeTab"
          color="primary"
          grow
        >
          <v-tabs-slider />
          <v-tab
            v-for="(tab,i) in tabs"
            :key="i"
          >
            <v-icon left>
              {{ tab.icon }}
            </v-icon><span v-if="!$vuetify.breakpoint.mdAndDown">{{ tab.text }}</span>
          </v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <v-row>
                <v-col
                  v-if="doc['@type'] == 'Person'"
                  cols="12"
                  sm="4"
                >
                  <div
                    v-for="(item,i) in bioFields"
                    :key="i"
                  >
                    <v-text-field
                      class="title"
                      :label="item.label"
                      :value="doc[item.field]"
                      filled
                      @change="setDocField(item.field, $event)"
                    />
                  </div>
                </v-col>
                <v-col
                  v-if="doc['@type'] == 'Organization'"
                  cols="12"
                >
                  <v-text-field
                    class="title"
                    label="Legal name"
                    :value="doc.legalName"
                    filled
                    @change="setDocField('legalName', $event)"
                  />
                  <v-text-field
                    class="title"
                    label="Organization type"
                    :value="doc.additionalType"
                    filled
                    @change="setDocField('additionalType', $event)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-textarea
                    :value="doc.description"
                    rows="2"
                    filled
                    auto-grow
                    label="Notes/Description"
                    @change="setDocField('description', $event)"
                  />
                </v-col>
                <v-col
                  v-if="doc['@type'] == 'Person'"
                  cols="12"
                  sm="4"
                >
                  <h4>Birth date</h4>
                  <v-date-picker
                    :value="birthDateComputed"
                    :show-current="false"
                    @change="setDate('birthDate',$event)"
                  />
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <ContactsItemDetailedLocations />
            </v-tab-item>
            <v-tab-item>
              <h3>Contact options</h3>
              <v-text-field
                label="Telephone"
                :value="doc.telephone"
                filled
                @change="setDocField('telephone',$event)"
              >
                <v-btn
                  slot="prepend"
                  icon
                  color="secondary"
                  :href="'tel:' + doc.telephone"
                >
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
                <v-btn
                  slot="append"
                  icon
                  color="secondary"
                  :href="'sms:' + doc.telephone"
                >
                  <v-icon>mdi-message</v-icon>
                </v-btn>
              </v-text-field>
              <v-text-field
                label="Email"
                :value="doc.email"
                filled
                @change="setDocField('email',$event)"
              >
                <v-btn
                  slot="prepend"
                  icon
                  color="secondary"
                  :href="'mailto:' + doc.email"
                >
                  <v-icon>mdi-email</v-icon>
                </v-btn>
              </v-text-field>
              <v-text-field
                label="Website"
                :value="doc.url"
                filled
                @change="setDocField('url',$event)"
              >
                <v-btn
                  slot="prepend"
                  icon
                  color="secondary"
                  :href="doc.url"
                  target="_blank"
                >
                  <v-icon>mdi-web</v-icon>
                </v-btn>
              </v-text-field>
              <h3>Other contact points</h3>
              <ContactsItemDetailedContactpoints />
            </v-tab-item>
            <v-tab-item>
              <v-row v-if="doc['@type'] == 'Person'">
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-combobox
                    :value="doc.knowsAbout"
                    label="Expertise/skills"
                    filled
                    multiple
                    chips
                    deletable-chips
                    @change="setDocField('knowsAbout',$event)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    label="Spouse ID"
                    hint="Insert document ID for spouse to enable lookup"
                    :value="spouseId"
                    :error-messages="spouseIdMatch ? '' : 'Spouse document not found'"
                    filled
                    clearable
                    @change="setSpouse('identifier',$event)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    label="Spouse name"
                    :value="spouseName"
                    filled
                    @change="setSpouse('name',$event)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-combobox
                    :value="doc.knowsLanguage"
                    :items="languages"
                    item-text="language"
                    item-value="ISO639_1"
                    :return-object="false"
                    label="Languages"
                    filled
                    multiple
                    chips
                    deletable-chips
                    @change="setDocField('knowsLanguage',$event)"
                  />
                </v-col>
                <v-col cols="12">
                  <h3>Professional</h3>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    label="Job title"
                    :value="doc.jobTitle"
                    filled
                    @change="setDocField('jobTitle',$event)"
                  />
                </v-col>
                <v-col cols="12">
                  <h3>Other</h3>
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-text-field
                    label="Nationality"
                    :value="doc.nationality"
                    filled
                    @change="setDocField('nationality',$event)"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="4"
                >
                  <v-combobox
                    :value="doc.keywords"
                    label="Tags/labels/keywords"
                    filled
                    multiple
                    chips
                    deletable-chips
                    @change="setDocField('keywords',$event)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <p>{{ doc._id }}</p>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions color="primary">
        <v-btn
          icon
          @click="$store.dispatch('setRawDocumentViewerDocument', doc._id)"
        >
          <v-icon>mdi-code-braces-box</v-icon>
        </v-btn>
        <v-divider vertical />
        <v-checkbox
          :value="doc.favorite ? true : false"
          label="Favorite"
          on-icon="mdi-star"
          off-icon="mdi-star-outline"
          color="primary"
          @change="setDocField('favorite',$event)"
        />
        <v-spacer />
        <MainDeleteButton :document-id="doc._id" />
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import languages from "@/assets/data/languages.json";
import ContactsItemDetailedContactpoints from "@/components/contacts/ContactsItemDetailedContactpoints.vue";
import ContactsItemDetailedLocations from "@/components/contacts/ContactsItemDetailedLocations.vue";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";
import pouchMixin from "@/mixins/pouchMixin";
import MainDeleteButton from "@/components/MainDeleteButton.vue";
/* TODO: Implement occupations
import ContactsItemDetailedOccupations from '@/components/contacts/ContactsItemDetailedOccupations.vue';
*/

export default {
  name: "Contactsitemdetailed",
  components: {
    ContactsItemDetailedContactpoints,
    ContactsItemDetailedLocations,
    MainDeleteButton
    //ContactsItemDetailedOccupations
  },
  mixins: [pouchMixin, itemDetailedMixin],
  data: () => ({
    spouseIdMatch: true,
    languages: languages,
    activeTab: "",
    tabs: [
      {
        text: " Bio",
        icon: "mdi-text"
      },
      {
        text: "Locations",
        icon: "mdi-map"
      },
      {
        text: "Contact options",
        icon: "mdi-phone"
      },
      {
        text: "Other",
        icon: "mdi-text"
      }
    ],
    bioFields: [
      {
        label: "Given name",
        field: "givenName"
      },
      {
        label: "Additional/middle name",
        field: "additionalName"
      },
      {
        label: "Family/last name",
        field: "familyName"
      },
      {
        label: "Gender",
        field: "gender"
      }
    ]
  }),
  computed: {
    spouseName() {
      try {
        return this.doc.spouse.name;
      } catch {
        return null;
      }
    },

    spouseId() {
      try {
        return this.doc.spouse.identifier;
      } catch {
        return null;
      }
    },

    birthDateComputed() {
      const d = this.doc.birthDate;
      if (d) {
        return new Date(d).toISOString().substr(0, 10);
      } else {
        return null;
      }
    }
  },
  methods: {
    setGeo: function(key, value) {
      let d = this.doc;
      d.location.geo[key] = value;
      this.setDocField("location", d.location);
    },

    setSpouse: async function(key, value) {
      // TODO: Needs code optimization/minifying
      // TODO: Consider moing into own component
      let freshDoc = await this.getDoc(this.doc._id);
      if (!freshDoc.spouse) {
        freshDoc.spouse = {};
      }

      function makeSpouse(identifier = null, name = null) {
        return {
          identifier: identifier,
          name: name
        };
      }

      if (key == "identifier") {
        try {
          if (value) {
            let spouseDoc = await this.getDoc(value, true);

            freshDoc.spouse = {
              identifier: value,
              name: [spouseDoc.givenName, spouseDoc.familyName].join(" ")
            };

            this.spouseIdMatch = true;
          } else {
            freshDoc.spouse = makeSpouse();
            this.spouseIdMatch = true;
          }
          this.setDocField("spouse", freshDoc.spouse);
        } catch {
          this.spouseIdMatch = false;
        }
      }
      if (key == "name") {
        if (typeof freshDoc.spouse === "string") {
          freshDoc.spouse = makeSpouse();
        }
        freshDoc.spouse.name = value;
        this.setDocField("spouse", freshDoc.spouse);
      }
    }
  }
};
</script>