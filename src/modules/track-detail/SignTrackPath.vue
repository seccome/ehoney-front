<template>
  <PageContent>
    <div class="echarts-box">
      <div id="echartsTrack">加载中...</div>
    </div>
  </PageContent>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/world'
import debounce from 'lodash/debounce'

export default {
  name: 'SignTrackPath',
  data() {
    return {
      init: false,
      mapSourceData: null,
      mapData: [],
      pageType: '',
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const { signTrackDetailId, trackDetailId } = this.$route.params

        const { fullPath } = this.$route

        const url = fullPath.startsWith('/probes')
          ? '/getapplocationssignmsg'
          : '/gethoneysignmsg'

        const tracecode = fullPath.startsWith('/probes')
          ? signTrackDetailId
          : trackDetailId

        const res = await this.$Server(url, 'POST', {
          tracecode,
          map: 'true',
        })

        if (!res.data) {
          this.totalCount = 0
          this.tableData = []

          return
        }

        const { list } = res.data

        this.mapData = list

        if (this.myChart) {
          this.setOption()
        }

      } finally {
        this.loading = false
      }
    },
    initChart() {
      if (this.init) {
        setTimeout(() => {
          this.myChart.resize()
        }, 0)

        return
      }

      this.init = true

      const $el = document.getElementById('echartsTrack')

      this.myChart = echarts.init($el)

      this.setOption()
    },
    setOption() {
      const config = this.getConfig({
        type: 'world',
      })

      if (!this.mapData.length && !this.myChart) return

      const sourceData = this.mapData || []

      const sortSourceData = sourceData.sort((a, b) => {
        return b.opentime - a.opentime
      })

      const mapSourceData = []
      const mapLinesSourceData = []

      sortSourceData.forEach((item, index) => {
        if (sortSourceData.length !== index + 1) {
          mapLinesSourceData.push({
            coords: [
              [item.longitude, item.latitude],
              [sortSourceData[index + 1].longitude, sortSourceData[index + 1].latitude],
            ],
          })
        }
        mapSourceData.push({
          value: [item.longitude, item.latitude],
          sourceData: item,
        })
      })

      config.series[0].data = mapSourceData
      config.series[1].data = mapLinesSourceData

      this.myChart.setOption(config)
    },
    getConfig({ type, title, subtext }) {
      return {
        backgroundColor: '#051b4a',
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        title: {
          show: false,
          text: title,
          textStyle: {
            color: '#ddd',
          },
          subtext,
          subtextStyle: {
            color: '#aaaaaa',
          },
          left: '48%',
          top: 'auto',
        },
        grid: {
          width: '100%',
          height: '100%',
        },
        visualMap: {
          show: false,
        },
        tooltip: {
          trigger: 'item',
          formatter(value) {
            const data = value.data.sourceData
            console.log('data', data)
            if (!data) return

            return `国家/地区：${ data.ipcountry }<br/>经纬：${ data.longitude } - ${ data.latitude }<br/>打开ip：${
              data.openip
            }<br/>打开时间：${ new Date(Number(data.opentime)) }`
          },
        },
        geo: {
          map: type || 'china',
          roam: true, // 是否开启鼠标缩放和平移漫游
          aspectScale: 1,
          boundingCoords: [
            // 定位左上角经纬度
            [0, 90],
            // 定位右下角经纬度
            [180, -90],
          ],
          layoutCenter: ['50%', '50%'], // 地图位置
          layoutSize: '120%',
          center: [0, 20],
          scaleLimit: {
            min: 1,
            max: 8,
          },
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
              color: '#fff',
            },
          },
          itemStyle: {
            normal: {
              areaColor: 'rgba(165, 201, 243, .3)',
              borderColor: 'rgba(124,179,243, 1)',
              shadowColor: 'rgba(255, 255, 255, 1)',
            },
            emphasis: {
              areaColor: 'rgba(110, 230, 248, .5)',
            },
          },
        },
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: 5,
            showEffectOn: 'render',
            hoverAnimation: true,
            emphasis: {
              label: {
                formatter: '{b}',
                position: 'right',
                show: true,
              },
            },
            rippleEffect: {
              color: '#FFF200',
              scale: 2.5,
              brushType: 'stroke',
            },
            zlevel: 1,
          },
          {
            type: 'lines',
            symbol: ['none', 'arrow'],
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              color: '#fff',
              symbolSize: 3,
            },
            lineStyle: {
              color: '#FFF200',
              width: 1,
              opacity: 0.6,
              curveness: 0.2,
            },
          },
        ],
      }
    },
    resize() {
      debounce(() => {
        console.log('resize')
        this.myChart.resize()
      }, 300)()
    },
  }
}
</script>

<style scoped>
.echarts-box {
  width: 100%;
  height: 100%;

}

#echartsTrack {
  width: 100%;
  height: 100%;
}
</style>
