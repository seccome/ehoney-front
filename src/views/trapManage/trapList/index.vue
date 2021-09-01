<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="isShowAddDialog=true">新建</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="诱饵名称" prop="BaitName"></el-table-column>
          <el-table-column label="诱饵类型" prop="BaitType"></el-table-column>
          <el-table-column label="创建人" prop="Creator"></el-table-column>
          <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template v-slot="{row}">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row, 'BaitName')"></el-button>
              <el-button v-if="row.BaitType==='FILE'" type="primary" size="mini" icon="el-icon-download" circle @click="downloadFile(row)"></el-button>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
    <!-- 新建蜜罐诱饵弹窗 -->
    <AddBaitDialog v-if="isShowAddDialog" @close="isShowAddDialog=false" @save="search" />
  </PageContent>
</template>

<script>
import AddBaitDialog from './AddBaitDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { AddBaitDialog },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.trapSearch,
      apiUrl: this.$apis.trapCreate,
      isShowAddDialog: false
    }
  },

  created() {
    this.search();
  }
}
</script>