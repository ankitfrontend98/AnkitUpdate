<template>
  <apexchart type="line" :options="computedOptions" :series="series" />
</template>

<script>
import millify from "millify";

export default {

  props: {
    labels: {
      type: Array,
      required: true,
    },
    dataValues: {
      type: Array,
      required: true,
    },
    seriesName: {
      type: String,
      required: true,
    },
    darkMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Object,
      required: false
    },
    axisTitles: {
      type: Object,
      required: false,
      // default: () => { return { xaxis: '', yaxis: '', y2axis: '' } }
    }
  },
  mounted() {
    // Logging props to the console
    console.log("Labels:", this.labels);
    console.log("Data Values:", this.dataValues);
    console.log("Series Name:", this.seriesName);
    console.log("Dark Mode:", this.darkMode);
  },
  computed: {
    computedOptions() {
      return this.options && Object.keys(this.options).length > 0 ? { ...this.chartOptions, ...this.options } : this.chartOptions
    }
  },
  data() {
    return {
      series: this.dataValues,
      chartOptions: {
        chart: {
          type: "line",
          height: "100%",
          width: "100%",
          zoom: {
            enabled: true,
          },
          toolbar: {
            tools: {
              download: false,
              selection: false, // Disable the selection icon
              zoom: false, // Disable the zoom icon
              zoomin: true, // Enable the zoom-in icon
              zoomout: true, // Enable the zoom-out icon
              pan: false, // Disable the pan icon
              reset: false, // Disable the reset zoom icon
            },
            offsetY: -5,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 3,
          // curve: "smooth",
        },
        grid: {
          borderColor: this.darkMode ? "rgba(255, 255, 255, 0.20)" : "#EAECF0",
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        title: {
          text: this.seriesName,
          align: "center",
          style: {
            fontSize: "12px",
            fontWeight: "700",
            fontFamily: "Inter",
            color: this.darkMode ? "#FFF" : "#98A2B3",
          },
        },
        xaxis: {
          type: "decimal",
          categories: this.labels,
          tickAmount: 7,
          title: {
            text: this.axisTitles?.xaxis || '',
            style: {
              color: this.darkMode ? "#FFF" : "#98A2B3",
              fontWeight: "300",
            },
            // offsetY: 10,
          },
          labels: {
            style: {
              colors: this.darkMode ? "#FFF" : "#98A2B3",
              cssClass: "mr-2",
            },
            rotate: 0,
            hideOverlappingLabels: true,
            formatter: function (val) {
              const num = Number(val);
              return num.toString().length > 10 ? num.toExponential(6) : num;
            },

          },
        },
        yaxis: {
          opposite: false,
          title: {
            text: this.axisTitles?.yaxis || '',
            style: {
              color: this.darkMode ? "#FFF" : "#98A2B3",
              fontWeight: "300",
              fontSize: '12px'
            },
          },
          labels: {
            style: {
              colors: this.darkMode ? "#FFF" : "#98A2B3",
            },
            formatter: (value) => {
              return value > 1000 ? millify(value) : value.toFixed(2);
            },
          },
        },
        // fill: {
        //   type: "line",
        //   gradient: {
        //     shade: "light",
        //     type: "vertical",
        //     gradientToColors: ["#0D8ABC"],
        //     stops: [0, 82.46, 95.71],
        //     colorStops: [
        //       {
        //         offset: 0,
        //         color: "#73E8C9",
        //         opacity: 1,
        //       },
        //       {
        //         offset: 100,
        //         color: "#C1E6F3",
        //         opacity: 0.34,
        //       },
        //     ],
        //   },
        // },
        markers: {
          colors: ["#0D8ABC"],
        },
        tooltip: {
          theme: this.darkMode ? "dark" : "light",
          fillSeriesColor: false,
          marker: {
            show: false,
          },
          style: {
            fontSize: "14px",
            fontFamily: "poppins",
            fontWeight: "800",
            background: this.darkMode ? "#181a29" : "#ffffffb0",
          },
          fixed: {
            enabled: true,
            position: "topRight",
            offsetX: -150,
            offsetY: 0,
          },
        },
        legend: {
          labels: {
            colors: this.darkMode ? "#FFF" : "#98A2B3", // Set the color of the legend labels
            useSeriesColors: false, // Set to true if you want labels to match series colors
          },
          markers: {
            shape: "square", // Change the indicator shape to square
          },
          position: "top", // Place the legend at the top
          horizontalAlign: "center", // Align the legend horizontally to the right
          verticalAlign: "top", // Align the legend vertically to the top
          // offsetX: 400, // Adjust the legend's X-axis position to avoid overlap
          offsetY: -5
        }
      },
    };
  },
};
</script>
<style>
.apexcharts-tooltip.apexcharts-theme-light {
  background: #f3f3f3a4;
  color: #232b4c;
}

.apexcharts-tooltip.apexcharts-theme-light {
  background: #ffffffb0 !important;
}

.apexcharts-tooltip.apexcharts-theme-dark {
  background: #232b4c !important;
}

.apexcharts-tooltip.apexcharts-theme-dark {
  background: #181a29af !important;
}

.apexcharts-tooltip::before {
  /* Or ::after, depending on your inspection */
  border-bottom-color: red !important;
  /* Change to your desired color */
}
</style>
