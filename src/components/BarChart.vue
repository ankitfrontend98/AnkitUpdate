<template>
  <apexchart
      type="bar"
      :options="chartOptions"
      :series="series"
    ></apexchart> 
</template>

<script>
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
              toolbar: {
                tools: {
                  download: false,
                }
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
              show: false,
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
              categories: this.labels,
              tickAmount: 10,
              labels: {
                style: {
                  colors: this.darkMode ? '#FFF' : '#98A2B3',
                }
              }
            },
            yaxis: {
              labels: {
                style: {
                  colors: this.darkMode ? '#FFF' : '#98A2B3',
                },
                formatter: function (value) {
                  return value > 1000 ? millify(value) : value.toFixed(2);
                }
              }
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
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
              }
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
  </style>
