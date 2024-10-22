<template>
  <apexchart
      type="area"
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
      seriesName : {
          type: String,
          required: true
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
      }
  },

  data() {  
    return {
      series: [{
          name: this.seriesName,
          data: this.dataValues,
      }],
      chartOptions: {
        chart: {
          type: 'area',
          height: '100%',
          width: '100%',
          zoom: {
            enabled: false
          },
          toolbar: {
            tools: {
              download: false,
            }
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
          align: 'right',
          style: {
            fontSize:  '12px',
            fontWeight:  '700',
            fontFamily:  'Inter',
            color:  this.darkMode ? '#FFF' : '#98A2B3'
          },
        },
        xaxis: {
            type: 'date',
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
                if(this.showExponentialDigit) {
                  if(-Math.floor(Math.log10(value) + 1) >= 3 ) {
                    return value.toExponential(2);
                  } else if(value > 1000) {
                    return millify(value);
                  } else {
                    return value.toFixed(6);
                  }
                }
                return value > 1000 ? millify(value) : value.toFixed(2);
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
          colors: [this.mapColors.stroke] ,
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
            position: 'topRight',
            offsetX: -150,
            offsetY: -150,
          }
        },
        
      },
    }
  },
}
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
  background: #181a2988 !important;
}
.apexcharts-tooltip::before { /* Or ::after, depending on your inspection */
   border-bottom-color: red !important; /* Change to your desired color */
 }
</style>
