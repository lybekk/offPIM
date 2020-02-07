<template>
  <v-container fluid>

    <v-row>
    <v-list two-line elevation="1">

      <v-list-item
        v-for="dateKey in ['start','end']"
        :key="dateKey"
        elevation="1"
      >
        <v-list-item-action>
          <v-dialog
            ref="dateDialog"
            v-model="dateModal[dateKey]"
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon small color="primary" v-on="on">
                <v-icon>mdi-calendar</v-icon>
              </v-btn>
            </template>
            <v-date-picker 
              v-if="dateKey == 'due'"
              v-model="dateDue"
              @input="dateModal[dateKey] = false"
            ></v-date-picker>
            <v-date-picker 
              v-else-if="dateKey == 'start'"
              v-model="dateStart"
              @input="dateModal[dateKey] = false"
            ></v-date-picker>
            <v-date-picker 
              v-else-if="dateKey == 'end'"
              v-model="dateEnd"
              @input="dateModal[dateKey] = false"
            ></v-date-picker>
          </v-dialog>
        </v-list-item-action>

        <v-list-item-action>
          <v-dialog
            ref="timeDialog"
            v-model="timeModal[dateKey]"
            width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon small color="primary" v-on="on">
                <v-icon >mdi-clock</v-icon>
              </v-btn>
            </template>

            <v-time-picker 
              v-model="timePicker[dateKey]"
              format="24hr"
              @change="setTime(dateKey)"
            ></v-time-picker>
          </v-dialog>
        </v-list-item-action>
        
        <v-list-item-content>
          <v-list-item-title 
            class="text-capitalize"
            v-text="dateKey" 
          >
          </v-list-item-title>
          <v-list-item-subtitle 
            v-if="dateKey == 'due'"
            :class="[ isOverdue ? 'error--text font-weight-bold' : '' ]"
            v-text="dateTime(dateKey)"
          >
          </v-list-item-subtitle>
          <v-list-item-subtitle 
            v-else
            v-text="dateTime(dateKey)"
          >
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
                <v-btn
                  icon
                  small
                  color="primary"
                  title="Clear date"
                  @click="clearLogDate(dateKey)"
                >
                  <v-icon >mdi-close</v-icon>
                </v-btn>
        </v-list-item-action>

      </v-list-item>

    </v-list>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'LogbookItemsDates',
  components: {
  },
  props: ["log"],
  data: () => ({
    dateModal: {
      due: false,
      start: false,
      end: false
    },
    timeModal: {
      due: false,
      start: false,
      end: false
    },
    timePicker: {
      due: null,
      start: null,
      end: null
    }
  }),
  computed: {
    dateStart: {
      get () {
        return this.dateFormatter(this.log.start, 'dateOnlyDefaultTodayISO')
      },
      set (pickerValue) {
        let payload = { _id:this.log._id, key:'start', value: pickerValue };
        this.$store.commit('setLogDate', payload);
      }
    },
    dateEnd: {
      get () {
        return this.dateFormatter(this.log.end, 'dateOnlyDefaultTodayISO')
      },
      set (pickerValue) {
        let payload = { _id:this.log._id, key:'end', value: pickerValue };
        this.$store.commit('setLogDate', payload);
      }
    },
  },
  methods: {
    clearLogDate: function(dateKey) {
      let payload = { _id:this.log._id, key: dateKey };
      this.$store.commit('clearLogDate', payload);
    },
    setTime: function(dateKey) {
      let payload = { _id:this.log._id, key: dateKey, value: this.timePicker[dateKey] };
      this.$store.commit('setLogTime', payload);

      this.timeModal[dateKey] = false;
    },
    dateTime: function(dateKey) {
      return this.dateFormatter(this.log[dateKey], 'UTC')
    },
    dateFormatter: function(dateString, returnType) {
      let valid = false;

      let d = new Date(dateString);
      if (dateString != null) {
        if (d instanceof Date && !isNaN(d)) {
          valid = true
        }
      }

      if (returnType == 'UTC') {
        if (valid == true) {
          return d.toUTCString()
        } else {
          return '-'
        }
      }

      if (returnType == 'dateOnlyDefaultTodayISO') {
        if (valid == true) {
          return dateString.slice(0, 10)
        } else {
          let d2 = new Date();
          return d2.toISOString().slice(0,10)
        }
      }

      if (returnType == 'timeOnlyDefaultTodayISO') {
        if (valid == true) {
          return dateString.slice(11, 16)
        } else {
          let d2 = new Date();
          return d2.toISOString().slice(11,16)
        }
      }

      return false;
    }
  }
};

</script>
