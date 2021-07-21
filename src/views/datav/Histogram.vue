<template>
  <div class="Histogram" :id="el ? el :'echartsHistogram'"></div>
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'

export default {
  name: 'Histogram',
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
    const CubeLeft = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint
        const c0 = [shape.x, shape.y]
        const c1 = [shape.x - 9, shape.y - 9]
        const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9]
        const c3 = [xAxisPoint[0], xAxisPoint[1]]
        ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
      }
    })
    const CubeRight = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0
      },
      buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint
        const c1 = [shape.x, shape.y]
        const c2 = [xAxisPoint[0], xAxisPoint[1]]
        const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9]
        const c4 = [shape.x + 18, shape.y - 9]
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
      }
    })
    const CubeTop = echarts.graphic.extendShape({
      shape: {
        x: 0,
        y: 0
      },
      buildPath: function (ctx, shape) {
        const c1 = [shape.x, shape.y]
        const c2 = [shape.x + 18, shape.y - 9]
        const c3 = [shape.x + 9, shape.y - 18]
        const c4 = [shape.x - 9, shape.y - 9]
        ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
      }
    })
    echarts.graphic.registerShape('CubeLeft', CubeLeft)
    echarts.graphic.registerShape('CubeRight', CubeRight)
    echarts.graphic.registerShape('CubeTop', CubeTop)

    this.initChart()

    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      debounce(() => {
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

      const $el = document.getElementById(this.el ? this.el : 'echartsHistogram')

      this.myChart = echarts.init($el)

      this.setOption()

    },
    setOption() {
      const config = this.getConfig()

      if (!this.chartData.length && !this.myChart) return

      const percent = this.chartData.map(item => item.percent)
      const label = this.chartData.map(item => item.label)
      const value = this.chartData.map(item => item.value)
      const maxData = this.chartData.map(item => item.max)

      config.yAxis[1].data = percent
      config.yAxis[2].data = label
      config.series[0].data = value
      config.series[1].data = maxData

      this.myChart.setOption(config)
    },
    getConfig() {
      const option = {
        // backgroundColor: '#000',
        tooltip: {
          show: false,
          backgroundColor: 'rgba(3,169,244, 0.5)', //背景颜色（此时为默认色）
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          top: '30px',
          left: '0',
          right: '35px',
          bottom: '0',
          containLabel: false
        },
        xAxis: {
          type: 'value',
          show: false,
        },
        yAxis: [
          {
            name: '进度条',
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            axisLabel: false
          },
          {
            name: '百分比',
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            data: ['10%', '30%', '30%', '30%', '30%']
          },
          {
            name: 'IP 名称',
            type: 'category',
            position: 'left',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            offset: -10,
            axisLabel: {
              interval: 0,
              color: ['#fff'],
              align: 'left',
              verticalAlign: 'bottom',
              lineHeight: 20,
              fontSize: 12,
              padding: [0, 0, 7, 0],
            },
            data: [],
          },
        ],
        series: [
          {
            name: '',
            type: 'bar',
            zlevel: 1,
            barWidth: 8,
            itemStyle: {
              normal: {
                barBorderRadius: 8,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                  offset: 0,
                  color: 'rgb(57,89,255,1)'
                }, {
                  offset: 1,
                  color: 'rgb(46,200,207,1)'
                }]),
              },
            },
            data: [],
          },
          {
            name: '背景',
            type: 'bar',
            barWidth: 8,
            barGap: '-100%',
            itemStyle: {
              normal: {
                color: 'rgba(17, 90, 249, 0.26)',
                barBorderRadius: 8,
              }
            },
            data: [],
          },
        ]
      }
      return option
    },
  }
}
</script>

<style scoped>
.Histogram {
  width: 100%;
  height: 100%;

}
</style>
