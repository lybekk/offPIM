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
                            v-model="newEntry.sender.name"
                            label="Sender"
                            filled
                        )
                    v-col(cols="6")
                        v-text-field(
                            v-model="newEntry.recipient.name"
                            label="Recipient"
                            filled
                        )
                    v-col(cols="12")
                        v-text-field(
                            v-model="newEntry.messageAttachment.headline"
                            label="Subject"
                            autofocus
                            filled
                        )
                    v-col(cols="12")
                        v-textarea(
                            v-model="newEntry.messageAttachment.text"
                            label="Message body"
                            rows="3"
                            filled
                        )
                    v-col(cols="12")
                        v-combobox(
                            v-model="newEntry.keywords"
                            :items="tagsListItems"
                            label="Tags"
                            multiple
                            chips
                            filled
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
      "@type": "Message",
      sender: {
        name: ""
      },
      recipient: {
        name: ""
      },
      messageAttachment: {
        headline: "",
        text: "",
      },
      keywords: [],
      dateRead: null,
    }
  }),
  computed: {
    tagsListItems: function() {
      return ["work in progress"];
    },
    doc() {
      const doc = { ...this.newEntry };
      doc.dateSent = new Date().toISOString();
      return doc;
    }
  }
};
</script>