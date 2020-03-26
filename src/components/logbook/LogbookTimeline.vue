<template>
  <v-timeline dense > 

    <v-slide-x-transition
      group
    >
    <v-timeline-item
      v-for="(log, i) in logs"
      :key="i"
      small
      :color="dot(log._id).color"
      :icon="dot(log._id).icon"
    >
      <v-row>
        <v-col cols="1">
          <p>
            <strong v-text="dateGet(log.start, 'year')"></strong>
            <br>
            <span 
              class="font-weight-light"
              v-text="dateGet(log.start, 'month')" 
            ></span>
            <span 
              class="font-weight-light"
              v-text="dateGet(log.start, 'day')" 
            ></span>
            <br>
            <strong class="font-italic font-weight-light" v-text="dateGet(log.start, 'weekday')"></strong>
            <br>
            <strong 
              class="overline"
              v-text="dateGet(log.start, 'time')" 
            ></strong>
            <br>
            <strong v-if="dot(log._id).deleted" class="error--text">Deleted</strong>
          </p>
        </v-col>
        <v-col>
          <v-card class="elevation-0">
            <v-card-title 
              class="headline" 
              v-text="log.title"
            >
            </v-card-title>
            <v-card-subtitle v-text="log.description"></v-card-subtitle>
            <v-card-text>
              <p> Category
                <span v-text="log.category"></span>
              </p>
              <p> ID
                <span v-text="log._id"></span>
              </p>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>Location</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    Work in progress
                    <LogbookItemsDates
                      v-bind:log="log"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <MainDeleteButton 
                v-bind:document-id="log._id"
              />

            </v-card-text>

          </v-card>

        </v-col>
      </v-row>
    </v-timeline-item>
    </v-slide-x-transition>

  </v-timeline>
</template>

<script>
import LogbookItemsDates from '@/components/logbook/LogbookItemsDates.vue'
import MainDeleteButton from '@/components/MainDeleteButton.vue'

export default {
  name: 'LogbookTimeline',
  components: {
    LogbookItemsDates,
    MainDeleteButton
  },
  props: ['logs'],
  data: () => ({
  }),
  computed: {
  },
  methods: {
    dateGet: function (dateObj, output) {
      const d = new Date(dateObj);
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      function suffix(day) {
        let x = 'th';
        if (day == 1) {x='st'}
        if (day == 2) {x='nd'}
        if (day == 3) {x='rd'}
        return x
      }
      let a = {
        year: d.getFullYear(),
        month: months[d.getMonth()],
        day: ' ' + d.getDate() + suffix( d.getDate() ),
        weekday: weekdays[d.getDay()],
        time: d.toISOString().slice(11,16)
      }
      return a[output]
    },
    dot: function (id) {
      let j = { color: 'primary', icon: null }
      let list = this.$store.getters.getDeletedDocuments
      if ( list.includes(id) ) {
        j.color = 'error'
        j.icon = 'mdi-delete'
        j.deleted = true
      }
      return j
    }
  }
};
</script>
