<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="发生时间">
        <el-date-picker v-model="searchParams.dateRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" />
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="resetParams">重置</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="蜜罐名称" prop="HoneypotName"></el-table-column>
          <el-table-column label="输出" prop="Output" show-overflow-tooltip></el-table-column>
          <el-table-column label="falco事件" prop="Event"></el-table-column>
          <el-table-column label="事件等级" prop="Level"></el-table-column>
          <el-table-column label="发生时间" prop="Time"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-view" circle @click="showDetail(row)"></el-button>
              <el-button v-if="row.FileFlag" type="primary" size="mini" icon="el-icon-download" circle @click="downloadFile(row)"></el-button>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
    <!-- 详情弹窗 -->
    <DetailDialog v-if="detailDialogCtrl.isShow" :detailData="detailDialogCtrl.data" @close="detailDialogCtrl.isShow=false" />
  </PageContent>
</template>

<script>
import DetailDialog from './DetailDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: {DetailDialog},

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.falcoEventSearch,
      searchParams: {
        Payload: '',
        dateRange: []
      },
      detailDialogCtrl: {
        isShow: false,
        data: {}
      },
    }
  },

  created() {
    this.search();
  },

  methods: {
    /**
     * 转换查询条件
     */
    getSearchParams() {
      let StartTime, EndTime;
      if (this.searchParams.dateRange) {
        StartTime = this.searchParams.dateRange[0];
        EndTime = this.searchParams.dateRange[1];
      }
      return {
        Payload: this.searchParams.Payload,
        StartTime,
        EndTime,
      }
    },

    /**
     * 查看详情
     */
    showDetail (row) {
      this.loading = true
      this.$axios.get(`${this.$apis.falcoEventSearch}/${row.ID}`).then(res => {
        this.loading = false;
        this.detailDialogCtrl = {
          isShow: true,
          data: res.data
        }
      }).catch(() => {
        this.loading = false;
      });
    },

    /**
     * 下载
     */
     downloadFile({DownloadPath}) {
      window.open(DownloadPath);
    },

  }
}
</script>