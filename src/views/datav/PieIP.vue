<template>
  <div class="echarts-pie" id="echartsPie"></div>
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'

export default {
  name: 'Pie',
  props: {
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
    initChart() {
      if (this.init) {
        setTimeout(() => {
          this.myChart.resize()
        }, 0)

        return
      }

      this.init = true

      const $el = document.getElementById(this.el ? this.el : 'echartsPie')

      this.myChart = echarts.init($el)

      this.setOption()
    },
    setOption() {
      const config = this.getConfig()

      if (!this.chartData.length && !this.myChart) return

      const value = this.chartData.slice(0, 3).map(item => {
        return {
          value: parseInt(item.value),
          name: item.label
        }
      })

      config.series[0].data = value

      this.myChart.setOption(config)
    },
    getConfig() {
      const colorList = [
        {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: '#00C6FB' },
            { offset: 1, color: '#6AA4FF' }
          ],
          globalCoord: false
        },
        {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: '#FFBA4E' },
            { offset: 1, color: '#FFD86B' }
          ],
          globalCoord: false
        },
        {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: '#115AFA' },
            { offset: 1, color: '#115AFA' }
          ],
          globalCoord: false
        },
      ]
      const option = {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '饼图',
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '115.239.212.133' },
              { value: 310, name: '115.239.212.133' },
              { value: 274, name: '115.239.212.133' },
            ].sort(function (a, b) { return a.value - b.value }),
            roseType: 'radius',
            label: {
              color: '#FFFFFF'
            },
            labelLine: {
              lineStyle: {
                color: '#4DA8EC'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  console.log('params', params)
                  return colorList[params.dataIndex]
                }
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function () {
              return Math.random() * 200
            }
          }
        ]
      }
      return option
    },
    resize() {
      debounce(() => {
        console.log('resize')
        this.myChart.resize()
      }, 500)()
    },
  }
}
</script>

<style scoped>
.echarts-pie {
  width: 100%;
  height: 100%;
}
</style>
