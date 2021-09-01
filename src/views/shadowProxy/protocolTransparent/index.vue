<template>
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
          <el-table-column label="探针IP" prop="ProbeIP"></el-table-column>
          <el-table-column label="代理端口" prop="ProxyPort"></el-table-column>
          <el-table-column label="协议类型" prop="ProtocolType"></el-table-column>
          <el-table-column label="协议端口" prop="ProtocolPort"></el-table-column>
          <el-table-column label="状态" width="80px" show-overflow-tooltip>
            <template v-slot="{row}">
              <i class="el-icon-loading warning--text mr-1" v-if="row.Status === 1"></i>
              <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="Creator"></el-table-column>
          <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
          <el-table-column label="操作" width="140px">
            <template v-slot="{row}">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row)"></el-button>
              <el-tooltip class="item" effect="dark" content="上线" placement="bottom" v-if="row.Status===2">
                <el-button type="primary" size="mini" icon="el-icon-top" circle @click="onlineHandler(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下线" placement="bottom" v-if="[1,3].includes(row.Status)">
                <el-button type="danger" size="mini" icon="el-icon-bottom" circle @click="offlineHandler(row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="探测" placement="bottom">
                <el-button type="primary" size="mini" icon="esign-icon-relation" circle @click="probeHandler(row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
    <!-- 新建弹窗 -->
    <AddDialog v-if="isShowAddDialog"  @close="isShowAddDialog=false" @save="search" />
  </PageContent>
</template>

<script>
import pageList from '@/mixins/pageList';
import AddDialog from './AddDialog.vue';

export default {
  components: {AddDialog},

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.transparentProxySearch,
      apiUrl: this.$apis.transparentProxyCreate,
      statusMap: {
        1: { text: '下发中', color: 'grey--text' },
        2: { text: '离线', color: 'red--text' },
        3: { text: '在线', color: 'green--text' }
      },
      isShowAddDialog: false
    }
  },

  created () {
    this.search();
    this.intervalRefresh();
  },

  methods: {
    /**
     * 上线
     */
    onlineHandler(row) {
      this.loading = true;
      this.$axios.post(`${this.$apis.transparentProxyOnline}/${row.ID}`).then(res => {
        this.loading = false;
        this.$message.success('操作成功！');
        this.search();
      }).catch(err => {
        this.loading = false;
      });
    },

    /**
     * 下线
     */
    offlineHandler(row) {
      this.loading = true;
      this.$axios.post(`${this.$apis.transparentProxyOffline}/${row.ID}`).then(res => {
        this.loading = false;
        this.$message.success('操作成功！');
        this.search();
      }).catch(err => {
        this.loading = false;
      });
    },

    /**
     * 探测
     */
    probeHandler(row) {
      this.loading = true;
      this.$axios.get(`${this.$apis.transparentProxyProbe}/${row.ID}`).then(res => {
        this.loading = false;
        this.$message.success('连接正常！');
        this.search();
      }).catch(err => {
        this.loading = false;
        this.search();
      });
    },
  }
}
</script>