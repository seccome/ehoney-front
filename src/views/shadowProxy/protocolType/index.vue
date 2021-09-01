<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="addDialogCtrl.isShow=true">新建</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="协议名称" prop="ProtocolType"></el-table-column>
          <el-table-column label="部署路径" prop="DeployPath"></el-table-column>
          <el-table-column label="状态" width="80px" show-overflow-tooltip>
            <template v-slot="{row}">
              <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column label="透明协议端口范围" width="160px">
            <template v-slot="{row}">{{row.MinPort}} - {{row.MaxPort}}</template>
          </el-table-column>
          <el-table-column label="创建人" prop="Creator"></el-table-column>
          <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-edit-outline" circle @click="editRow(row)"></el-button>
              <el-button v-if="!row.DefaultFlag" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row, 'ProtocolType')"></el-button>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
    <!-- 新建蜜罐密签弹窗 -->
    <AddDialog v-if="addDialogCtrl.isShow" :dialogData.sync="addDialogCtrl" @save="search" />
  </PageContent>
</template>

<script>
import AddDialog from './AddDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { AddDialog },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.protocolTypeSearch,
      apiUrl: this.$apis.protocolTypeCreate,
      addDialogCtrl: {
        isShow: false,
        data: null
      }
    }
  },

  created () {
    this.search();
  },

  methods: {
    editRow(row) {
      this.addDialogCtrl = {
        isShow: true,
        data: row
      }
    }
  }
}
</script>