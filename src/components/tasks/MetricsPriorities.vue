<template lang="pug">
v-card(v-if="priorityOpenTasks.length")
    v-card-title By priority
    v-card-text
        v-list
            v-list-item(
                v-for="btn in priorityOpenTasks"
                :key="btn.pri"
                :to="`/tasks/list/priority${btn.pri}`"
                @click="prioritySheet = false"
            )
                v-list-item-avatar
                  v-tooltip(bottom)
                    template(v-slot:activator="{ on }")
                      v-icon(
                        v-on="on"
                        :color="priorityStarColor[btn.pri]"
                        ) mdi-star
                    span {{ btn.title }}
                v-list-item-content
                    //-v-badge(
                        :color="priorityStarColor[btn.pri]"
                        :content="priorityCount(btn.pri)"
                        inline
                      )
                    v-list-item-title
                      span.subtitle-1 {{ btn.pri }})
                        //-:class="`${priorityStarColor[btn.pri]}--text`"
                    v-list-item-subtitle
                v-list-item-icon
                  v-chip(
                    v-text="priorityCount(btn.pri)"
                    color="info"
                    small
                  )
                    //-:color="priorityStarColor[btn.pri]"
                        //-v-progress-linear(
                            :color="priorityStarColor[btn.pri]"
                            :value="priorityCount(btn.pri) * 100 / totalOpenTasks"
                            rounded
                          )
        //-div
          v-sparkline(
            :value="priorityValues"
            fill
            :gradient="[$vuetify.theme.themes.light.info.base]"
            height="100%"
            stroke-linecap="round"
            smooth="2"
            padding="2"
            type="bar"
            auto-line-width
            )
            //-color="info"
            template(v-slot:label="item") {{ item.value }}
            //-:line-width="lineWidth"
            //-:stroke-linecap="lineCap"
            //-:gradient-direction="gradientDirection"
            //-:fill="fill"
            //-:auto-line-width="autoLineWidth"
            //-auto-draw
            //-:show-labels="showLabels"
            //-:label-size="labelSize"
          //-div(class="text-center" )
            v-row
              v-col(
                v-for="btn in priorityOpenTasks"
                :key="btn.pri"
                cols="3"
              )
                v-btn(
                  block
                  outlined
                  color="secondary"
                  :to="`/tasks/list/priority${btn.pri}`"
                )
                  //-:color="priorityStarColor[btn.pri]"
                  v-icon(left :color="priorityStarColor[btn.pri]") mdi-star
                  span(v-text="btn.pri")
                  //-v-chip(
                      v-text="priorityCount(btn.pri)"
                      :color="priorityStarColor[btn.pri]"
                      small
                    )
                //-v-btn(
                  block
                  outlined
                  :color="priorityStarColor[btn.pri]"
                  )
                  v-icon(left :color="priorityStarColor[btn.pri]") mdi-star
                  span(v-text="btn.pri")

</template>

<script>
export default {
  name: "metricspriorities",
  data: () => ({
    priorityButtons: [
      { pri: 1, title: "Important & urgent" },
      { pri: 2, title: "Important, not urgent" },
      { pri: 3, title: "Not important, but urgent" },
      { pri: 4, title: "Not important & not urgent" }
    ],
    priorityStarColor: {
      1: "error",
      2: "warning",
      3: "primary",
      4: "secondary"
    }
  }),
  computed: {
    priorityOpenTasks() {
      const s = this.$store.getters.getTaskPriorities;
      return this.priorityButtons.filter(function(obj) {
        return s[obj.pri];
      });
    },
    /** TODO: Move to Vuex
     */
    totalOpenTasks() {
      const s = this.$store.getters.getTaskStatuses;
      let sum = s.wait + s.plan + s.todo + s.next + s.doing;
      return sum;
    },

    priorityValues() {
      return this.priorityOpenTasks.map(item => this.priorityCount(item.pri) )
    },
  },
  mounted() {
    const s = this.$store.getters.getTaskPriorities;
    let total = Object.values(s).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    if (!total) {
      this.$store.dispatch("getTaskPriorities");
    }

    setTimeout(() => {
      console.log(this.priorityOpenTasks)
      this.priorityOpenTasks.map(item => console.log( this.priorityCount(item.pri) ) )
      console.log(this.$vuetify.theme.themes.light.info.base)
    }, 1000);
  },
  methods: {
    priorityCount: function(priority) {
      let list = this.$store.getters.getTaskPriorities;
      return list[priority];
    }
  }
};
</script>