<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="转发端口">
          <el-input @keyup.enter.native="getTableData" v-model.number="listenPort" placeholder="请输入转发端口"></el-input>
        </form-item>
        <form-item label="服务类型">
          <select-opt v-model="honeyTypeId" select-type="gethoneypotstype"></select-opt>
        </form-item>
        <form-item label="蜜罐端口">
          <el-input @keyup.enter.native="getTableData" v-model.number="honeyPotPort" placeholder="蜜罐端口"></el-input>
        </form-item>
        <form-item label="操作人">
          <el-input @keyup.enter.native="getTableData" v-model="creator" placeholder="请输入操作人名称"></el-input>
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
          <el-button size="small" @click="show"
            id="addTransparentBtn">新建</el-button>
        </div>
      </div>
      <div class="page-main">
        <ListLayout>
          <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
            <el-table-column label="探针IP" prop="serverip"></el-table-column>
            <el-table-column label="转发端口" prop="forwardPort"></el-table-column>
            <el-table-column label="蜜网IP" prop="honeyserverip" show-overflow-tooltip></el-table-column>
            <el-table-column label="蜜网端口" prop="honeyPotPort"></el-table-column>
            <el-table-column label="服务类型" prop="honeyPotType"></el-table-column>
            <el-table-column label="上线时间" prop="createtimeText"></el-table-column>
            <el-table-column label="下线时间" prop="offlinetimeText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <el-table-column label="操作">
              <div class="" slot-scope="scope">
                <el-button type="text" v-if="scope.row.status !== 2" @click="networkDetection(scope.row)">网络探测
                </el-button>
                <el-button type="text" v-if="scope.row.status  === 1" @click="transPolicyDelete(scope.row)">下线</el-button>
                <el-button type="text" v-if="canDelete(scope.row.status)" @click="deleteNode(scope.row)">删除
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
    <el-dialog title="新建转发"
               width="520px"
               v-if="visible"
               custom-class="dialog-reset"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="beforeClose"
               :visible.sync="visible">
      <el-form
        ref="createdFormRef"
        :model="createdForm"
        :rules="createdFormRules"
        class="created-from"
        v-loading="transPolicyAddLoading"
        label-width="100px">
        <el-form-item label="蜜罐选择" prop="honeyPotId">
          <el-select v-model="createdForm.honeyPotId" placeholder="请选择" @change="gethoneytransportslist">
            <el-option
              v-for="item in honeylist"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议转发端口" prop="forwardPort">
          <el-select
            v-model="createdForm.forwardPort"
            :no-data-text="createdForm.honeyPotId?'无数据':'请先选择蜜罐'"
            placeholder="请选择">
            <el-option
              v-for="item in honeytransportslist"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="探针选择" prop="AgentId">
          <el-select v-model="createdForm.AgentId" placeholder="请选择">
            <el-option
              v-for="item in agentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="透明转发端口" prop="ListenPort">
          <el-input v-model.number="createdForm.ListenPort" placeholder="请填写转发端口"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-box" slot="footer">
        <el-button size="small" @click="hide">取消</el-button>
        <el-button size="small" type="primary" @click="transPolicyAdd('createdFormRef')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from '@/lib/util'
import { transparentStatusMap } from '@/lib/config'
import intro from '@/mixins/intro'

