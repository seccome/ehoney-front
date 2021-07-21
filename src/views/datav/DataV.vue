<template>
  <div class="datav">
    <div class="currentTime">{{ currentTime }}</div>
    <div class="goControl" @click="goControl"><i class="esign-icon-daping"></i>进入控制台</div>
    <DataScreen>
      <div class="data-main">
        <div class="data-main-l">
          <div class="main-l-card-a">
            <DataCard title="攻击IP TOP">
              <div class="histogram-box">
                <Histogram :chartData="topattackips" el="echartsHistogram1"></Histogram>
              </div>
              <div class="pie-box">
                <Pie :chartData="topattackips"></Pie>
              </div>
            </DataCard>
          </div>
          <div class="main-l-card-b">
            <DataCard title="攻击IP地区 TOP">
              <PieArea :chart-data="topareas"></PieArea>
            </DataCard>
          </div>
        </div>
        <div class="data-main-m">
          <div class="main-l-card-a">
            <!--<div class="attack">-->
            <!--  <div class="attack-title">当前攻击总数</div>-->
            <!--  <div class="attack-num">345241224</div>-->
            <!--</div>-->
            <Map :chartData="topattackmap"></Map>
          </div>
          <div class="main-l-card-b">
            <DataCard is-very>
              <el-table :data="tableData" class="datav-table"
                        width="80%" height="100%" :border="false">
                <el-table-column label="密罐类型" prop="honeyPotType"></el-table-column>
                <el-table-column label="集群" prop="honeyip"></el-table-column>
                <el-table-column label="攻击IP" prop="attackIP"></el-table-column>
                <el-table-column label="地理位置" prop="location"></el-table-column>
                <el-table-column label="攻击时间" prop="attackTimeText"></el-table-column>
              </el-table>
            </DataCard>
          </div>
        </div>
        <div class="data-main-r">
          <div class="main-l-card-a main-r-card-a">
            <DataCard title="业务入口 TOP">
              <Histogram :chartData="topsourceips" el="echartsHistogram2"></Histogram>
            </DataCard>
          </div>
          <div class="main-l-card-b main-r-card-b">
            <DataCard title="攻击类型 TOP">
              <HistogramType :chartData="topattacktypes"></HistogramType>
            </DataCard>
          </div>
        </div>
      </div>
    </DataScreen>
  </div>
</template>

<script>
import DataScreen from '@/views/datav/DataScreen'
import Map from '@/views/datav/Map'
import DataCard from '@/views/datav/DataCard'
import Histogram from '@/views/datav/Histogram'
import Pie from '@/views/datav/PieIP'
import PieArea from '@/views/datav/PieArea'
import HistogramType from '@/views/datav/HistogramType'
import { formatTime } from '@/lib/util'

