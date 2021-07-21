<template>
  <PageContent class="signTrackDetail" :no-padding="false">
    <div slot="form" class="page-form">
      <form-item label="打开时间">
        <el-date-picker
          v-model="timeValue"
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
        <el-button size="small">重置</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="追踪码" prop="tracecode"></el-table-column>
          <el-table-column label="追踪文件名称" prop="signfilename"></el-table-column>
          <el-table-column label="密签打开ip" prop="openip"></el-table-column>
          <el-table-column label="ip归属国家" prop="ipcountry"></el-table-column>
          <el-table-column label="ip归属城市" prop="ipcity"></el-table-column>
          <el-table-column label="打开时间" prop="opentimeText"></el-table-column>
          <el-table-column label="设备指纹" prop="useragent"></el-table-column>
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
// import { formatTime } from '@/lib/util'
import moment from 'moment'
export default {
  name: 'SignTrackDetail',
  data() {
    return {
      // 创建时间
      timeValue: '',
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
  },
  methods: {
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const { timeValue } = this
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
          map: 'false',
          starttime: timeValue[0],
          endtime: timeValue[1],
          'pageSize': this.pageSize,
          'pageNum': this.currentPage
        })

        console.log('列表', res)
        if (!res.data) {
          this.totalCount = 0
          this.tableData = []

          return
        }

        const { list, total } = res.data

        this.totalCount = total

        this.tableData = list.map((item) => {
          return {
            ...item,
            opentimeText: moment(item.opentime * 1000).format(
             'YYYY-MM-DD HH:mm:ss'
            )
          }
        })
      } finally {
        this.loading = false
      }
    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },
  }
}
</script>

<style scoped lang="less">

</style>
