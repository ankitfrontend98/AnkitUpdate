<template>
  <apexchart type="line" :options="computedOptions" :series="series" />
</template>

<script>
import { formatDecimalNumber, removeTrailingZeros } from "@/utils/common";
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
    },
    axisTypes: {
      type: Object,
      required: false,
      default: () => { return { xaxis: 'numeric' } }
    },
    zoom: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted() {
    // Logging props to the console
    console.log("Labels:", this.labels);
    console.log("Data Values spline chart:", this.dataValues);
    console.log("Series Name:", this.seriesName);
    console.log("Dark Mode:", this.darkMode);
  },
  computed: {
    computedOptions() {
      return this.options && Object.keys(this.options).length > 0 ? { ...this.chartOptions, ...this.options } : this.chartOptions
    },
    computedSeries() {
      const temp = this.dataValues.map((seriesItem) => {
        return {
          ...seriesItem,
          data: this.labels.map((label, index) => {
            return {
              x: parseFloat(label) * 1e6, // Scale up small values
              y: seriesItem.data[index], // Use corresponding y values
            };
          }),
        };
      })
      console.log(temp)
      return temp
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
            enabled: this.zoom,
            allowMouseWheelZoom: false
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 300, // Adjust speed for smoother transitions
          },
          toolbar: {
            tools: {
              download: false,
              selection: false, // Disable the selection icon
              zoom: false, // Disable the zoom icon
              zoomin: this.zoom, // Enable the zoom-in icon
              zoomout: this.zoom, // Enable the zoom-out icon
              pan: true, // Disable the pan icon
              reset: false, // Disable the reset zoom icon
            },
            autoSelected: "pan",
            offsetY: -5,
          },
          events: {
            mouseWheelZoom: false, // Disables mouse scroll zoom
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
          type: this.axisTypes?.xaxis ?? "numeric",

          categories: this.labels.map(item => parseFloat(item) * 1e6),

          forceNiceScale: true,
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
            formatter: function (num) {
              const val = Number(num / 1e6);
              if (val < 1 && val !== 0) {
                return val.toExponential(3);
              }

              if (val >= 1) {
                return val.toString().length > 8 ? millify(val, { precision: 3 }) : val;
              }

              // Default case for 0
              return "0";
            },
            // formatter: function (val) {
            //   const num = Number(val / 1e6);
            //   return num.toString().length > 8 && num < 1 ? num.toExponential(3) : num;
            // },

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
              const val = removeTrailingZeros(value);
              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
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
        // markers: {
        //   colors: ["#0D8ABC"],
        // },
        tooltip: {
          theme: this.darkMode ? "dark" : "light", // Tooltip theme based on mode
          fillSeriesColor: false, // Prevent the tooltip background from using the series color
          marker: {
            show: true, // Show series color markers in the tooltip
          },
          style: {
            fontSize: "12px",
            fontFamily: "Poppins",
            fontWeight: "800",
          },
          fixed: {
            enabled: true, // Keep tooltip fixed
            position: "topRight",
            offsetX: -100,
            offsetY: 0,
          },
          y: {
            formatter: function (value, { seriesIndex, w }) {
              const color = w.config.colors[seriesIndex]; // Get the series color
              return `<span style="color: ${color};">${formatDecimalNumber(value, 3)}</span>`;
            },
          },
          x: this.axisTypes?.xaxis === 'numeric' ? {
            formatter: function (num) {
              const val = Number(num / 1e6);
              return val;
            },
          } : {},
        },

        // tooltip: {
        //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        //     const value = series[seriesIndex][dataPointIndex];
        //     const color = w.config.colors[seriesIndex];

        //     return `
        //       <div style="padding: 10px; color: #fff; background: ${color}; border-radius: 5px;">
        //         <strong>${w.globals.seriesNames[seriesIndex]}:</strong> ${value}
        //       </div>
        //     `;
        //   },
        // },
        // tooltip: {
        //   theme: this.darkMode ? "dark" : "light",
        //   fillSeriesColor: false,
        //   marker: {
        //     show: false,
        //   },
        //   style: {
        //     fontSize: "12px",
        //     fontFamily: "poppins",
        //     fontWeight: "800",
        //     background: this.darkMode ? "#181a29" : "#ffffffb0",
        //   },
        //   fixed: {
        //     enabled: true,
        //     position: "topRight",
        //     offsetX: -100,
        //     offsetY: 0,
        //   },
        // },
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
