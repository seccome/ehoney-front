<template>
  <PageContent>
    <div slot="form" class="page-form">
      <form-item label="木马文件名">
        <el-input @keyup.enter.native="getTableData" v-model="filename"
                  placeholder="请输入木马文件名"></el-input>
      </form-item>
      <form-item label="病毒信息">
        <el-input @keyup.enter.native="getTableData" v-model="virname"
                  placeholder="请输入木马文件名"></el-input>
      </form-item>
      <form-item label="蜜罐 IP">
        <el-input @keyup.enter.native="getTableData" v-model="honeyPotip"
                  placeholder="请输入 蜜罐IP"></el-input>
      </form-item>
      <form-item label="生成时间" class="last-from-item">
        <el-date-picker v-model="timeValue"
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
      </div>
    </div>
    <div class="attack-body page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="木马文件名" prop="filename"></el-table-column>
          <el-table-column label="病毒信息" prop="virname"></el-table-column>
          <el-table-column label="蜜罐ip" prop="honeypotip"></el-table-column>
          <el-table-column label="生成时间" prop="createtimeText"></el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159"/>
          </div>
        </el-table>
        <!--<el-pagination-->
        <!--  slot="pagination"-->
        <!--  class="pagination f-right"-->
        <!--  @size-change="handleSizeChange"-->
        <!--  @current-change="handleCurrentChange"-->
        <!--  :current-page.sync="currentPage"-->
        <!--  layout="total, prev, pager, next, jumper"-->
        <!--  :page-size="pageSize"-->
        <!--  :total="totalCount"-->
        <!--&gt;</el-pagination>-->
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

export default {
  name: 'Muma',
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
      timeValue: '',
      filename: '',
      virname: '',
      honeyPotip: '',
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
      console.log(222)
      if (this.loading) return
      this.loading = true
      try {
        const {
          timeValue,
          filename,
          virname,
          honeyPotip,
        } = this

        const res = await this.$Server('/getclamavresult', 'POST', {
          createStartTime: timeValue ? timeValue[0].toString() : '',
          createEndTime: timeValue ? timeValue[1].toString() : '',
          filename,
          virname,
          honeyPotip,
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

          return Object.assign(item, {
            createtimeText: formatTime(Number.parseInt(item.createtime))
          })

        })
      } finally {
        this.loading = false
      }
    },
    resetData() {
      this.timeValue = ''
      this.filename = ''
      this.virname = ''
      this.honeyPotip = ''
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
