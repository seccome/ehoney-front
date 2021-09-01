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
          <el-table-column label="密网IP" prop="ServerIP" width="160px">
            <template v-slot="{row}">
              <div v-for="(item,index) in (row.ServerIP || '').split(',')" :key="index">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="转发端口" prop="ProxyPort"></el-table-column>
          <el-table-column label="蜜罐服务" prop="ServerType"></el-table-column>
          <el-table-column label="蜜罐IP" prop="HoneypotIP"></el-table-column>
          <el-table-column label="蜜罐端口" prop="ServerPort"></el-table-column>

          <el-table-column label="状态" width="100px" show-overflow-tooltip>
            <template v-slot="{row}">
              <i class="el-icon-loading warning--text mr-1" v-if="row.Status === 1"></i>
              <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="Creator"></el-table-column>
          <el-table-column label="创建时间" prop="CreateTime" width="180px"></el-table-column>
          <el-table-column label="操作" width="170px">
            <template v-slot="{row}">
              <el-tooltip class="item" effect="dark" content="透明转发列表" placement="bottom">
                <el-button type="primary" size="mini" icon="el-icon-tickets" circle @click="showTransformDialog(row)"></el-button>
              </el-tooltip>
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
              <!-- <el-dropdown class="ml-2">
                <el-button type="info" size="mini" icon="el-icon-more" circle></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="onlineHandler(row)">上线</el-dropdown-item>
                  <el-dropdown-item @click.native="offlineHandler(row)">下线</el-dropdown-item>
                  <el-dropdown-item @click.native="probeHandler(row)">探测</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
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
    <AddDialog v-if="isShowAddDialog" :protocolTypeOptions="protocolTypeOptions" @close="isShowAddDialog=false" @save="search" />
    <!-- 透明转发列表 -->
    <TransparentListDialog v-if="transparentDialogCtrl.isShow" :dialogData="transparentDialogCtrl.data" @close="transparentDialogCtrl.isShow=false" @save="search" />
  </PageContent>
</template>

<script>
import pageList from '@/mixins/pageList';
import AddDialog from './AddDialog.vue';
import TransparentListDialog from './TransparentListDialog.vue';

export default {
  components: { 
    AddDialog,
    TransparentListDialog
  },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.protocolProxySearch,
      apiUrl: this.$apis.protocolProxyCreate,
      statusMap: {
        1: { text: '下发中', color: 'grey--text' },
        2: { text: '离线', color: 'red--text' },
        3: { text: '在线', color: 'green--text' }
      },
      // 新增弹窗转发协议下拉选项
      protocolTypeOptions: [],
      isShowAddDialog: false,
      transparentDialogCtrl: {
        isShow: false,
        data: {}
      },
      intervalTimer: 0
    }
  },

  created () {
    this.search();
    this.getProtocolTypeOptions();
    this.intervalRefresh();
  },

  methods: {
    /**
     * 获取 转发协议下拉选项
     */
    getProtocolTypeOptions () {
      this.$axios.post(this.$apis.protocolTypeSearch, {
        Payload: '',
        PageNumber: 1,
        PageSize: 999
      }).then(res => {
        this.protocolTypeOptions = res.data.List || [];
      })
    },

    /**
     * 显示透明转发列表
     */
    showTransformDialog(row) {
      this.transparentDialogCtrl = {
        isShow: true,
        data: row
      }
    },

    /**
     * 上线
     */
    onlineHandler(row) {
      this.loading = true;
      this.$axios.post(`${this.$apis.protocolProxyOnline}/${row.ID}`).then(res => {
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
      this.$axios.post(`${this.$apis.protocolProxyOffline}/${row.ID}`).then(res => {
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
      this.$axios.get(`${this.$apis.protocolProxyProbe}/${row.ID}`).then(res => {
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