<template lang="pug">
v-expansion-panel(
  :disabled='isDeleted'
)
  v-expansion-panel-header
    template(v-slot:default='{ open }')
      v-row(no-gutters)
        v-col(cols='4') Due
        v-col.text--secondary(cols='8')
          v-fade-transition(leave-absolute)
            span(v-if='open')
              span.warning--text(v-if='task.postponed > 5')
                | Task postponed {{ task.postponed }} times.
            v-row(v-else='', no-gutters='', style='width: 100%')
              v-col(cols='6' v-text="headerDue")
              //- (TODO) Due in x days
  v-expansion-panel-content
    v-row(align='center', justify='center')                                  
      v-col(cols='12')
        v-container(fluid)
          v-row
          v-list(two-line elevation="1")
            v-list-item(
              v-for="dateKey in ['due','start','end']"
              :key="dateKey"
              elevation="1"
            )
              v-list-item-action
                v-dialog(
                  ref="dateDialog"
                  v-model="dateModal[dateKey]"
                  width="290px"
                )
                  template(v-slot:activator="{ on }")
                    v-btn(icon x-small color="primary" v-on="on")
                      v-icon mdi-calendar
                  v-date-picker(
                    v-if="dateKey == 'due'"
                    v-model="dateDue"
                    @input="dateModal[dateKey] = false"
                  )
                  v-date-picker(
                    v-else-if="dateKey == 'start'"
                    v-model="dateStart"
                    @input="dateModal[dateKey] = false"
                  )
                  v-date-picker(
                    v-else-if="dateKey == 'end'"
                    v-model="dateEnd"
                    @input="dateModal[dateKey] = false"
                  )
              v-list-item-action
                v-dialog(
                  ref="timeDialog"
                  v-model="timeModal[dateKey]"
                  width="290px"
                )
                  template(v-slot:activator="{ on }")
                    v-btn(icon x-small color="primary" v-on="on")
                      v-icon mdi-clock
                  v-time-picker(
                    v-model="timePicker[dateKey]"
                    format="24hr"
                    @change="setTime(dateKey)"
                  )
              v-list-item-content
                v-list-item-title(
                  class="text-capitalize"
                  v-text="dateKey" 
                )
                v-list-item-subtitle(
                  v-if="dateKey == 'due'"
                  :class="[ isOverdue ? 'error--text font-weight-bold' : '' ]"
                  v-text="dateTime(dateKey)"
                )
                v-list-item-subtitle(
                  v-else
                  v-text="dateTime(dateKey)"
                )
              v-list-item-action
                v-btn(
                  icon
                  x-small
                  color="primary"
                  title="Clear date"
                  @click="clearTaskDate(dateKey)"
                )
                  v-icon mdi-close
</template>

<script>

export default {
  name: 'TasksItemsDates',
  components: {
  },
  props: ["task","isOverdue","isDeleted"],
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
    headerDue: function () {
      const x = this.task.due;
      if (!x || x==null || x=='') {return 'No due date'}
      return x
    },
    dateDue: {
      get () {
        return this.dateFormatter(this.task.due, 'dateOnlyDefaultTodayISO')
      },
      set (pickerValue) {
        let payload = { _id:this.task._id, key:'due', value: pickerValue };
        this.$store.commit('setTaskDate', payload);
        this.$store.commit('addPostponed', this.task._id);
      }
    },
    dateStart: {
      get () {
        return this.dateFormatter(this.task.start, 'dateOnlyDefaultTodayISO')
      },
      set (pickerValue) {
        let payload = { _id:this.task._id, key:'start', value: pickerValue };
        this.$store.commit('setTaskDate', payload);
      }
    },
    dateEnd: {
      get () {
        return this.dateFormatter(this.task.end, 'dateOnlyDefaultTodayISO')
      },
      set (pickerValue) {
        let payload = { _id:this.task._id, key:'end', value: pickerValue };
        this.$store.commit('setTaskDate', payload);
      }
    },
  },
  methods: {
    clearTaskDate: function(dateKey) {
      let payload = { _id:this.task._id, key: dateKey };
      this.$store.commit('clearTaskDate', payload);
    },
    setTime: function(dateKey) {
      let payload = { _id:this.task._id, key: dateKey, value: this.timePicker[dateKey] };
      this.$store.commit('setTaskTime', payload);

      this.timeModal[dateKey] = false;
    },
    dateTime: function(dateKey) {
      return this.dateFormatter(this.task[dateKey], 'UTC')
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
