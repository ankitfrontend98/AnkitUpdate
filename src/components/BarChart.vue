<template>
  <apexchart class="bar-chart" type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import { formatDecimalNumber, removeTrailingZeros } from "@/utils/common";
import millify from "millify";

export default {
  props: {
    labels: {
      type: Array,
      required: true
    },
    dataValues: {
      type: Array,
      required: true
    },
    seriesName: {
      type: Array,
      required: true
    },
    darkMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          zoom: {
            enabled: true, // Enable zoom
            allowMouseWheelZoom: false
          },
          pan: {
            enabled: true, // Enable panning
            mode: "x" // Pan in the x-direction
          },
          events: {
            mouseLeave: () => {
              document.body.style.cursor = "default"; // Reset cursor on leave
            },
            mouseMove: () => {
              document.body.style.cursor = "move"; // Reset cursor on leave
            }
          },
          toolbar: {
            tools: {
              pan: true, // Disable the pan icon
              download: false, // Disable the download icon
              selection: false, // Disable the selection icon
              zoom: false, // Disable the zoom icon
              zoomin: true, // Enable the zoom-in icon
              zoomout: true, // Enable the zoom-out icon
              reset: false, // Disable the reset zoom icon
            },
            autoSelected: "pan",
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        colors: this.darkMode ? ['rgba(191, 172, 98, 1)', '#F4F4F5'] : ['rgba(191, 172, 98, 1)', 'rgba(15, 35, 87, 1)'],
        grid: {
          borderColor: this.darkMode ? "rgba(255, 255, 255, 0.20)" : "#EAECF0",
          show: true,
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: this.darkMode ? 1 : 0,
          colors: this.darkMode ? ['#DCC271', '#98A2B3'] : []

        },
        xaxis: {
          type: 'datetime',
          categories: this.labels,
          tickAmount: 10,
          labels: {
            style: {
              colors: this.darkMode ? '#FFF' : '#98A2B3',
            }
          }
        },
        yaxis: {
          opposite: true,

          labels: {
            style: {
              colors: this.darkMode ? '#FFF' : '#98A2B3',
            },
            formatter: function (value) {
              const val = removeTrailingZeros(value);
              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          labels: {
            colors: this.darkMode ? '#FFF' : '#98A2B3',
          },
        },
        tooltip: {
          theme: this.darkMode ? 'dark' : 'light', // Use pre-defined themes (dark, light),
          fillSeriesColor: false,
          marker: {
            show: false,
          },
          style: {
            fontSize: '14px',
            fontFamily: 'poppins',
            fontWeight: '800',
            background: this.darkMode ? '#181a29' : '' // Custom background color
          },
          fixed: {
            enabled: true,
            position: 'topRight',
            offsetX: -250,
            offsetY: 0,
          },
          y: {
            formatter: function (value, { seriesIndex, w }) {
              const color = w.config.colors[seriesIndex]; // Get the series color
              return `<span style="color: ${color};">${value}</span>`;
            },
          },
        },
      },
      series: [{
        name: this.seriesName[0],
        data: this.dataValues[0]
      }, {
        name: this.seriesName[1],
        data: this.dataValues[1]
      },],
    }
  }
}
//
</script>
<style>
.apexcharts-tooltip.apexcharts-theme-light {
  background: #f3f3f3;
  color: #232b4c;
}

.apexcharts-tooltip.apexcharts-theme-dark {
  background: #232b4c !important;
}

.apexcharts-tooltip.apexcharts-theme-dark {
  background: #181a29 !important;
}

/* .bar-chart .apexcharts-toolbar {
  display: none !important;
} */
</style>
