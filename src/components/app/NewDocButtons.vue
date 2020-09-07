<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-fab-transition>
        <v-btn
          v-show="!$store.getters.buttonFormNewHidden"
          v-model="fab"
          dark
          color="secondary"
          fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <v-btn
      v-for="(btn, i) in buttons"
      :key="i"
      fab
      dark
      small
      color="secondary"
      class="new-doc-btn"
      :data-text="btn.text"
      @click="createDoc(btn.docType)"
    >
      <v-icon v-text="btn.icon" />
    </v-btn>
    <v-btn
      v-for="(btn, i) in buttonsLegacy"
      :key="i"
      fab
      dark
      small
      color="secondary"
      class="new-doc-btn"
      :data-text="btn.name"
      :to="{ name: btn.to, params: btn.params }"
    >
      <v-icon v-text="btn.icon" />
    </v-btn>
  </v-speed-dial>
</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";
import itemMixin from "@/mixins/itemMixin";
import newDocumentMixin from "@/mixins/newDocumentMixin";

export default {
  name: "NewDocButtons",
  mixins: [pouchMixin, itemMixin, newDocumentMixin],
  data: () => ({
    fab: false,
    buttons: [
      {
        text: 'Bookmark',
        docType: 'bookmark',
        icon: 'mdi-bookmark',
      },
      {
        text: 'Note',
        docType: 'note',
        icon: 'mdi-note',
      },
    ],
    buttonsLegacy: [
        {
            name: 'Task',
            to: 'formsNewTask',
            icon: 'mdi-check',
        },
        {
            name: 'Log',
            to: 'formsNewLog',
            icon: 'mdi-book',
        },
        {
            name: 'Message',
            to: 'formsNewMessage',
            icon: 'mdi-email',
        },
        {
            name: 'Contact',
            to: 'formsNewContact',
            icon: 'mdi-account',
        },
        {
            name: 'Finance',
            to: 'formsNewFinance',
            icon: 'mdi-cash',
        },
    ],
  }),
  methods: {
    createDoc: async function (type) {
      const base = {
        _id: this.generateUUID(),
        dateCreated: new Date().toISOString(),
      };
      const docTypes = {
        bookmark: {
          "@type": "webPage",
          name: '',
          url: null,
        },
        note: {
          title: "",
          description: "",
          tags: [],
          productivity: true,
          type: "note",
          priority: 4,
          status: "plan",
          project: null,
          due: null,
          end: null,
          context: null,
          //created: "2020-08-22T16:55:14.263Z", Old model
          start: new Date().toISOString(),
        },
      };

      const newDoc = {
        ...base,
        ...docTypes[type],
      };
      await this.putDoc(newDoc);
      this.viewDocument(newDoc._id);
    },
  },
};
</script>

<style scoped>
.new-doc-btn::after {
  content: attr(data-text);
  position: absolute;
  background-color: teal;
  color: white;
  right: 3.4rem;
  z-index: 1001;
  padding: 0.4rem;
  border-radius: 10%;
  box-shadow: 2px 2px 8px white;
  font-weight: bold;
}
</style>
