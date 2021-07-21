<template>
  <PageContent>
    <div slot="form" class="page-form">
      <form-item label="攻击类型">
        <select-opt v-model="honeyTypeId" select-type="gethoneypotstype"></select-opt>
      </form-item>
      <form-item label="攻击 IP">
        <el-input @keyup.enter.native="getTableData" v-model="attackIP" placeholder="请输入 IP"></el-input>
      </form-item>
      <form-item label="蜜罐 IP">
        <el-input @keyup.enter.native="getTableData" v-model="honeyIP" placeholder="请输入 蜜罐IP"></el-input>
      </form-item>
      <form-item label="攻击时间" class="last-from-item">
        <el-date-picker v-model="attackTimeValue"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="timestamp"
                        align="right">
        </el-date-picker>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="getTableData">查询</el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </div>
    </div>
    <div class="attack-body page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false" @expand-change="expandRow">
          <el-table-column type="expand">
            <template v-slot="{row}">
              <el-card style="margin:4px">
                <el-table :data="row.cityList" v-loading="row.cityLoading">
                  <el-table-column label="来源站点" prop="source_site"></el-table-column>
                  <el-table-column label="站点账户" prop="account"></el-table-column>
                  <el-table-column label="城市" prop="city"></el-table-column>
                  <el-table-column label="IP地址" prop="ip"></el-table-column>
                </el-table>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column label="攻击IP" prop="attackIP"></el-table-column>
          <el-table-column label="探针IP" prop="probeIp"></el-table-column>
          <el-table-column label="攻击跳转IP" prop="srcHost" show-overflow-tooltip></el-table-column>
          <el-table-column label="蜜罐IP" prop="honeyip"></el-table-column>
          <el-table-column label="被攻击服务" prop="honeyPotType"></el-table-column>
          <el-table-column label="攻击IP地理位置" prop="location"></el-table-column>
          <el-table-column label="攻击时间" prop="attackTimeText"></el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button type="text" @click="goDetail(scope.row)">详情</el-button>
            </div>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159"/>
          </div>
        </el-table>
        <Pagination
          slot="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :current-page.sync="currentPage">
        </Pagination>
      </ListLayout>
    </div>
  </PageContent>
</template>

<script>
import { formatTime } from '@/lib/util'
import SelectOpt from '@/components/SelectOpt'

export default {
  name: 'Attack',
  components: { SelectOpt },
  data() {
    return {
      // 时间
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      clusterValue: '',
      clusterOptions: [],
      attackTimeValue: '',
      attackIP: '',
      honeyTypeId: '',
      honeyIP: '',
      srcHost: '',
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
    }
  },
  created() {
    this.getTableData()
    this.gethoneyclusters()
  },
  methods: {
    async getTableData() {
      console.log(222)
      if (this.loading) return
      this.loading = true
      try {
        const { attackIP, honeyTypeId, honeyIP, srcHost, attackTimeValue, clusterValue } = this

        const res = await this.$Server('/attackLogList', 'POST', {
          'attackIP': attackIP,
          'honeyTypeId': honeyTypeId,
          'honeyIP': honeyIP,
          'srcHost': srcHost,
          servername: clusterValue,
          'startTime': attackTimeValue ? (attackTimeValue[0] / 1000).toString() : '',
          'endTime': attackTimeValue ? (attackTimeValue[1] / 1000).toString() : '',
          'pageSize': this.pageSize,
          'pageNum': this.currentPage
        })

        if (!res.data) {
          this.totalCount = 0
          this.tableData = []

          return
        }

        const { list, total } = res.data

        this.totalCount = total

        this.tableData = list.map((item) => {

          return Object.assign(item, {
            cityList: [],
            cityLoading: false,
            isLoadCityList: false,
            attackTimeText: formatTime(Number.parseInt(item.attackTime))
          })

        })
      } finally {
        this.loading = false
      }
    },
    async gethoneyclusters() {
      const res = await this.$Server('/gethoneyclusters', 'POST', {})

      if (!res.data) {
        return
      }

      const { list } = res.data

      this.clusterOptions = list.map((item) => {
        return {
          label: item.servername,
          value: item.serverid,
        }
      })
    },
    goDetail(item) {
      this.$router.push({
        name: 'AlarmDetails',
        params: {
          id: item.id
        }
      })
    },
    resetData() {
      this.attackTimeValue = ''
      this.attackIP = ''
      this.honeyTypeId = ''
      this.honeyIP = ''
      this.clusterValue = ''
    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },

    /**
     * table展开某一行
     */
    expandRow(row, isExpand) {
      if (row.isLoadCityList) {
        return false;
      }
      
      row.cityLoading = true;
      this.$Server(`/getAttackLog?ip=${row.attackIP}`, 'GET').then(res => {
        row.cityLoading = false;
        row.isLoadCityList = true;
        row.cityList = res.data;
        debugger
      }).catch(err => {
        row.cityLoading = false;
      });
      console.log(row, isExpand) 
    }
  }
}
</script>
