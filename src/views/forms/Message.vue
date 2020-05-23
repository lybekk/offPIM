<template lang="pug">
  v-container
    v-card(flat)
        v-card-title
            v-spacer
            submit-button(:doc="doc")
        v-card-text
            v-container
                v-row
                    v-col(cols="6")
                        v-text-field(
                            v-model="newEntry.sender"
                            label="Sender"
                            dense
                        )
                    v-col(cols="6")
                        v-text-field(
                            v-model="newEntry.recipient"
                            label="Recipient"
                            dense
                        )
                    v-col(cols="12")
                        v-text-field(
                            v-model="newEntry.subject"
                            label="Subject"
                            autofocus
                            dense
                        )
                    v-col(cols="12")
                        v-textarea(
                            v-model="newEntry.body"
                            label="Message body"
                            rows="3"
                            filled
                            dense
                        )
                    v-col(cols="12")
                        v-combobox(
                            v-model="newEntry.tags"
                            :items="tagsListItems"
                            label="Tags"
                            multiple
                            chips
                            dense
                        )

</template>

<script>
import SubmitButton from "@/components/form/submit";

export default {
  name: "formsNewMessage",
  components: {
    SubmitButton
  },
  data: () => ({
    dialog: false,
    newEntry: {
      message: true,
      sender: "",
      recipient: "",
      subject: "",
      body: "",
      tags: [],
      read: false
    }
  }),
  computed: {
    tagsListItems: function() {
      return ["work in progress"];
    },
    doc() {
      const doc = { ...this.newEntry };
      doc.created = new Date().toISOString();
      return doc;
    }
  }
};
</script>