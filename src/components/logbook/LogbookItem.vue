<template>
  <v-timeline-item small :color="dot(doc._id).color" :icon="dot(doc._id).icon">
    <v-row>
      <v-col cols="1">
        <p>
          <strong v-text="dateGet(doc.startDate, 'year')"></strong>
          <br />
          <span class="font-weight-light" v-text="dateGet(doc.startDate, 'month')"></span>
          <span class="font-weight-light" v-text="dateGet(doc.startDate, 'day')"></span>
          <br />
          <strong class="font-italic font-weight-light" v-text="dateGet(doc.startDate, 'weekday')"></strong>
          <br />
          <strong class="overline" v-text="dateGet(doc.startDate, 'time')"></strong>
          <br />
          <strong v-if="dot(doc._id).deleted" class="error--text">Deleted</strong>
        </p>
      </v-col>
      <v-col>
        <v-card class="elevation-0" @click="showItemDetailed">
          <v-card-title class="headline" v-text="doc.name"></v-card-title>
          <v-card-subtitle v-text="doc.description"></v-card-subtitle>
          <v-card-text>
            <p v-if="doc.category" class="subtitle-1" v-text="doc.category"></p>
            <div v-show="doc.keywords.length">
              <!-- text-center removed -->
              <v-chip v-for="keyword in doc.keywords" :key="keyword" class="ma-2">{{ keyword }}</v-chip>
            </div>
            <p>
              ID
              <span v-text="doc._id"></span>
            </p>
            <!-- 
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>Location</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      Work in progress
                      <LogbookItemsDates v-bind:log="log" />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
            -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-timeline-item>
</template>

<script>
import itemMixin from "@/mixins/itemMixin";

export default {
  name: "LogbookTimeline",
  components: {
  },
  mixins: [itemMixin],
  props: ["doc"],
  data: () => ({}),
  computed: {},
  methods: {
    dateGet: function(dateObj, output) {
      if (!dateObj) {
        return null;
      }
      const d = new Date(dateObj);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      function suffix(day) {
        let x = "th";
        if (day == 1) {
          x = "st";
        }
        if (day == 2) {
          x = "nd";
        }
        if (day == 3) {
          x = "rd";
        }
        return x;
      }
      let a = {
        year: d.getFullYear(),
        month: months[d.getMonth()],
        day: " " + d.getDate() + suffix(d.getDate()),
        weekday: weekdays[d.getDay()],
        time: d ? d.toISOString().slice(11, 16) : "08:08"
      };
      return a[output];
    },

    dot: function(id) {
      let j = { color: "primary", icon: null };
      let list = this.$store.getters.getDeletedDocuments;
      if (list.includes(id)) {
        j.color = "error";
        j.icon = "mdi-delete";
        j.deleted = true;
      }
      return j;
    }
  }
};
</script>
