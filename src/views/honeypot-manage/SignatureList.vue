<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="密签类型">
          <select-opt v-model="signtype" select-type="getsigntype"></select-opt>
        </form-item>
        <form-item label="部署信息">
          <el-input @keyup.enter.native="getTableData" v-model="signInfo" placeholder="请输入部署信息"></el-input>
        </form-item>
        <form-item label="操作人">
          <el-input @keyup.enter.native="getTableData" v-model="creator" placeholder="请输入操作人"></el-input>
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
            v-model="offlineTime"
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
            <el-table-column label="类型" prop="signtype"></el-table-column>
            <el-table-column label="部署目录" prop="signinfo"></el-table-column>
            <el-table-column label="创建时间" prop="createtimeText"></el-table-column>
            <el-table-column label="下线时间" prop="offlinetimeText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button type="text" @click="goSignTrackDetail(scope.row)">详情</el-button>
                <el-button type="text" @click="honeysignpolicydelete(scope.row)">撤销</el-button>
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
    <CreatedSign :visible.sync="dialogVisible" add-type="cluster" v-if="dialogVisible" @close="close"></CreatedSign>
  </div>
</template>

<script>
import CreatedSign from '@/modules/created/CreatedSign'
import { formatTime } from '@/lib/util'
import { signatureStatusMap } from '@/lib/config'
import env from '@/env.config.js'

export default {
  name: 'SignDetail',
  components: { CreatedSign },
  data() {
    return {
      statusOptions: signatureStatusMap,
      dialogVisible: false,
      createdFormRules: {
        type: { required: true, message: '请选择密签类型', trigger: 'change' },
        class: { required: true, message: '请选择密签选择', trigger: 'change' },
        path: { required: true, message: '请填写部署目录', trigger: 'blur' }
      },
      createdFrom: {
        type: '',
        class: '',
        path: '',
      },
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
      // 参数
      creator: '',
      status: null,
      signInfo: '',
      signtype: '',
      createTime: '',
      offlineTime: '',
      honeypotId: '',
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
    async download(item) {
      const ele = document.createElement('a')
      const base = env[window.__env__ || 'default'].VUE_APP_API_URL
      ele.href=`${base}/downloadhoneysign?taskid=${item.taskid}`
      ele.target = '_blank'
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const { creator, status, createTime, offlineTime, signtype, signInfo } = this
        const { honeypotId } = this.$route.params
        const res = await this.$Server('/gethoneysigns', 'POST', {
          signtype,
          creator,
          status,
          signInfo,
          honeypotId: honeypotId,
          'createStartTime': (createTime ? createTime[0] : '').toString(),
          'createEndTime': (createTime ? createTime[1] : '').toString(),
          'offlineStartTime': (offlineTime ? offlineTime[0] : '').toString(),
          'offlineEndTime': (offlineTime ? offlineTime[1] : '').toString(),
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

        this.totalCount = total

        this.tableData = list.map((item) => {
          return {
            ...item,
            offlinetimeText: formatTime(item.offlinetime),
            createtimeText: formatTime(item.createtime),
            statusText: this.statusOptions.find(p => {
              return p.value == item.status
            }).label
          }
        })
      } finally {
        this.loading = false
      }
    },
    async honeysignpolicydelete(scope) {

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

        const { taskid } = scope

        await this.$Server('/honeysignpolicydelete', 'POST', {
          taskid
        })

        this.$message.success('撤销成功')

      } catch (e) {console.log(e)} finally {
        this.loading = false
      }

      this.getTableData()
    },
    resetData() {
      this.createTime = ''
      this.offlineTime = ''
      this.signtype = ''
      this.creator = ''
      this.signInfo = ''
      this.status = null
    },
    goSignTrackDetail(scope) {
      const { tracecode } = scope

      this.$router.push({
        name: 'SignTrackDetail',
        params: {
          trackDetailId: tracecode
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
    close(update) {
      if (update) {
        this.getTableData()
      }
    }
  }
}
</script>

<style scoped>

</style>
