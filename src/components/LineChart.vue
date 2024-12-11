<template>
  <apexchart type="area" :options="computedOptions" :series="series"></apexchart>
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
      type: String,
      required: true
    },
    seriesData: {
      type: Array,
      required: false
    },
    chartWidth: {
      type: Number,
      required: false,
      default: 370,
    },
    darkMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    mapColors: {
      type: Object,
      required: true,
    },
    showExponentialDigit: {
      type: Boolean,
      required: false,
      default: false,
    },
    options: {
      type: Object,
      required: false
    }
  },
  computed: {
    computedOptions() {
      return this.options && Object.keys(this.options).length > 0 ? { ...this.chartOptions, ...this.options } : this.chartOptions
    }
  },
  data() {
    return {
      series: this.seriesData && this.seriesData.length > 0 ? this.seriesData : [{
        name: this.seriesName,
        data: this.dataValues,
      }],
      chartOptions: {
        chart: {
          type: 'area',
          height: '100%',
          width: '100%',
          zoom: {
            enabled: true
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 3,
          colors: [this.mapColors.stroke],
          curve: 'smooth'
        },
        grid: {
          borderColor: this.darkMode ? 'rgba(255, 255, 255, 0.20)' : '#EAECF0',
          yaxis: {
            lines: {
              show: true
            },
          },
          column: {
            opacity: 10
          }
        },
        title: {
          text: this.seriesName,
          align: 'left',
          style: {
            fontSize: '12px',
            fontWeight: '700',
            fontFamily: 'Inter',
            color: this.darkMode ? '#FFF' : '#98A2B3'
          },
        },
        xaxis: {
          type: 'datetime',
          categories: this.labels,
          tickAmount: 10,
          labels: {
            style: {
              colors: this.darkMode ? '#FFF' : '#98A2B3',
              cssClass: 'mr-2',
            },
            hideOverlappingLabels: true,
          }
        },
        yaxis: {
          opposite: false,
          labels: {
            style: {
              colors: this.darkMode ? '#FFF' : '#98A2B3',
            },
            formatter: (value) => {
              const val = removeTrailingZeros(value);
              if (this.showExponentialDigit) {
                if (val != 0 && -Math.floor(Math.log10(val) + 1) >= 3) {
                  return val.toExponential(2);
                } else if (val > 1000) {
                  return millify(val);
                } else {
                  return formatDecimalNumber(val, 5);
                }
              }

              return val > 500 ? millify(val) : formatDecimalNumber(val, 2);
            }
          }
        },

        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical', // Use 'horizontal' or 'vertical' to control the direction
            gradientToColors: [this.mapColors.gradientToColors],
            stops: [0, 82.46, 95.71],
            colorStops: [
              {
                offset: 0,
                color: this.mapColors.offset,
                opacity: 1
              },
              {
                offset: 100,
                color: this.mapColors.offsetColor,
                opacity: 0.34
              },
            ]
          }
        },
        markers: {
          colors: [this.mapColors.stroke],
        },
        tooltip: {
          theme: this.darkMode ? 'dark' : 'light', // Use pre-defined themes (dark, light),
          fillSeriesColor: false,
          marker: {
            show: false,
          },
          style: {
            fontSize: '12px',
            fontFamily: 'poppins',
            fontWeight: '800',
            background: this.darkMode ? '#181a29' : '' // Custom background color
          },
          fixed: {
            enabled: true,
            position: 'topRight',
            offsetX: -100,
            offsetY: 0,
          }
        },

      },
    }
  },
}
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

.apexcharts-pan-icon {
  display: none !important;
}
</style>
