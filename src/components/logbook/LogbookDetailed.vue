<template lang="pug">
    v-bottom-sheet(
        v-model="dialogItemDetailed"
        :inset="$vuetify.breakpoint.mdAndUp"
        scrollable
    )
        v-card
            v-card-text
                v-container
                    v-row
                        v-col
                            v-text-field(
                                :value="doc.name"
                                label="Title"
                                class="title"
                                filled
                                hide-details
                                @change="setDocField('name',$event)"
                            )
                        v-col(cols="12")
                            v-textarea(
                                :value="doc.description"
                                rows="2"
                                hide-details
                                filled
                                auto-grow
                                label="Notes/Description"
                                @change="setDocField('description',$event)"
                            )
                        v-col
                            v-text-field(
                                :value="doc.category"
                                label="Category"
                                class="subtitle-1"
                                filled
                                hide-details
                                @change="setDocField('category',$event)"
                            )
                        v-col(cols="12")
                            v-combobox(
                                :value="doc.keywords"
                                label="Tags/labels/keywords"
                                hide-details
                                filled
                                multiple
                                chips
                                deletable-chips
                                @change="setDocField('keywords',$event)"
                            )
                        v-col(cols="12")
                            v-tabs(fixed-tabs)
                                v-tab Start
                                v-tab End
                                v-tab-item(v-for="key in ['startDate','endDate']")
                                    v-card
                                        v-card-text
                                            v-row
                                                v-col(cols="12" sm="6")
                                                    v-date-picker(
                                                        :value="getDateOnly(doc[key])"
                                                        :show-current="false"
                                                        full-width
                                                        @change="setDate(key, $event)"
                                                    )
                                                v-col(cols="12" sm="6")
                                                    v-time-picker(
                                                        :value="getTimeOnly(doc[key])"
                                                        format="24hr"
                                                        full-width
                                                        @change="setTime(key, $event)"
                                                    )
                    v-row
                        v-col
                            p(v-text="doc._id")
                        v-col
                            MainDeleteButton(v-bind:document-id="doc._id")

</template>

<script>
import MainDeleteButton from "@/components/MainDeleteButton.vue";
import pouchMixin from "@/mixins/pouchMixin";
import itemDetailedMixin from "@/mixins/itemDetailedMixin";

export default {
  name: "LogbookDetailed",
  mixins: [pouchMixin, itemDetailedMixin],
  components: {
    MainDeleteButton
  },
  computed: {},
  methods: {
    hideNote: function() {
      this.$store.commit("dialogItemDetailedHide");
    },

    archiveNote: async function() {
      let doc = await this.getDoc(this.selectedNote._id);
      doc.status = "done";
      doc.end = new Date().toISOString();
      doc.archived = true;
      await this.putDoc(doc);
      this.$store.dispatch("refreshDoc", this.selectedNote._id);
      this.hideNote();
    },

    deleteNote: function() {
      let x = confirm("Delete note?");
      if (x) {
        this.deleteDoc(this.selectedNote._id);
        this.hideNote();
      }
    }
  }
};
</script>