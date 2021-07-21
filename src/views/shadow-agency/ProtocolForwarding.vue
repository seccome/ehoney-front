<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="转发端口">
          <el-input @keyup.enter.native="getTableData" v-model.number="forwardPort" placeholder="请输入转发端口"></el-input>
        </form-item>
        <form-item label="服务类型">
          <select-opt v-model="honeyTypeId" select-type="gethoneypotstype"></select-opt>
        </form-item>
        <form-item label="蜜罐ip">
          <el-input @keyup.enter.native="getTableData" v-model="honeyPotIp" placeholder="请输入蜜罐ip"></el-input>
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
        <div class="btn-box">
          <el-button size="small" type="primary" @click="getTableData">查询</el-button>
          <el-button size="small" @click="resetData">重置</el-button>
          <el-button size="small" @click="show" id="addProtolBtn">新建</el-button>
        </div>
      </div>
      <div class="page-main">
        <ListLayout>
          <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
            <el-table-column label="蜜网IP" prop="serverip" show-overflow-tooltip></el-table-column>
            <el-table-column label="转发端口" prop="forwardport"></el-table-column>
            <el-table-column label="服务类型" prop="honeypottype"></el-table-column>
            <el-table-column label="蜜罐ip" prop="honeyip"></el-table-column>
            <el-table-column label="蜜罐端口" prop="honeyport"></el-table-column>
            <el-table-column label="创建时间" prop="createtimeText"></el-table-column>
            <el-table-column label="下线时间" prop="offlinetimeText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <el-table-column label="操作">
              <div class="" slot-scope="scope">
                <el-button type="text" v-if="scope.row.status !== 2" @click="networkDetection(scope.row)">网络探测
                </el-button>
                <el-button type="text" v-if="scope.row.status === 1" @click="transPolicyDelete(scope.row)">下线
                </el-button>
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
        ref="createdFormRef" :model="createdForm" :rules="createdFormRules"
        class="created-from"
        v-loading="transPolicyAddLoading"
        label-width="75px">
        <el-form-item label="服务类型" prop="honeyTypeId" >
          <el-select v-model="createdForm.honeyTypeId" placeholder="请选择"  @change="gethoneylist">
            <el-option
              v-for="item in thoneypotsTypes"
              :key="item.honeyTypeId"
              :label="item.honeyPotType"
              :value="item.honeyTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="蜜罐选择" prop="HoneyPotId" >
          <el-select v-model="createdForm.HoneyPotId" placeholder="请选择">
            <el-option
              v-for="item in honeylist"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转发端口" prop="ListenPort">
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
import { protocalStatusMap } from '@/lib/config'
import intro from '@/mixins/intro'
export default {
  name: 'TransmitDetail',
  mixins: [intro],
  data() {
    return {
      visible: false,
      createdFormRules: {
        ListenPort: { required: true, trigger: 'blur', message: '请选择转发端口', },
        HoneyPotId: { required: true, message: '请选择蜜罐', trigger: 'change' },
        honeyTypeId: { required: true, message: '请选择蜜罐类型', trigger: 'change' },
      },
      createdForm: {
        ListenPort: null,
        HoneyTypeId: '',
        HoneyPotId: ''
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
      statusOptions: protocalStatusMap,
      honeyclustersType: [],
      honeylist: [],
      showHoneyPot: false,
      // 参数
      agentId: '',
      forwardPort: null,
      honeyTypeId: '',
      honeyPotPort: null,
      honeyPotIp: '',
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
      thoneypotsTypes: [],
      introContent: '新建透明转发'
    }
  },
  created() {
    this.getTableData()
    this.gethoneyclusters()
  },
  mounted() {
    if (this.isFirstLogin() && !this.isPageVisited('ProtocalForwarding')) {
      this.initIntro('ProtocalForwarding', [
        {
          'next #addProtolBtn' : '建立蜜网服务器到服务容器的流量转发',
          "skipButton" : {className: "mySkip", text: "跳过引导"},
          "nextButton" : {className: "myNext", text: "下一步"},
        },
        {
          'click .transparent-forwarding' : '请点击影子代理下的透明转发',
          "skipButton" : {className: "mySkip", text: "好的，我知道了"},
        }
      ])
    }
  },
  methods: {
     async deleteNode(item) {
      const res = await this.$Server('/honeytransPolicyRemove', 'POST', {
        taskId: item.taskid,
      })
      if (res.code === 0) {
        this.$message.success(res.message)
        this.getTableData()
      }
    },
    canDelete(status) {
      const deletableStatus = [-1, 2, 5]
      return deletableStatus.includes(status)
    },
    async networkDetection(item) {
      try {
        const res = await this.$Server('/honeytranspolicytest', 'POST', {
          taskId: item.taskid,
        })
        if (res.code === 0) {
          this.$message.success(res.message)
        }
      } catch(e) {
         item.statusText = '离线'
         item.status = -1
      }
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const {
          forwardPort,
          honeyTypeId,
          honeyPotIp,
          status,
          creator,
          honeyPotPort,
          createTime,
          offlineTime,
        } = this


        const res = await this.$Server('/honeytranspolicyselectagentid', 'POST', {
          forwardPort,
          honeyTypeId,
          honeyPotIp,
          status,
          creator,
          honeyPotPort,
          createStartTime: (createTime ? createTime[0] : '').toString(),
          createEndTime: (createTime ? createTime[1] : '').toString(),
          offlineStartTime: (offlineTime ? offlineTime[0] : '').toString(),
          offlineEndTime: (offlineTime ? offlineTime[1] : '').toString(),
          pageSize: this.pageSize,
          pageNum: this.currentPage
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
            ...item,
            offlinetimeText: formatTime(item.offlinetime),
            createtimeText: formatTime(item.createTime),
            statusText: this.statusOptions.find(p => {
              return p.value == item.status
            }).label,
          }
        })

      } catch (e) {console.log(e)} finally {
        this.loading = false
      }
    },
    async transPolicyAdd() {
      await this.$refs.createdFormRef.validate()
      if (this.transPolicyAddLoading) return
      this.transPolicyAddLoading = true
      try {
        const { decoyDetailId } = this.$route.params
        const res = await this.$Server('/honeytranspolicyadd', 'POST', {
          ...this.createdForm,
          honeyPotId: decoyDetailId,
        })

        console.log(res)

        this.$message.success('新建成功')

        this.transPolicyAddLoading = false

        this.getTableData()

        setTimeout(() => {
          this.hide()
        }, 300)
      } catch (e) {console.log(e)} finally {
        this.transPolicyAddLoading = false
      }

    },
    async transPolicyDelete(scope) {

      await this.$confirm('是否确认下线', '提示', {
        type: 'warning',
        confirmButtonText: '下线',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })

      const { taskid } = scope
      if (this.loading) return
      this.loading = true

      try {
        const res = await this.$Server('/honeytranspolicydelete', 'POST', {
          'agentId': this.agentId,
          taskid,
          status: 2,
        })

        console.log(res)

        this.$message.success('下线成功')

        this.loading = false

        this.getTableData()

      } finally {
        this.loading = false
      }
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
    // 获取服务类型
    async gethoneypotstype() {
      const res = await this.$Server('/gethoneypotstype', 'POST', {})

      if (!res.data) return

      this.thoneypotsTypes = res.data
    },
    // 蜜罐选择
    async gethoneylist(val) {
      this.createdForm.HoneyPotId = ''
      const res = await this.$Server('/gethoneylistfortrans', 'POST', {
        honeyTypeId: val
      })

      if (!res.data) {
        this.honeylist = []
        return
      }
      const list = res.data
      this.honeylist = list.map((item) => {
        return {
          label: item.honeyname,
          value: item.honeypotid,
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
    show() {
      this.visible = true
      // this.gethoneylist()
      this.gethoneypotstype()
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

<style>
.created-from .el-select {
  width: 100%;
}
</style>
