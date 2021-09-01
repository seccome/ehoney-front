<template>
  <div class="echarts-pie2" id="echartsPie2"></div>
</template>

<script>
import echarts from 'echarts'
import debounce from 'lodash/debounce'

export default {
  name: 'PieArea',
  data() {
    return {
      init: false
    }
  },
  props: {
    chartData: {
      type: Array,
      default: () => [],
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

      const $el = document.getElementById('echartsPie2')

      this.myChart = echarts.init($el)

      this.setOption()
    },
    getConfig() {
      const colorList = [
        {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: '#115AFA' },
            { offset: 1, color: '#115AFA' }
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
            { offset: 0, color: '#00C6FB' },
            { offset: 1, color: '#6AA4FF' }
          ],
          globalCoord: false
        },
      ]
      console.log('colorList', colorList)
      const option = {
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          y: 'center',
          icon: 'circle',
          itemWidth: 4,
          itemHeight: 4,
          itemGap: 20,
          textStyle: {
            color: '#FFF',
            fontSize: 12
          }
        },
        series: [
          {
            name: '攻击地区IP TOP',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                color: '#FFF'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '北京' },
              { value: 310, name: '上海' },
              { value: 234, name: '天津' },
              { value: 135, name: '南京' },
              { value: 1548, name: '杭州' }
            ]
          }
        ]
      }
      return option
    },
    setOption() {
      const config = this.getConfig()

      if (!this.chartData.length && !this.myChart) return

      const colorList = [
        'rgba(130, 204, 255, 1)',
        'rgba(255, 186, 78, 1)',
        'rgba(17, 90, 250, 1)',
        'rgba(127, 91, 255, 1)',
        'rgba(255, 146, 71, 1)',
        'rgba(135, 250, 193, 1)'
      ]

      const value = this.chartData.slice(0, 3).map((item, i) => {
        return {
          value: item.areacount,
          name: item.province,
          itemStyle: {
            color: colorList[i]
          }
        }
      })
      config.series[0].data = value

      this.myChart.setOption(config)
    },
  }
}
</script>

<style scoped>
.echarts-pie2 {
  width: 100%;
  height: 100%;
}
</style>

