<template lang="pug">
    canvas(id="myChart" width="400" height="400")
</template>

<script>
import Chart from "chart.js";

//import LineChart from './LineChart.js'

export default {
  name: 'charttaskstatuses',
  components: {
    //LineChart
  },
  data() {
    return {
      taskStatuses: ['wait','plan','todo','next','doing'],
    };
  },
  mounted() {
    this.myChart = new Chart(document.getElementById("myChart"), {
      //type: "pie",
      type: "bar",
      data: {
        datasets: [
          {
            //data: [10, 20, 30]
            //label: false,
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
        // These labels appear in the legend and in the tooltips when hovering different arcs
        //labels: ["Red", "Yellow", "Blue"]
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
            //type: 'logarithmic',
          }]
        },
        /*
        title: {
          display: true,
          text: 'Statuses'
        },
        */
        legend: {
          display: false
        }
      }
    });
    /*
    setTimeout(() => {
        this.myChart.data.labels.push('shitt');
            this.myChart.update();
    }, 2000);
    */
   this.fillTasksSparkline();
  },
  methods: {
    fillTasksSparkline: async function() {
      await this.$store.dispatch('getTaskStatuses');
      const ts = this.$store.getters.getTaskStatuses;
      console.log('TS result: ',ts);
      for (let x of this.taskStatuses) {
        //this.tasksStatuSparklineValues.push( ts[x] )
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