export default {
  name: 'DataV',
  components: { HistogramType, PieArea, Pie, Histogram, DataScreen, DataCard, Map },
  data() {
    return {
      currentTime: formatTime(new Date().getTime() / 1000, 'yyyy-MM-dd hh:mm:ss'),
      timer: null,
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      loading: false,
      topattackips: [],
      topsourceips: [],
      attackLogList: [],
      topattacktypes: [],
      topattackmap: [],
      topareas: [],
    }
  },
  created() {
    this.getDatav()

    this.timer = setInterval(() => {
      this.currentTime = formatTime(new Date().getTime() / 1000, 'yyyy-MM-dd hh:mm:ss')
    }, 1000)
  },
  methods: {
    getDatav() {
      this.gettopattackips()

      this.gettopsourceips()

      this.getattackLogList()

      this.gettopareas()

      this.gettopattacktypes()

      this.gettopattackmap()
    },
    // 攻击ip top
    async gettopattackips() {
      const res = await this.$Server('/gettopsourceips', 'POST', {})
      console.log('攻击ip top', res)

      const { list } = res.data
      this.topattackips = list.map(item => {
        return {
          max: 30,
          value: item.ipcount,
          label: item.srchost,
          percent: item.ipcount + '%'
        }
      })
    },
    // 攻击源top
    async gettopsourceips() {
      const res = await this.$Server('/gettopsourceips', 'POST', {})

      const { list } = res.data

      this.topsourceips = list.map(item => {
        return {
          max: 100,
          value: item.ipcount,
          label: item.srchost,
          percent: item.ipcount + '%'
        }
      })

      console.log('攻击源top', res)
    },
    // 攻击日志
    async getattackLogList() {
      if (this.loading) return
      this.loading = true

      try {
        const res = await this.$Server('/attackLogList', 'POST', {
          'pageSize': 5,
          'pageNum': 1
        })

        if (!res.data) {
          this.totalCount = 0
          this.tableData = []

          return
        }

        const { list, total } = res.data

        this.totalCount = total

        this.tableData = list.map((item) => {
          return {
            attackTimeText: formatTime(Number.parseInt(item.attackTime)),
            ...item
          }
        })

      } catch (e) {console.log(e)} finally {
        this.loading = false
      }
    },
    // 攻击地区
    async gettopareas() {
      try {
        const res = await this.$Server('/gettopareas', 'POST', {
          'pageSize': 5,
          'pageNum': 1
        })

        console.log('攻击地区', res)

        const { list } = res.data

        this.topareas = list.map((item) => {
          return {
            attackTimeText: formatTime(item.attackTime / 1000),
            ...item
          }
        })

      } catch (e) {console.log(e)}
    },
    // 攻击类型
    async gettopattacktypes() {
      try {
        const res = await this.$Server('/gettopattacktypes', 'POST', {
          'pageSize': 5,
          'pageNum': 1
        })

        console.log('攻击类型', res)

        const { list, total } = res.data

        this.topattacktypes = list.map((item) => {
          return {
            max: total,
            value: item.typecount,
            label: item.attacktype,
            ...item
          }
        })

      } catch (e) {console.log(e)}
    },
    // 地图
    async gettopattackmap() {
      try {
        const res = await this.$Server('/gettopattackmap', 'POST')

        console.log('攻击地图', res)

        const { list } = res.data

        this.topattackmap = list.map((item) => {
          return {
            ...item
          }
        })

      } catch (e) {console.log(e)}
    },
    goControl() {
      this.$router.push({
        name: 'HoneypotList'
      })
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style scoped lang="less">
.datav {
  width: 100%;
  height: 100%;
  //min-height: 1080px;
  overflow-y: scroll;
  background-color: #040E21;
  color: #F5F6F8;
  position: relative;

  .currentTime {
    z-index: 100;
    position: absolute;
    top: 64px;
    left: 97px;
    font-size: 18px;
    line-height: 25px;
    color: #D2F7FF;
  }

  .goControl {
    z-index: 100;
    user-select: none;
    cursor: pointer;
    position: absolute;
    top: 64px;
    right: 97px;
    line-height: 25px;
    height: 25px;
    font-size: 18px;
    color: rgba(210, 247, 255, 1);

    &:hover {
      color: #ffffff;
    }

    .esign-icon-daping {
      margin-right: 6px;
    }
  }

  .data-main {
    display: flex;
    padding: 120px 0px 50px 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .data-main-l, .data-main-r {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex: 0 0 18%;
      height: 100%;
    }

    .data-main-l {
      margin-left: 80px;
    }

    .data-main-r {
      margin-right: 80px;
    }

    .data-main-m {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      flex: 1;
      height: 100%;
      margin: 0px 42px;
    }

    .main-l-card-a {
      width: 100%;
      height: 60%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .attack {
        flex: 0 0 64px;

        .attack-title {
          font-size: 20px;
          color: #FFFFFF;
        }

        .attack-num {
          display: inline-block;
          margin-top: 14px;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: 3px;
          color: transparent;
          background: linear-gradient(138deg, #60F9FF 0%, #448DFF 100%);
          -webkit-background-clip: text;
        }
      }

      .map-box {
        flex: 1;
      }

      .histogram-box {
        height: 60%;
        width: 100%;
      }

      .pie-box {
        height: 40%;
        width: 100%;
      }
    }

    .main-l-card-b {
      margin-top: 30px;
      width: 100%;
      height: 40%;
    }

    .main-r-card-a {
      height: 40%;
    }

    .main-r-card-b {
      height: 60%;
    }
  }

  .datav-table {
    width: 95%;
    margin: 0 auto;
    background: none;

    &::before {
      background: none;
    }

    /deep/ .el-table__header-wrapper {
      th, tr {
        background: none;
      }

      th {
        padding-bottom: 18px;
        font-size: 17px;
        line-height: 24px;
        text-align: center;
        color: #AFDEFF;
        font-weight: 600;
        border-bottom: 1px solid rgba(130, 204, 255, 0.5);
      }
    }

    /deep/ .el-table__body-wrapper {
      td, tr {
        background: none;
      }

      td {
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #ffffff;
        border-bottom: 1px solid rgba(130, 204, 255, 0.15);
      }
    }
  }
}
</style>
