<template>
  <div class="results">
    <GChart type="BarChart" :data="barData" :options="barOptions"/>
  </div>
</template>

<script>
import Vue from "vue";

import { GChart } from "vue-google-charts";

export default {
  components: {
    GChart
  },
  props: {
    results: Array
  },
  computed: {
    barData() {
        // the first is the X,Y values - not used but needed by vue-cgoogle-charts
        let data = [["", ""]];
        this.results.forEach(result => {
            data.push([result.option.text, +(result.votes || 0)]);
        });
      return data;
    }
  },
  data() {
    return {
      barOptions: {
        // chart: {
        //   title: "Company Performance",
        //   subtitle: "Sales, Expenses, and Profit: 2014-2017"
        // },
        legend: { position: "none" },
        animation: {
          duration: 1000,
          easing: "out",
          startup: true
        },
        // bars: "horizontal", // Required for Material Bar Charts.
        // hAxis: { format: "decimal" },
        // height: 400,
        colors: ["#1b9e77"]
      }
    };
  },

  methods: {}
};
</script>

