<template>
  <div class="histogram-type" id="histogramType"></div>
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'

export default {
  name: 'HistogramType',
  props: {
    el: {
      type: String,
      default: '',
    },
    chartData: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      init: false
    }
  },
  watch: {
    chartData() {
      if (this.myChart) {
        this.setOption()
      }
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      debounce(() => {
        console.log('resize')
        this.myChart.resize()
      }, 500)()
    },
    initChart() {
      if (this.init) {
        setTimeout(() => {
          this.myChart.resize()
        }, 0)

        return
      }

      this.init = true

      const $el = document.getElementById(this.el ? this.el : 'histogramType')

      this.myChart = echarts.init($el)

      this.setOption()

    },
    getConfig() {
      const option = {
        // backgroundColor: '#010d3a',

        grid: {
          top: '50px',
          left: 0,
          right: 0,
          bottom: '60px',
          containLabel: false
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: 'none',
          axisTick: 'none',
          offset: 20,
          axisLabel: {
            fontSize: 12,
            color: '#fff',
          }
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              console.log('api', api)
              const location = api.coord([api.value(0), api.value(1)])
              console.log('location', location)
              return {
                type: 'group',
                children: [{
                  type: 'CubeLeft',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(7,29,97,.6)'
                  }
                }, {
                  type: 'CubeRight',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(10,35,108,.7)'
                  }
                }, {
                  type: 'CubeTop',
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0])
                  },
                  style: {
                    fill: 'rgba(11,42,106,.8)'
                  }
                }]
              }
            },
            data: []
          },
          {
            type: 'custom',
            renderItem: (params, api) => {
              const location = api.coord([api.value(0), api.value(1)])
              return {
                type: 'group',
                children: [
                  {
                    type: 'CubeLeft',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#3B80E2'
                        },
                        {
                          offset: 1,
                          color: '#49BEE5'
                        }
                      ])
                    }
                  },
                  {
                    type: 'CubeRight',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#3B80E2'
                        },
                        {
                          offset: 1,
                          color: '#49BEE5'
                        }
                      ])
                    }
                  },
                  {
                    type: 'CubeTop',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0])
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: '#3B80E2'
                        },
                        {
                          offset: 1,
                          color: '#49BEE5'
                        }
                      ])
                    }
                  }]
              }
            },
            data: []
          },
        ]
      }
      return option
    },
    setOption() {
      const config = this.getConfig()

      if (!this.chartData.length && !this.myChart) return

      const label = this.chartData.map(item => item.label)
      const value = this.chartData.map(item => item.value)
      const maxData = this.chartData.map(item => item.max)

      config.xAxis.data = label
      config.series[0].data = maxData
      config.series[1].data = value

      this.myChart.setOption(config)
    },
  }
}
</script>

<style scoped>
.histogram-type {
  /*width: 100%;*/
  height: 100%;
}
</style>
