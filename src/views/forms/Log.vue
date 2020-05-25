<template lang="pug">
    v-container
        v-card(flat)
            v-card-title
                v-spacer
                submit-button(:doc="doc")
            v-card-text
                v-container
                    v-row(dense='')
                        v-col(cols='12')
                            v-text-field(
                                v-model='newEntry.title'
                                label='Title'
                                autofocus
                                filled
                                )
                        v-col(cols='12')
                            v-text-field(
                                v-model='newEntry.category'
                                label='Category'
                                dense
                                filled
                                )
                        v-col(cols='12')
                            v-textarea(
                                v-model='newEntry.description'
                                label='Details/Description'
                                rows='3'
                                filled
                                dense
                                )
                        v-col(cols='12')
                            v-combobox(
                                v-model='newEntry.tags'
                                :items='tagsListItems'
                                label='Tags'
                                multiple
                                chips
                                dense
                                filled
                                )
                        v-col(cols='12', sm='6', md='4')
                            v-menu(
                                v-model='startDateModal'
                                :close-on-content-click='false'
                                :nudge-right='40'
                                transition='scale-transition'
                                offset-y
                                min-width='290px'
                                )
                                template(v-slot:activator='{ on }')
                                    v-text-field(
                                        v-model='pickerStartDate'
                                        label='Start date'
                                        prepend-icon='mdi-calendar'
                                        readonly
                                        v-on='on'
                                        filled
                                        )
                                v-date-picker(v-model='pickerStartDate', @input='startDateModal = false')
                        v-col(cols='11', sm='5')
                            v-menu(ref='starttimemodal', v-model='startTimeModal', :close-on-content-click='false', :nudge-right='40', :return-value.sync='pickerStartTime', transition='scale-transition', offset-y='', max-width='290px', min-width='290px')
                                template(v-slot:activator='{ on }')
                                    v-text-field(
                                        v-model='pickerStartTime'
                                        label='Due time'
                                        prepend-icon='mdi-clock'
                                        readonly
                                        v-on='on'
                                        filled
                                        )
                                v-time-picker(v-if='startTimeModal', v-model='pickerStartTime', format='24hr', full-width='', @click:minute='$refs.starttimemodal.save(pickerStartTime)')
                        v-col(cols='12', sm='6', md='4')
                            v-menu(v-model='endDateModal', :close-on-content-click='false', :nudge-right='40', transition='scale-transition', offset-y='', min-width='290px')
                                template(v-slot:activator='{ on }')
                                    v-text-field(
                                        v-model='pickerEndDate'
                                        label='End date'
                                        prepend-icon='mdi-calendar'
                                        readonly
                                        v-on='on'
                                        filled
                                        )
                                v-date-picker(v-model='pickerEndDate', @input='endDateModal = false')
                        v-col(cols='11', sm='5')
                            v-menu(ref='endtimemodal', v-model='endTimeModal', :close-on-content-click='false', :nudge-right='40', :return-value.sync='pickerEndTime', transition='scale-transition', offset-y='', max-width='290px', min-width='290px')
                                template(v-slot:activator='{ on }')
                                    v-text-field(
                                        v-model='pickerEndTime'
                                        label='End time'
                                        prepend-icon='mdi-clock'
                                        readonly
                                        v-on='on'
                                        filled
                                        )
                                v-time-picker(v-if='endTimeModal', v-model='pickerEndTime', format='24hr', full-width='', @click:minute='$refs.endtimemodal.save(pickerEndTime)')

</template>

<script>
import SubmitButton from "@/components/form/submit";

export default {
  name: "formsNewLog",
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
      title: "",
      description: null,
      logbook: true,
      tags: [],
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      category: null
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
        return this.newEntry.start.substring(0, 10);
      },
      set(pickerValue) {
        let old = this.newEntry.start.substring(0, 10);
        var newDate = this.newEntry.start.replace(old, pickerValue);
        this.newEntry.start = newDate;
      }
    },
    pickerStartTime: {
      get() {
        return this.newEntry.start.substring(11, 16); //hhmm
      },
      set(pickerValue) {
        let old = this.newEntry.start.substring(11, 16);
        var newTime = this.newEntry.start.replace(old, pickerValue);
        this.newEntry.start = newTime;
      }
    },
    pickerEndDate: {
      get() {
        return this.newEntry.end.substring(0, 10);
      },
      set(pickerValue) {
        let old = this.newEntry.end.substring(0, 10);
        var newDate = this.newEntry.end.replace(old, pickerValue);
        this.newEntry.end = newDate;
      }
    },
    pickerEndTime: {
      get() {
        return this.newEntry.end.substring(11, 16);
      },
      set(pickerValue) {
        let old = this.newEntry.end.substring(11, 16);
        var newTime = this.newEntry.end.replace(old, pickerValue);
        this.newEntry.end = newTime;
      }
    }
  }
};
</script>