<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="密签类型">
          <select-opt v-model="signId" select-type="getsigntype"></select-opt>
        </form-item>
        <form-item label="部署信息">
          <el-input @keyup.enter.native="getTableData" v-model="signInfo" placeholder="请输入部署信息"></el-input>
        </form-item>
        <form-item label="操作人">
          <el-input @keyup.enter.native="getTableData" v-model="creator" placeholder="请输入操作人名称"></el-input>
        </form-item>
        <form-item label="创建时间">
          <el-date-picker
            v-model="createTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right">
          </el-date-picker>
        </form-item>
        <form-item label="下线时间">
          <el-date-picker
            v-model="offlinetTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right">
          </el-date-picker>
        </form-item>
        <form-item label="状态">
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </form-item>
        <div class="btn-box">
          <el-button size="small" type="primary" @click="getTableData">查询</el-button>
          <el-button size="small" @click="resetData">重置</el-button>
          <el-button size="small" @click="show">新建</el-button>
        </div>
      </div>
      <div class="page-main">
        <ListLayout>
          <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
            <el-table-column label="类型" prop="type"></el-table-column>
            <el-table-column label="部署目录" prop="data"></el-table-column>
            <el-table-column label="创建时间" prop="createTimeText"></el-table-column>
            <el-table-column label="下线时间" prop="offlineTimeText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button type="text" @click="goSignTrackDetail(scope.row)">详情</el-button>
                <el-button type="text" @click="signpolicydelete(scope.row)">撤销</el-button>
                <el-button type="text" v-if="scope.row.status===1" @click="download(scope.row)">下载</el-button>
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
    <CreatedSign @close="close" :visible.sync="dialogVisible" v-if="dialogVisible"></CreatedSign>
  </div>
</template>

<script>

import CreatedSign from '@/modules/created/CreatedSign'
import { probeSignatureStatusMap } from '@/lib/config'
import { formatTime } from '@/lib/util'
import env from '@/env.config.js'

export default {
  name: 'SignDetail',
  components: { CreatedSign },
  data() {
    return {
      dialogVisible: false,
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
      statusOptions: probeSignatureStatusMap,
      // 参数
      signId: '',
      signInfo: '',
      creator: '',
      status: null,
      createTime: '',
      offlinetTime: '',
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      loading: false,
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async download(item) {
      const ele = document.createElement('a')
      const base = env[window.__env__ || 'default'].VUE_APP_API_URL
      ele.href=`${base}/downloadapplicationsign?taskid=${item.taskId}`
      ele.target = '_blank'
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    },
    createSign() {
      this.visible = true
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        console.log(111)
        const {
          signId,
          signInfo,
          creator,
          status,
          createTime,
          offlinetTime,
        } = this

        const { agentId = '' } = this.$route.params

        const res = await this.$Server('/signpolicyselectagentid', 'POST', {
          agentId: agentId,
          signId,
          signInfo,
          creator,
          status,
          createStartTime: createTime ? (createTime[0] / 1000).toString() : '',
          createEndTime: createTime ? (createTime[1] / 1000).toString() : '',
          offlineStartTime: offlinetTime ? (offlinetTime[0] / 1000).toString() : '',
          offlineEndTime: offlinetTime ? (offlinetTime[1] / 1000).toString() : '',
          pageSize: this.PageSize,
          pageNum: this.PageNum
        })

        if (!res.data) return

        const { list, total } = res.data

        this.totalCount = total

        this.tableData = list.map(item => {
          return {
            ...item,
            createTimeText: formatTime(item.createTime),
            offlineTimeText: formatTime(item.offlineTime),
            statusText: this.statusOptions.find(p => {
              return p.value == item.status
            }).label,
          }
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async signpolicydelete(scope) {
      if (this.loading) return
      this.loading = true

      try {
        await this.$confirm('是否确认撤销', '提示', {
          type: 'warning',
          confirmButtonText: '撤销',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })

        const { taskId } = scope

        await this.$Server('/applicationsignpolicydelete', 'POST', {
          taskid: taskId
        })

        this.$message.success('撤销成功')

        this.loading = false

        this.getTableData()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    resetData() {
      this.signId = ''
      this.signInfo = ''
      this.creator = ''
      this.status = null
      this.createTime = ''
      this.offlinetTime = ''
    },
    goSignTrackDetail(scope) {
      const { tracecode } = scope
      this.$router.push({
        name: 'ProbesSignTrackDetail',
        params: {
          signTrackDetailId: tracecode
        }
      })
    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    close(isUpdate) {
      console.log('isUpdate', isUpdate)
      if (isUpdate) {this.getTableData()}
    }
  }
}
</script>

<style scoped>

</style>
