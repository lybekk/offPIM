<template lang="pug">
    canvas(id="ChartTasksToday" width="400" height="400")
</template>

<script>
import Chart from "chart.js";

export default {
  name: 'ChartTasksToday',
  data() {
    return {
    };
  },
  mounted() {
    this.ChartTasksToday = new Chart(document.getElementById("ChartTasksToday"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              this.$vuetify.theme.themes.light.error.base,
              this.$vuetify.theme.themes.light.warning.base,
              this.$vuetify.theme.themes.light.success.base,
            ],
            borderWidth: 2,
          }
        ],
        labels: []
      }
    });
   this.fillData();
  },
  methods: {
    fillData: async function() {
      await this.$store.dispatch('tasksDueAggregation');
      console.log('Does it needd a return value??')
      let x = this.$store.getters.getTasksAggregate;
      this.addData( this.ChartTasksToday, 'Overdue', x.overdue );
      this.addData( this.ChartTasksToday, 'Todos Today', x.today );
      this.addData( this.ChartTasksToday, 'Done Today', x.doneToday );
    },
    addData: function(chart, label, data) {
      chart.data.labels.push(label);
      chart.data.datasets.forEach(dataset => {
        dataset.data.push(data);
      });
      chart.update();
    },
    removeData: function(chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach(dataset => {
        dataset.data.pop();
      });
      chart.update();
    }
  }
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>