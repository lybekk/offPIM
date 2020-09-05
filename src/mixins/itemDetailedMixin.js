export default {
  computed: {

    doc() {
      return this.$store.getters.selectedDoc;
    },

    dialogItemDetailed: {
      get: function () {
        return this.$store.getters.dialogItemDetailed;
      },
      set: function (val) {
        const mutation = val
          ? "dialogItemDetailedShow"
          : "dialogItemDetailedHide";
        this.$store.commit(mutation, "dialogItemDetailed");
      }
    },

    startDate() {
      const d = this.doc.startDate;
      if (d) {
        return new Date(d).toISOString().substr(0, 10);
      } else {
        return null;
      }
    },

    startTime() {
      const d = this.doc.startDate;
      if (d) {
        return new Date(d).toISOString().slice(11, 16);
      } else {
        return null;
      }
    },

    endDate() {
      const d = this.doc.endDate;
      if (d) {
        return new Date(d).toISOString().substr(0, 10);
      } else {
        return null;
      }
    },

  },
  methods: {

    getDateOnly: function (value) {
      //const d = this.doc[key];
      if (value) {
        return new Date(value).toISOString().substr(0, 10);
      } else {
        return null;
      }
    },

    getTimeOnly: function (value) {
      if (value) {
        return new Date(value).toISOString().slice(11, 16);
      } else {
        return null;
      }
    },

    setDate: async function (key, value) {
      let freshDoc = await this.getDoc(this.doc._id);

      let newDate = new Date(value);
      let currentDate = new Date(freshDoc[key]);

      currentDate.setFullYear(newDate.getFullYear());
      currentDate.setMonth(newDate.getMonth());
      currentDate.setDate(newDate.getDate());

      this.setDocField(key, currentDate.toISOString());
    },

    setTime: async function (key, value) {
      let freshDoc = await this.getDoc(this.doc._id);
      let currentDate = new Date(freshDoc[key]);

      const timeHour = value.split(":");
      currentDate.setUTCHours(timeHour[0]);
      currentDate.setMinutes(timeHour[1]);

      this.setDocField(key, currentDate.toISOString());
    },

    /**
     * Generic doc property setter. If statement necessary for document viewer reactivity.
     * @param {*} key 
     * @param {*} value 
     */
    setDocField: async function (key, value) {
      let id = this.doc._id;
      let freshDoc = await this.getDoc(id);
      freshDoc[key] = value;
      await this.putDoc(freshDoc);
      this.$store.dispatch("refreshDoc", id);
      if (this.$store.getters.dialogDocumentViewer) {
        this.$store.commit("setSelectedDoc", freshDoc);
      }
    },
  }
};
