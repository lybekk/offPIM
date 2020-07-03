<template lang="pug">
    v-row
      v-col(cols="7")
        v-menu(
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        )
          template(v-slot:activator="{ on }")
            v-text-field(
              v-model="date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              dense 
              hide-details="auto"
              v-on="on"
            )
              //-:label="fieldName.toUpperCase()"
          v-date-picker(v-model="date" @input="dateMenu = false")
      v-col(cols="3")
        v-menu(
          ref="menu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        )
          template(v-slot:activator="{ on }")
            v-text-field(
              v-model="time"
              label="Time"
              dense 
              hide-details="auto"
              readonly
              v-on="on"
            )
          v-time-picker(
            v-if="timeMenu"
            v-model="time"
            full-width
            format="24hr"
            @change="setTime(newTime)"
          )
      v-col(cols="2")
        v-btn(
          icon
          color="primary"
          title="Clear date"
          @click="clearTaskDate"
        )
          v-icon mdi-close

</template>

<script>
import pouchMixin from "@/mixins/pouchMixin";

export default {
  name: "formDatetime",
  components: {},
  mixins: [pouchMixin],
  props: ["doc", "fieldName"],
  data: () => ({
    dateMenu: false,
    timeMenu: false,
    newTime: null,
  }),
  computed: {
    date: {
      get() {
        return this.dateFormatter(
          this.doc[this.fieldName],
          "dateOnlyDefaultTodayISO"
        );
      },
      set(pickerValue) {
        let payload = {
          _id: this.doc._id,
          field: this.fieldName,
          value: pickerValue,
        };
        this.setDate(payload);
      },
    },
    time: {
      get() {
        return this.dateFormatter(
          this.doc[this.fieldName],
          "timeOnlyDefaultTodayISO"
        );
      },
      set(val) {
        this.newTime = val;
      },
    },
  },
  methods: {
    clearTaskDate: async function() {
      await this.setFieldNull({
        _id: this.doc._id,
        field: this.fieldName,
      });
      this.$emit("set-doc");
    },
    setDate: async function(payload) {
      await this.setFieldDate(payload);
      this.$store.commit("addPostponed", payload._id);
      this.$emit("set-doc");
    },
    setTime: async function(time) {
      let payload = { _id: this.doc._id, field: this.fieldName, value: time };
      await this.setFieldTime(payload);
      this.timeMenu = false;
      this.$emit("set-doc");
    },
    dateFormatter: function(dateString, returnType) {
      let valid = false;

      let d = new Date(dateString);
      if (dateString != null) {
        if (d instanceof Date && !isNaN(d)) {
          valid = true;
        }
      }

      if (returnType == "dateOnlyDefaultTodayISO") {
        if (valid == true) {
          return dateString.slice(0, 10);
        } else {
          return null;
        }
      }

      if (returnType == "timeOnlyDefaultTodayISO") {
        if (valid == true) {
          return dateString.slice(11, 16);
        } else {
          return null;
        }
      }

      return valid;
    },
  },
};
</script>