export default {
  name: 'TransmitDetail',
  mixins: [intro],
  data() {
    const checkPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入端口'))
      }

      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      }

      callback()
    }
    return {
      visible: false,
      createdFormRules: {
        ListenPort: { required: true, validator: checkPort, trigger: 'blur' },
        AgentId: { required: true, message: '请选择探针', trigger: 'change' },
        forwardPort: { required: true, message: '请选择协议转发端口', trigger: 'change' },
        honeyPotId: { required: true, message: '请选择蜜罐', trigger: 'change' }
      },
      createdForm: {
        honeyPotId: '',
        AgentId: '',
        ListenPort: '',
        forwardPort: '', // 协议转发端口
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
      statusOptions: transparentStatusMap,
      honeyclustersType: [],
      honeylist: [],
      agentList: [],
      showHoneyPot: false,
      // 参数
      agentId: '',
      listenPort: null,
      honeyTypeId: '',
      honeyPotPort: null,
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
      transPolicyAddLoading: false,
      honeytransportslist: [], // 协议转发端口
      introContent: '新建透明转发'
    }
  },
  watch: {
    'createdForm.serverId': {
      immediate: true,
      handler() {
        this.updateHoneylist()
      }
    },
    'createdForm.honeyTypeId': {
      deep: true,
      immediate: true,
      handler() {
        this.updateHoneylist()
      }
    }
  },
  created() {
    this.getTableData()
    this.gethoneyclusters()
  },
   mounted() {
    if (this.isFirstLogin() && !this.isPageVisited('TransparentForwarding')) {
      this.initIntro('TransparentForwarding', [
        {
          'click #addTransparentBtn' : '建立探针服务器到蜜网服务器的流量转发',
          "skipButton" : {className: "mySkip", text: "好的，我知道了"},
        }
      ])
    }
  },
  methods: {
    async deleteNode(item) {
      const res = await this.$Server('/transPolicyRemove', 'POST', {
        taskId: item.taskId,
      })
      if (res.code === 0) {
        this.$message.success(res.message)
        this.gethoneylist()
      }
    },
    canDelete(status) {
      const deletableStatus = [-1, 2, 5]
      return deletableStatus.includes(status)
    },
    async networkDetection(item) {
      try {
        const res = await this.$Server('/transpolicytest', 'POST', {
          taskId: item.taskId,
        })
        if (res.code === 0) {
          this.$message.success(res.message)
        }
      } catch (e) {
        item.statusText = '离线'
        item.status = -1
      }
    },
    updateHoneylist() {
      if (this.createdForm.serverId && this.createdForm.honeyTypeId) {
        this.showHoneyPot = true
        this.gethoneylist()
      } else {
        this.showHoneyPot = false
        this.honeylist = []
        this.createdForm.honeyPotId = ''
      }
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const {
          listenPort,
          honeyTypeId, honeyPotPort, creator,
          createTime,
          offlineTime,
          status,
        } = this


        const res = await this.$Server('/transPolicySelectAgentId', 'POST', {
          listenPort,
          honeyTypeId,
          honeyPotPort,
          creator,
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
          const statusOption = this.statusOptions.find(p => {
              return p.value == item.status
            })
          return {
            ...item,
            offlinetimeText: formatTime(item.offlineTime),
            createtimeText: formatTime(item.createTime),
            statusText: statusOption?statusOption.label:'未知',
          }
        })

      } finally {
        this.loading = false
      }
    },
    async transPolicyAdd() {
      await this.$refs.createdFormRef.validate()

      if (this.transPolicyAddLoading) return
      this.transPolicyAddLoading = true
      try {

        const res = await this.$Server('/transPolicyAdd', 'POST', {
          ...this.createdForm,
        })

        console.log(res)

        this.$message.success('新建成功')

        setTimeout(() => {
          this.hide()
        }, 300)
      } catch (e) {console.log(e)} finally {
        this.transPolicyAddLoading = false
      }

      this.getTableData()

    },
    async transPolicyDelete(scope) {

      const { taskId } = scope
      if (this.loading) return
      this.loading = true

      try {

        await this.$confirm('是否下线转发', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })

        const res = await this.$Server('/transPolicyDelete', 'POST', {
          'agentId': this.agentId,
          taskId,
          status: 2,
        })

        console.log(res)

        this.$message.success('下线成功')
      } catch (e) {console.log(e)} finally {
        this.loading = false
      }

      this.getTableData()

    },
    // 蜜罐集群
    async gethoneyclusters() {
      const res = await this.$Server('/gethoneyclusters', 'POST', {})

      if (!res.data) return

      const { list } = res.data
      this.honeyclustersType = list.map((item) => {
        return {
          label: item.servername,
          value: item.serverid,
        }
      })
    },
    // 蜜罐选择
    async gethoneylist() {
      const res = await this.$Server('/gethoneyforwardlistfortrans', 'POST')

      if (!res.data) return

      const list  = res.data
      this.honeylist = list.map((item) => {
        return {
          label: item.honeyname,
          value: item.honeypotid,
        }
      })
    },
    // 协议转发端口
    async gethoneytransportslist() {
      const res = await this.$Server('/gethoneytransportslist', 'POST', {
        honeyPotId: this.createdForm.honeyPotId
      })

      if (!res.data) return

      const list  = res.data
      this.honeytransportslist = list.map((item) => {
        return {
          label: item.forwardport,
          value: +item.forwardport,
        }
      })
    },
    // 获取探针列表
    async getAgentList() {
      const res = await this.$Server('/getapplicationlists', 'POST')
      if (!res.data) return

      const list = res.data
      this.agentList = list.map((item) => {
        return {
          label: item.servername,
          value: item.agentid,
        }
      })
    },
    resetData() {
      this.listenPort = null
      this.honeyTypeId = ''
      this.honeyPotPort = null
      this.creator = ''
      this.createStartTime = ''
      this.createEndTime = ''
      this.offlineStartTime = ''
      this.offlineEndTime = ''
      this.status = null
    },
    handleClickBtn(type) {
      // 撤销
      if (type === 2) {
        this.$alert('撤销逻辑')
      }
      // 新建
      if (type === 3) {
        this.$alert('新建弹窗')
      }
    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },
    submit(ref) {
      if (!ref) return

      this.$refs[ref].validate(valid => {
        console.log('valid', valid)
      })
    },
    show() {
      this.visible = true
      this.getAgentList()
      this.gethoneylist()
      this.gethoneytransportslist()
    },
    hide() {
      this.visible = false
      this.$refs.createdFormRef.resetFields()
    },
    beforeClose() {
      this.hide()
    },
    offlineShow() {
      this.offlineVisible = true

    },
    offlineHide() {
      this.offlineVisible = false
    },
    offlineBeforeClose() {
      this.offlineHide()
    },
  }
}
</script>

<style scoped>

</style>
