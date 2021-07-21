<template>
  <PageContent>
    <div slot="form" class="page-form">
      <form-item label="攻击 IP">
        <el-input @keyup.enter.native="getTableData" v-model="attackIP" placeholder="请输入攻击 IP"></el-input>
      </form-item>
      <form-item label="攻击跳转IP">
        <el-input @keyup.enter.native="getTableData" v-model.number="srcHost" placeholder="请输入攻击源 IP"></el-input>
      </form-item>
      <form-item label="攻击端口">
        <el-input @keyup.enter.native="getTableData" v-model.number="srcPort" placeholder="请输入攻击源端口"></el-input>
      </form-item>
      <form-item label="密罐类型">
        <select-opt v-model="honeyTypeId" select-type="gethoneypotstype"></select-opt>
      </form-item>
      <form-item label="蜜罐 IP">
        <el-input @keyup.enter.native="getTableData" v-model="honeyIP" placeholder="请输入蜜罐 IP"></el-input>
      </form-item>
      <form-item label="蜜罐端口">
        <el-input @keyup.enter.native="getTableData" v-model.number="honeyPotPort" placeholder="请输入服务端口"></el-input>
      </form-item>
      <form-item label="攻击时间">
        <el-date-picker
          v-model="attackTimeValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          align="right">
        </el-date-picker>
      </form-item>
      <form-item label="事件">
        <el-input @keyup.enter.native="getTableData" v-model="eventDetail" placeholder="请输入事件描述"></el-input>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="getTableData">查询</el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="攻击跳转IP" prop="srcHost"></el-table-column>
          <el-table-column label="攻击端口" prop="srcPort"></el-table-column>
          <el-table-column label="攻击 IP" prop="attackIP"></el-table-column>
          <el-table-column label="蜜罐类型" prop="honeyPotType"></el-table-column>
          <el-table-column label="蜜罐 IP" prop="honeyip"></el-table-column>
          <el-table-column label="蜜罐端口" prop="honeyPotPort"></el-table-column>
          <el-table-column label="攻击时间" prop="attackTimeText"></el-table-column>
          <el-table-column label="事件" prop="eventDetail" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button type="text" @click="goDetail(scope.row.logData)">详情</el-button>
            </div>
          </el-table-column>
          <!--<el-table-column label="操作">-->
          <!--  <el-button type="text">详情</el-button>-->
          <!--  <el-button type="text">撤销</el-button>-->
          <!--</el-table-column>-->
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
    <el-dialog
      title="详情"
      :visible.sync="detailDialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-press-escape="false"
      :close-on-click-modal="false">
      <el-table
      :data="eventTable"
      style="width: 100%">
        <el-table-column
          prop="key"
          label="key">
        </el-table-column>
        <el-table-column
          prop="value"
          label="value">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </PageContent>
</template>

<script>

import { formatTime } from '@/lib/util'

export default {
  name: 'AttackDetails',
  data() {
    return {
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
      attackTimeValue: '',
      attackIP: '',
      honeyTypeId: '',
      honeyIP: '',
      honeyPotPort: null,
      srcPort: null,
      srcHost: '',
      eventDetail: '',
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      detailDialogVisible: false,
      eventTable: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleClose() {
      this.detailDialogVisible = false
    },
    goDetail(info) {
      this.detailDialogVisible = true
      this.eventTable = this.formatData(info)
    },
    formatData(data) {
      const result = []
      try{
        const origin = data
        Object.keys(origin).forEach(key => {
          result.push({key, value: origin[key]})
        })
        return result
      }
      catch(e) {
        console.log(e)
      }
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      const {
        attackIP, honeyTypeId, honeyIP, srcHost, srcPort, attackTimeValue, honeyPotPort,
        eventDetail
      } = this
      const { id } = this.$route.params
      try {
        const res = await this.$Server('/attackLogDetail', 'POST', {
          id: Number.parseInt(id) || '',
          attackIP,
          honeyTypeId,
          honeyIP,
          honeyPotPort: honeyPotPort || null,
          srcPort,
          srcHost,
          eventDetail,
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
          return {
            attackTimeText: formatTime(item.attackTime),
            ...item
          }
        })
      } finally {
        this.loading = false
      }
    },
    resetData() {
      this.attackTimeValue = ''
      this.attackIP = ''
      this.honeyTypeId = ''
      this.honeyIP = ''
      this.honeyPotPort = null
      this.srcPort = null
      this.srcHost = ''
      this.eventDetail = ''
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

<style scoped>

</style>
