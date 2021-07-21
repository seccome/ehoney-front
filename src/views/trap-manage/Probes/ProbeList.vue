<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="应用名称">
          <el-input @keyup.enter.native="getTableData" v-model="serverName" placeholder="请输入应用名称"></el-input>
        </form-item>
        <form-item label="应用IP">
          <el-input @keyup.enter.native="getTableData" v-model="serverIp" placeholder="请输入 IP"></el-input>
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
          <!-- <el-button size="small" @click="show">新建</el-button> -->
        </div>
      </div>
      <div class="page-main">
        <ListLayout>
          <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
            <el-table-column label="Agent ID" prop="agentid" show-overflow-tooltip></el-table-column>
            <el-table-column label="系统" prop="sys"></el-table-column>
            <el-table-column label="应用名称" prop="servername"></el-table-column>
            <el-table-column label="应用IP" prop="serverip"></el-table-column>
            <el-table-column label="注册时间">
              <template slot-scope="scope">
                <span>{{
                  transformTime(scope.row.regtime)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="心跳时间">
              <template slot-scope="scope">
                <span>{{
                  transformTime(scope.row.heartbeattime)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="statusText"></el-table-column>
            <!--<el-table-column label="密签" prop="pos"></el-table-column>-->
            <!--<el-table-column label="诱饵" prop="pos"></el-table-column>-->
            <!--<el-table-column label="转发详情" prop="pos"></el-table-column>-->
            <el-table-column label="操作" width="240" fixed="right">
              <div slot-scope="scope">
                <el-button type="text" @click="handleClickBtn(1,scope.row)">密签列表</el-button>
                <el-button type="text" @click="handleClickBtn(2,scope.row)">诱饵列表</el-button>
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
    <el-dialog title="新增应用管理"
               width="520px"
               v-if="visible"
               custom-class="dialog-reset"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="beforeClose"
               :visible.sync="visible">
      <el-form
        ref="createdFormRef" :model="createdFrom" :rules="createdFormRules"
        class="created-from"
        label-width="100px">
        <el-form-item label="主机名" prop="serverName">
          <el-input v-model="createdFrom.serverName" placeholder="请填写主机名"></el-input>
        </el-form-item>
        <el-form-item label="主机ip" prop="serverIp">
          <el-input v-model="createdFrom.serverIp" placeholder="请填写主机ip"></el-input>
        </el-form-item>
        <el-form-item label="服务器agentId" prop="agentid">
          <el-input v-model="createdFrom.agentid" placeholder="请填写服务器agentid"></el-input>
        </el-form-item>
        <el-form-item label="vpc环境" prop="vpcName">
          <el-input v-model="createdFrom.vpcName" placeholder="请填写vpc环境"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-box" slot="footer">
        <el-button size="small" @click="hide">取消</el-button>
        <el-button size="small" type="primary" @click="applicationclusteradd()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { probeStatusMap } from '@/lib/config'
import moment from 'moment'

export default {
  name: 'Applications',
  data() {
    return {
      visible: false,
      statusOptions: probeStatusMap,
      serverName: '',
      serverIp: '',
      status: null,
      createdFrom: {
        serverName: '',
        serverIp: '',
        agentid: '',
        vpcName: '',
      },
      createdFormRules: {
        serverName: { required: true, message: '请填写主机名', trigger: 'blur' },
        serverIp: { required: true, message: '请填写主机ip', trigger: 'blur' },
        agentid: { required: true, message: '请填写服务器agentid', trigger: 'blur' },
        vpcName: { required: true, message: '请填写vpc环境', trigger: 'blur' },
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
    transformTime(time) {
      if(!time) return ''
      return moment(time * 1000).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const { serverName, serverIp, status } = this

        const res = await this.$Server('/getapplicationclusters', 'POST', {
          serverName,
          serverIp,
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
          return {
            ...item,
            statusText: this.statusOptions.find(p => {
              return p.value == item.status
            }).label,
          }
        })

      } finally {
        this.loading = false
      }
    },
    async applicationclusteradd() {
      await this.$refs.createdFormRef.validate()

      if (this.loading) return
      this.loading = true
      try {
        await this.$Server('/applicationclusteradd', 'POST', {
          ...this.createdFrom
        })

        this.$message.success('新建成功')

        this.hide()

        this.loading = false

        this.getTableData()
      } catch (e) {console.log(e)}

      this.loading = false

    },
    resetData() {
      this.serverName = ''
      this.serverIp = ''
      this.vpcName = ''
      this.status = null
    },
    handleClickBtn(type, item) {
      // type: 1-密签详情, 2-诱饵详情, 3-转发详情
      const { agentid } = item
      const urlMap = {
        1: 'ProbesSignatures',
        2: 'ProbesDecoys'
      }
      this.$router.push({
        name: urlMap[type],
        params: {
          agentId: agentid,
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
      this.visible = true
    },
    hide() {
      this.visible = false
      this.$refs.createdFormRef.resetFields()
    },
    beforeClose() {
      this.hide()
    },
  }
}
</script>

<style scoped>

</style>
