<template>
  <PageContent>
    <div slot="form" class="page-form">
      <form-item label="蜜罐类型">
        <select-opt v-model="honeyTypeId" select-type="gethoneypotstype"></select-opt>
      </form-item>
      <form-item label="蜜罐状态">
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </form-item>
      <form-item label="蜜罐 IP">
        <el-input @keyup.enter.native="getTableData" v-model="honeyIp" placeholder="请输入 IP"></el-input>
      </form-item>
      <form-item label="蜜罐名称">
        <el-input @keyup.enter.native="getTableData" v-model="honeyName" placeholder="蜜罐名称"></el-input>
      </form-item>
      <form-item label="操作系统">
        <select-opt v-model="sysid" select-type="getsystype"></select-opt>
      </form-item>
      <form-item label="创建人">
        <el-input @keyup.enter.native="getTableData" v-model="creator" placeholder="创建人"></el-input>
      </form-item>
      <form-item label="创建时间">
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
      <div class="btn-box">
        <el-button size="small" type="primary" @click="getTableData">查询</el-button>
        <el-button size="small" @click="resetData">重置</el-button>
        <el-button size="small" @click="addPod" id="addPod">新建</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="蜜罐类型" prop="honeypottype"></el-table-column>
          <el-table-column label="蜜罐名称" prop="honeyname"></el-table-column>
          <el-table-column label="蜜罐 IP" prop="honeyip" show-overflow-tooltip></el-table-column>
          <el-table-column label="蜜网 IP" prop="serverip" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作系统" prop="systype"  show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="createtimeText" show-overflow-tooltip></el-table-column>
          <el-table-column label="下线时间" prop="offlinetimeText" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="statusText" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建人" prop="creator" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="280px" fixed="right">
            <div slot-scope="scope">
              <el-button type="text" @click="handleClickBtn(2,scope.row)">密签列表</el-button>
              <el-button type="text" @click="handleClickBtn(3,scope.row)">诱饵列表</el-button>
              <el-button type="text" v-if="scope.row.status  === 1" @click="deletepod(scope.row)">下线
              </el-button>
              <el-button type="text" v-if="scope.row.status !== 2"  @click="podStatusCheck(scope.row)">网络探测
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
</template>

<script>
import { formatTime } from '@/lib/util'
import { honeyStatusMap } from '@/lib/config'
import intro from '@/mixins/intro'
export default {
  name: 'ClusterManager',
  mixins: [intro],
  data() {
    return {
      statusOptions: honeyStatusMap,
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
      honeyTypeId: '',
      honeyIp: '',
      honeyName: '',
      startTime: '',
      endTime: '',
      creator: '',
      sysid: '',
      status: null,
      // 列表
      tableData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      introContent: '点此创建蜜罐'
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    if (this.isFirstLogin() && !this.isPageVisited('HoneypotList')) {
      this.initIntro('HoneypotList', [
        {
          'next #addPod' : '创建Mysql、SSH等服务容器',
          "skipButton" : {className: "mySkip", text: "跳过"},
          "nextButton" : {className: "myNext", text: "下一步"},
        },
        {
          'click .shadow-agency' : '请点击影子代理下的协议转发',
          "skipButton" : {className: "mySkip", text: "好的，我知道了"},
        }
      ])
    }
  },
  methods: {
    async podStatusCheck(record) {
      try {
        const res = await this.$Server('/testpodstatus', 'POST', {
          honeypotid: record.honeypotid
        })
        const {code, message} = res
        if (code === 1001) {
          record.statusText = '离线'
          this.$message.error(message)
        } else {
          this.$message.success(message)
        }
      } catch (e) {
        record.statusText = '离线'
      }
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const {
          sysid, honeyTypeId, honeyIp, honeyName, creator, status, attackTimeValue
        } = this

        const res = await this.$Server('/gethoneyinfos', 'POST', {
          honeyTypeId,
          sysid,
          honeyIp,
          honeyName,
          creator,
          status,
          startTime: (attackTimeValue ? attackTimeValue[0] : '').toString(),
          endTime: (attackTimeValue ? attackTimeValue[1] : '').toString(),
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
            offlinetimeText: formatTime(item.offlinetime),
            createtimeText: formatTime(item.createtime),
            statusText: statusOption? statusOption.label: '未知',
          }
        })

      } finally {
        this.loading = false
      }
    },
    resetData() {
      this.sysid = ''
      this.honeyTypeId = ''
      this.honeyIp = ''
      this.honeyName = ''
      this.creator = ''
      this.attackTimeValue = ''
      this.status = null
    },
    async deletepod(item) {
      if (this.loading) return
      this.loading = true

      try {

        await this.$confirm('是否确定下线', '提示', {
          type: 'warning',
          confirmButtonText: '下线',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })

        const { honeypotid, honeyname } = item
        await this.$Server('/deletepod', 'POST', {
          podId: honeypotid,
          name: honeyname
        })

        this.$message.success('下线成功')

      } catch (e) {console.log(e)} finally {this.loading = false}

      await this.getTableData()
    },
    addPod() {
      this.$router.push({
        name: `HoneypotCreate`
      })
    },
    handleClickBtn(type, item) {
      const { honeypotid } = item
      const urlMap = {
        2: "SignatureList",
        3: "BaitList",
      }
      this.$router.push({
        name: urlMap[type],
        params: {
          honeypotId: honeypotid,
        }
      })
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
