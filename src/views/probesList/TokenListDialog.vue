<template>
  <el-dialog title="蜜签列表" visible width="1000px" :close-on-click-modal="false" :before-close="close" v-loading="loading">
    <PageContent>
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
          <el-table slot="list" :data="tableData" width="100%" :border="false">
            <el-table-column label="密签名称" prop="TokenName"></el-table-column>
            <el-table-column label="密签类型" prop="TokenType"></el-table-column>
            <el-table-column label="部署路径" prop="DeployPath"></el-table-column>
            <el-table-column label="状态">
              <template v-slot="{row}">
                <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建人" prop="Creator"></el-table-column>
            <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
            <el-table-column label="操作" width="100px">
              <template v-slot="{row}">
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row, 'TokenName')"></el-button>
                <el-button v-if="row.Status > 1" type="primary" size="mini" icon="el-icon-download" circle @click="downloadFile(row)"></el-button>
              </template>
            </el-table-column>
            <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
          </el-table>
        </ListLayout>
      </div>
    </PageContent>

    <span slot="footer" class="dialog-footer">
      <Pagination class="dialog-pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
    </span>
    <!-- 新建蜜罐密签弹窗 -->
    <AddTokenDialog v-if="isShowAddDialog" :honeypotID="ServerID" @close="isShowAddDialog=false" @save="search" />
  </el-dialog>
</template>

<script>
import AddTokenDialog from './AddTokenDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  props: {
    ServerID: ''
  },

  components: { AddTokenDialog },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.tokenProbeSearch,
      apiUrl: this.$apis.tokenProbeCreate,
      searchParams: {
        Payload: '',
        ServerID: this.ServerID
      },
      isShowAddDialog: false
    }
  },

  created () {
    this.search();
  }
}
</script>