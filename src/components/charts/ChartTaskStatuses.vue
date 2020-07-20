<template>
  <canvas
    id="myChart"
    width="400"
    height="400"
  />
</template>

<script>
import Chart from "chart.js";

export default {
  name: 'Charttaskstatuses',
  data() {
    return {
      taskStatuses: ['wait','plan','todo','next','doing'],
    };
  },
  mounted() {
    this.myChart = new Chart(document.getElementById("myChart"), {
      type: "bar",
      data: {
        datasets: [
          {
            data: [],
            backgroundColor: [
              this.$vuetify.theme.themes.light.secondary,
              this.$vuetify.theme.themes.light.secondary,
              this.$vuetify.theme.themes.light.primary,
              this.$vuetify.theme.themes.light.warning,
              this.$vuetify.theme.themes.light.info,
            ],
          }
        ],
        labels: []
      },
      options: {
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
   this.fillTasksSparkline();
  },
  methods: {
    fillTasksSparkline: async function() {
      await this.$store.dispatch('getTaskStatuses');
      const ts = this.$store.getters.getTaskStatuses;
      console.log('TS result: ',ts);
      for (let x of this.taskStatuses) {
        let cap = x[0].toUpperCase() + x.substring(1)
        this.addData(this.myChart, cap, ts[x])
      }
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