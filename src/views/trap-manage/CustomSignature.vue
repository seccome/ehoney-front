<template>
  <div>
    <PageContent>
      <div slot="form" class="page-form">
        <form-item label="密签类型">
          <select-opt v-model="signId" select-type="getsigntype"></select-opt>
        </form-item>
        <!--<form-item label="操作系统">-->
        <!--  <select-opt v-model="signSysType" select-type="getsystype"></select-opt>-->
        <!--</form-item>-->
        <form-item label="文件名称">
          <el-input @keyup.enter.native="getTableData" v-model="signName" placeholder="请输入文件名称"></el-input>
        </form-item>
        <form-item label="生成时间">
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
          <el-button size="small" @click="resetData">重置</el-button>
          <el-button size="small" @click="show">新建</el-button>
        </div>
      </div>
      <div class="page-main">
        <ListLayout>
          <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
            <el-table-column label="密签类型" prop="signtype"></el-table-column>
            <!--<el-table-column label="操作系统" prop="signsystype"></el-table-column>-->
            <el-table-column label="密签名称" prop="signname"></el-table-column>
            <el-table-column label="文件名称" prop="signinfo"></el-table-column>
            <el-table-column label="生成时间" prop="createtimeText"></el-table-column>
            <el-table-column label="操作人" prop="creator"></el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button type="text" @click="deletesign(scope.row)">删除</el-button>
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
    <Upload title="新建密签" :isSign="true" :visible.sync="uploadVisible" v-if="uploadVisible"
            @close="close"></Upload>
  </div>
</template>

<script>

import Upload from '@/components/upload/Upload'
import SelectOpt from '@/components/SelectOpt'
import { formatTime } from '@/lib/util'

export default {
  name: 'Densitys',
  components: { SelectOpt, Upload },
  data() {
    return {
      uploadVisible: false,
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
      signName: '',
      creator: '',
      createtime: '',
      signId: '',
      signSysType: '',
      timeValue: '',
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
    createSign() {
      this.visible = true
    },
    async getTableData() {
      if (this.loading) return
      this.loading = true

      try {
        const {
          signName,
          creator,
          createtime,
          signId,
          signSysType,
          timeValue
        } = this

        const res = await this.$Server('/getsigns', 'POST', {
          signName,
          creator,
          createtime,
          signId,
          signSysType,
          startTime: timeValue ? (timeValue[0] / 1000).toString() : '',
          endTime: timeValue ? (timeValue[1] / 1000).toString() : '',
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
            createtimeText: formatTime(item.createtime)
          }
        })

      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async deletesign(item) {
      if (this.loading) return
      this.loading = true

      try {

        await this.$confirm('是否确认删除密签', '删除密签', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })

        const { signid } = item
        await this.$Server('/deletesign', 'POST', {
          signid
        })

        this.$message.success('删除成功')

        this.loading = false

        this.getTableData()

      } catch (e) {
        this.loading = false
      }

    },
    resetData() {
      this.signName = ''
      this.creator = ''
      this.createtime = ''
      this.signId = ''
      this.signSysType = ''
      this.timeValue = ''
    },
    handleClickBtn() {

    },
    handleSizeChange() {
      this.getTableData()
    },
    handleCurrentChange() {
      this.getTableData()
    },
    show() {
      this.uploadVisible = true
    },
    hide() {
      this.uploadVisible = false
    },
    close(isUpdate) {
      if (isUpdate) {this.getTableData()}
    }
  }
}
</script>

<style scoped>

</style>
