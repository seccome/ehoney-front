<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="诱饵类型">
          <select-opt v-model="baitType" select-type="getAllBaitType"></select-opt>
        </form-item>
        <form-item label="诱饵状态">
          <el-select v-model="status" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </form-item>
        <form-item label="部署信息">
          <el-input @keyup.enter.native="getTableData" v-model="baitInfo" placeholder="请输入部署信息"></el-input>
        </form-item>
        <form-item label="上线时间">
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
        <form-item label="操作人">
          <el-input @keyup.enter.native="getTableData" v-model="creator" placeholder="请输入操作人名称"></el-input>
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
            <el-table-column label="类型" prop="baitType"></el-table-column>
            <el-table-column label="部署信息" prop="baitInfo">
              <div slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content" class="content-box">{{ scope.row.baitInfo }}</div>
                  <div class="baitInfo-box">
                    <span>{{ scope.row.baitInfo }}</span>
                  </div>
                </el-tooltip>
              </div>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTimeText"></el-table-column>
            <el-table-column label="下线时间" prop="offlineTimeText"></el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button type="text" v-if="scope.row.status === 1"
                           @click="baitPolicyDelete(scope.row)">撤销
                </el-button>
                <el-button type="text" v-if="scope.row.status === 1"
                           @click="download(scope.row)">下载
                </el-button>
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
    <CreatedDecoy title="新建诱饵" @close="closeCreatedDecoy" v-if="dialogVisible"
                  :visible.sync="dialogVisible"></CreatedDecoy>
  </div>
</template>

<script>

import CreatedDecoy from '@/modules/created/CreatedDecoy'
import { formatTime } from '@/lib/util'
import { probeBaitStatusMap } from '@/lib/config'
import env from '@/env.config.js'

export default {
  name: 'DecoyDetail',
  components: { CreatedDecoy },
  data() {
    return {
      dialogVisible: false,
      statusOptions: probeBaitStatusMap,
      // 时间
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
      // 参数
      agentId: '',
      baitType: '',
      baitInfo: '',
      creator: '',
      createTime: '',
      offlineTime: '',
      status: null,
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
    }
  },
  created() {
    this.agentId = this.$route.params.agentId
    this.getTableData()
  },
  methods: {
    async download(item) {
      const ele = document.createElement('a')
      const base = env[window.__env__ || 'default'].VUE_APP_API_URL
      ele.href=`${base}/downloadapplicationbaitpolicy?taskid=${item.taskId}`
      ele.target = '_blank'
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const { baitType, creator, status, baitInfo, createTime, offlineTime } = this
        const res = await this.$Server('/baitPolicySelectAgentId', 'POST', {
          agentId: this.agentId,
          baitType,
          creator,
          baitInfo,
          'createStartTime': (createTime ? createTime[0] : '').toString(),
          'createEndTime': (createTime ? createTime[1] : '').toString(),
          'offlineStartTime': (offlineTime ? offlineTime[0] : '').toString(),
          'offlineEndTime': (offlineTime ? offlineTime[1] : '').toString(),
          status,
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
          let _status = this.statusOptions.find(p => p.value == item.status) || {};
          return {
            ...item,
            createTimeText: formatTime(item.createTime),
            offlineTimeText: formatTime(item.offlineTime),
            statusText: _status.label,
          }
        })

      } catch (e) {
        console.log(e)
      } finally {
        console.log(22)
        this.loading = false
      }
    },
    async baitPolicyDelete(item) {

      if (this.loading) return
      this.loading = true

      try {
        await this.$confirm('是否确认撤销此诱饵', '撤销诱饵', {
          type: 'warning',
          confirmButtonText: '撤销',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })

        const { taskId } = item
        await this.$Server('/applicationbaitpolicydelete', 'POST', {
          taskId
        })

        this.$message.success('撤销成功')

        this.loading = false

        this.getTableData()

        return
      } catch (e) {
        console.log(e)
        this.loading = false
      }

    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },
    closeCreatedDecoy(update) {
      if (update) {
        this.getTableData()
      }
    },
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    resetData() {
      console.log(222)
      this.baitType = ''
      this.baitInfo = ''
      this.creator = ''
      this.createTime = ''
      this.offlineTime = ''
      this.status = null
    },
  }
}
</script>

<style scoped>
.baitInfo-box {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-box {
  max-width: 300px;
  max-height: 180px;
  overflow-y: scroll;
}
</style>
