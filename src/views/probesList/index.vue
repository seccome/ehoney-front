<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="探针名称" prop="HostName"></el-table-column>
          <el-table-column label="探针IP" prop="ProbeIP">
            <template v-slot="{row}">
              <div v-for="(item,index) in (row.ProbeIP || '').split(',')" :key="index">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="系统类型" prop="SystemType"></el-table-column>
          <el-table-column label="注册时间" prop="CreateTime"></el-table-column>
          <el-table-column label="心跳时间" prop="HeartbeatTime"></el-table-column>
          <el-table-column label="探针状态">
            <template v-slot="{row}">
              <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <!-- <template v-slot="{row}" v-if="row.Status===3"> -->
            <template v-slot="{row}">
              <el-tooltip content="密签列表" placement="bottom">
                <el-button type="primary" size="mini" icon="esign-icon-General-2-49-copy" circle @click.native="showTokenDialog(row)"></el-button>
              </el-tooltip>
              <el-tooltip content="诱饵列表" placement="bottom">
                <el-button type="primary" size="mini" icon="esign-icon-icon-test" circle @click.native="showBaitDialog(row)"></el-button>
              </el-tooltip>
              <!-- <el-dropdown>
                <el-button type="info" size="mini" icon="el-icon-more" circle></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="showTokenDialog(row)">密签列表</el-dropdown-item>
                  <el-dropdown-item @click.native="showBaitDialog(row)">诱饵列表</el-dropdown-item>
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
    <!-- 诱饵列表 -->
    <BaitListDialog v-if="baitListDialogCtrl.isShow" :ServerID="baitListDialogCtrl.id" @close="baitListDialogCtrl.isShow=false" />
    <!-- 蜜签列表 -->
    <TokenListDialog v-if="tokenListDialogCtrl.isShow" :ServerID="tokenListDialogCtrl.id" @close="tokenListDialogCtrl.isShow=false" />
  </PageContent>
</template>

<script>
import BaitListDialog from './BaitListDialog.vue';
import TokenListDialog from './TokenListDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { 
    BaitListDialog,
    TokenListDialog
  },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.probeListSearch,
      // 蜜签列表弹窗
      tokenListDialogCtrl: {
        isShow: false,
        id: ''
      },
      // 诱饵列表弹窗
      baitListDialogCtrl: {
        isShow: false,
        id: ''
      }
    }
  },

  created () {
    this.search();
  },

  methods: {
    /**
     * 编辑镜像
     */
    editRow (row) {
      this.editDialogCtrl = {
        isShow: true,
        data: { ...row }
      }
    },

    /**
     * 显示蜜签列表弹窗
     */
    showTokenDialog({ID}) {
      this.tokenListDialogCtrl = {
        isShow: true,
        id: ID
      };
    },

    /**
     * 显示诱饵列表弹窗
     */
    showBaitDialog({ID}) {
      this.baitListDialogCtrl = {
        isShow: true,
        id: ID
      };
    }
  }
}
</script>