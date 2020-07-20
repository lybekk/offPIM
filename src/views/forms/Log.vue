<template>
  <v-container>
    <v-card flat>
      <v-card-title>
        <v-spacer />
        <SubmitButton :doc="doc" />
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="newEntry.name"
                label="Title"
                autofocus
                filled
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="newEntry.description"
                label="Details/Description"
                rows="3"
                filled
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newEntry.category"
                label="Category"
                dense
                filled
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-menu
                v-model="startDateModal"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="pickerStartDate"
                    label="Start date"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="pickerStartDate"
                  @input="startDateModal = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="11"
              sm="5"
            >
              <v-menu
                ref="starttimemodal"
                v-model="startTimeModal"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="pickerStartTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="pickerStartTime"
                    label="Due time"
                    prepend-icon="mdi-clock"
                    readonly
                    outlined
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="startTimeModal"
                  v-model="pickerStartTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.starttimemodal.save(pickerStartTime)"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
            >
              <v-menu
                v-model="endDateModal"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="pickerEndDate"
                    label="End date"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="pickerEndDate"
                  @input="endDateModal = false"
                />
              </v-menu>
            </v-col>
            <v-col
              cols="11"
              sm="5"
            >
              <v-menu
                ref="endtimemodal"
                v-model="endTimeModal"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="pickerEndTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="pickerEndTime"
                    label="End time"
                    prepend-icon="mdi-clock"
                    readonly
                    outlined
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="endTimeModal"
                  v-model="pickerEndTime"
                  format="24hr"
                  full-width
                  @click:minute="$refs.endtimemodal.save(pickerEndTime)"
                />
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="newEntry.keywords"
                :items="tagsListItems"
                label="Tags"
                multiple
                chips
                dense
                filled
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SubmitButton from "@/components/form/submit";

export default {
  name: "FormsNewLog",
  components: {
    SubmitButton
  },
  data: () => ({
    dialog: false,
    startDateModal: null,
    startTimeModal: null,
    endDateModal: null,
    endTimeModal: null,
    newEntry: {
      "@type": "Event",
      name: '',
      description: null,
      category: null,
      keywords: [],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      additionalType: 'logbook',
    }
  }),
  computed: {
    doc() {
      const doc = { ...this.newEntry };
      doc.created = new Date().toISOString();
      return doc;
    },
    tagsListItems: function() {
      return ["work in progress"]; // TEMP
    },
    pickerStartDate: {
      get() {
        return this.newEntry.startDate.substring(0, 10);
      },
      set(pickerValue) {
        let old = this.newEntry.startDate.substring(0, 10);
        var newDate = this.newEntry.startDate.replace(old, pickerValue);
        this.newEntry.startDate = newDate;
      }
    },
    pickerStartTime: {
      get() {
        return this.newEntry.startDate.substring(11, 16); //hhmm
      },
      set(pickerValue) {
        let old = this.newEntry.startDate.substring(11, 16);
        var newTime = this.newEntry.startDate.replace(old, pickerValue);
        this.newEntry.startDate = newTime;
      }
    },
    pickerEndDate: {
      get() {
        return this.newEntry.endDate.substring(0, 10);
      },
      set(pickerValue) {
        let old = this.newEntry.endDate.substring(0, 10);
        var newDate = this.newEntry.endDate.replace(old, pickerValue);
        this.newEntry.endDate = newDate;
      }
    },
    pickerEndTime: {
      get() {
        return this.newEntry.endDate.substring(11, 16);
      },
      set(pickerValue) {
        let old = this.newEntry.endDate.substring(11, 16);
        var newTime = this.newEntry.endDate.replace(old, pickerValue);
        this.newEntry.endDate = newTime;
      }
    }
  }
}
</script>