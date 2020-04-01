<template lang="pug">
    canvas(id="ChartTasksToday" width="400" height="400")
</template>

<script>
import Chart from "chart.js";

export default {
  name: 'ChartTasksToday',
  components: {
    //LineChart
  },
  data() {
    return {
      //taskStatuses: ['wait','plan','todo','next','doing'],
    };
  },
  mounted() {
    //this.$store.getters.getTasksAggregate.doneToday
    this.ChartTasksToday = new Chart(document.getElementById("ChartTasksToday"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            //data: [10, 20, 30]
            //label: null,
            data: [],
            backgroundColor: [
              this.$vuetify.theme.themes.light.error,
              this.$vuetify.theme.themes.light.warning,
              this.$vuetify.theme.themes.light.success,
              /*
              this.$vuetify.theme.themes.light.warning,
              this.$vuetify.theme.themes.light.info,
              */
            ],
            //borderColor: 'transparent',
            borderWidth: 2,
            borderColor: this.$vuetify.theme.themes.light.info,
          }
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        //labels: ["Red", "Yellow", "Blue"]
        labels: []
      }
    });
    /*
    setTimeout(() => {
        this.myChart.data.labels.push('shitt');
            this.myChart.update();
    }, 2000);
    */
   //this.$store.getters.getTasksAggregate.doneToday
   this.fillData();
  },
  methods: {
    fillData: async function() {
      //await this.$store.dispatch('getTaskStatuses');
      //const ts = this.$store.getters.getTaskStatuses;
      await this.$store.dispatch('tasksDueAggregation');
      console.log('Does it needd a return value??')
      let x = this.$store.getters.getTasksAggregate;
      this.addData( this.ChartTasksToday, 'Overdue', x.overdue );
      this.addData( this.ChartTasksToday, 'Todos Today', x.today );
      this.addData( this.ChartTasksToday, 'Done Today', x.doneToday );
      //this.$store.getters.getTasksAggregate.doneToday
      //for (let x of this.taskStatuses) {
        //this.tasksStatuSparklineValues.push( ts[x] )
        //let cap = x[0].toUpperCase() + x.substring(1)
        //this.addData(this.myChart, cap, ts[x])
      //}
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