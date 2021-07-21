<template>
  <div class="map-box" id="echartsMap"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/world'
import debounce from 'lodash/debounce'

const geoCoordMap = {
  '杭州': [120.13066322374, 30.240018034923],
  '尼日利亚': [-4.388361, 11.186148],
  '美国洛杉矶': [-118.24311, 34.052713],
  '香港邦泰': [114.195466, 22.282751],
  '美国芝加哥': [-87.801833, 41.870975],
  '加纳库马西': [-4.62829, 7.72415],
  '英国曼彻斯特': [-1.657222, 51.886863],
  '德国汉堡': [10.01959, 54.38474],
  '哈萨克斯坦阿拉木图': [45.326912, 41.101891],
  '俄罗斯伊尔库茨克': [89.116876, 67.757906],
  '巴西': [-48.678945, -10.493623],
  '埃及达米埃塔': [31.815593, 31.418032],
  '西班牙巴塞罗纳': [2.175129, 41.385064],
  '柬埔寨金边': [104.88659, 11.545469],
  '意大利米兰': [9.189948, 45.46623],
  '乌拉圭蒙得维的亚': [-56.162231, -34.901113],
  '莫桑比克马普托': [32.608571, -25.893473],
  '阿尔及利亚阿尔及尔': [3.054275, 36.753027],
  '阿联酋迪拜': [55.269441, 25.204514],
  '匈牙利布达佩斯': [17.108519, 48.179162],
  '澳大利亚悉尼': [150.993137, -33.675509],
  '美国加州': [-121.910642, 41.38028],
  '澳大利亚墨尔本': [144.999416, -37.781726],
  '墨西哥': [-99.094092, 19.365711],
  '加拿大温哥华': [-123.023921, 49.311753]
}
export default {
  name: 'Map',
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

      const $el = document.getElementById('echartsMap')

      this.myChart = echarts.init($el)

      this.setOption()
    },
    setOption() {
      const config = this.getConfig()

      if (!this.chartData.length && !this.myChart) return

      // 攻击点 [经度,纬度]
      const attacked = []

      // 攻击路线
      const attackLine = []

      // 被攻击点
      const beAttacked = [{
        name: '杭州',
        value: [120.13066322374, 30.240018034923]
      }]

      this.chartData.forEach(item => {
        item.value = 3000

        // 起点 [经度,纬度]
        const startPos = [item.longitude, item.latitude]

        // 终点 [经度,纬度]
        const endPos = [120.13066322374, 30.240018034923]

        attackLine.push([
          // 起点 [经度,纬度]
          { coord: startPos, value: item.value },
          // 终点
          { coord: endPos },
        ])

        attacked.push({
          name: `${ item.country }-${ item.province }`,
          // [经度，纬度，value]
          value: startPos.concat([item.value])
        })

      })

      // 攻击点
      config.series[0].data = attacked

      // 攻击路线
      config.series[1].data = attackLine

      // 被攻击点
      config.series[2].data = beAttacked

      this.myChart.setOption(config)
    },
    getConfig() {

      const series = [
        // 攻击点
        {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 5,
          rippleEffect: {
            //涟漪特效
            period: 4, //动画时间，值越小速度越快
            brushType: 'stroke', //波纹绘制方式 stroke, fill
            scale: 4 //波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: false,
              position: 'right', //显示位置
              offset: [5, 0], //偏移设置
              formatter: '{b}' //圆环显示文字
            },
            emphasis: {
              show: true
            }
          },
          symbol: 'circle',
          symbolSize: function (val) {
            console.log('val', val)
            return 4 + val[2] / 1000 // 圆环大小
          },
          itemStyle: {
            color: 'rgba(255, 100, 59, 1)'
          },
          data: []
        },
        // 攻击线路
        {
          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: 'arrow', //箭头图标
            symbolSize: 5 //图标大小
          },
          lineStyle: {
            color: 'rgba(255, 100, 59, 1)',
            width: 1, //尾迹线条宽度
            opacity: 0, //尾迹线条透明度
            curveness: 0.3 //尾迹线条曲直度
          },
          data: []
        },
        // 被攻击点
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          label: {
            normal: {
              show: true,
              position: 'right',
              color: '#00ffff',
              formatter: '{b}',
              textStyle: {
                color: '#00ffff'
              }
            },
            emphasis: {
              show: true
            }
          },
          symbol:
            'path://M17.673 0l17.455 7.493v11.35c0 2.6-.44 5.13-1.325 7.583a24.148 24.148 0 0 1-9.175 11.888 21.011 21.011 0 0 1-6.952 3.051 21.006 21.006 0 0 1-6.955-3.051 24.13 24.13 0 0 1-9.175-11.89A22.228 22.228 0 0 1 .22 18.84V7.496L17.676 0h-.003zm0 20.639V4.082L4.083 9.96v10.679h13.595v16.78a15.892 15.892 0 0 0 5.024-2.4 19.45 19.45 0 0 0 4.038-3.883 21.12 21.12 0 0 0 4.529-10.497H17.673z',
          symbolSize: [16, 20],
          itemStyle: {
            color: '#00ffff'
          },
          data: []
        }
      ]

      return {
        tooltip: {
          show: false,
          trigger: 'item',
          backgroundColor: '#1540a1',
          borderColor: '#FFFFCC',
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: 'z-index:100',
          formatter: function (params) {
            console.log('params', params)
            //根据业务自己拓展要显示的内容
            var res = ''
            var name = params.name
            var value = params.value[params.seriesIndex + 1]
            res =
              '<span style=\'color:#fff;\'>' +
              name +
              '</span><br/>数据：' +
              value
            return res
          }
        },
        geo: {
          map: 'world',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true, //是否允许缩放
          layoutCenter: ['50%', '50%'], //地图位置
          layoutSize: '180%',
          itemStyle: {
            normal: {
              color: '#04284e', //地图背景色
              borderColor: '#5bc1c9' //省市边界线
            },
            emphasis: {
              color: 'rgba(37, 43, 61, .5)' //悬浮背景
            }
          }
        },
        series: series
      }
    }
  }
}
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
}
</style>
