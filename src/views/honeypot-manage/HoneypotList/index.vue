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
          <el-table-column label="蜜罐名称" prop="HoneypotName"></el-table-column>
          <el-table-column label="协议类型" prop="ServerType"></el-table-column>
          <el-table-column label="蜜罐 IP" prop="HoneypotIP" show-overflow-tooltip></el-table-column>
          <el-table-column label="蜜网 IP" prop="ServerIP" show-overflow-tooltip>
            <template v-slot="{row}">
              <div v-for="(item,index) in (row.ServerIP || '').split(',')" :key="index">{{item}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80px" show-overflow-tooltip>
            <template v-slot="{row}">
              <i class="el-icon-loading  mr-1" v-if="row.Status === 1"></i>
              <span v-if="statusMap[row.Status]" :class="statusMap[row.Status].color">{{statusMap[row.Status].text}}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="Creator" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="CreateTime" width="220px" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="170">
            <!-- <div slot-scope="scope">
              <el-button type="text" @click="handleClickBtn(2,scope.row)">密签列表</el-button>
              <el-button type="text" @click="handleClickBtn(3,scope.row)">诱饵列表</el-button>
              <el-button type="text" v-if="scope.row.status  === 1" @click="deletepod(scope.row)">下线</el-button>
              <el-button type="text" v-if="scope.row.status !== 2" @click="podStatusCheck(scope.row)">网络探测</el-button>
            </div> -->
            <template v-slot="{row}">
              <template v-if="row.Status===3">
                <el-button type="primary" size="mini" icon="el-icon-view" circle @click="showDetail(row)"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row, 'HoneypotName')"></el-button>
                <el-tooltip content="密签列表" placement="bottom">
                  <el-button type="primary" size="mini" icon="esign-icon-General-2-49-copy" circle @click.native="showTokenDialog(row)"></el-button>
                </el-tooltip>
                <el-tooltip content="诱饵列表" placement="bottom">
                  <el-button type="primary" size="mini" icon="esign-icon-icon-test" circle @click.native="showBaitDialog(row)"></el-button>
                </el-tooltip>
                <!-- <el-dropdown class="ml-2">
                  <el-button type="info" size="mini" icon="el-icon-more" circle></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="showTokenDialog(row)">密签列表</el-dropdown-item>
                    <el-dropdown-item @click.native="showBaitDialog(row)">诱饵列表</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </template>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
    <!-- 新增弹窗 -->
    <AddDialog v-if="isShowAddDialog" :imageAddressOptions="imageAddressOptions" @close="isShowAddDialog=false" @save="search" />
    <!-- 详情弹窗 -->
    <DetailDialog v-if="detailDialogCtrl.isShow" :detailData="detailDialogCtrl.data" @close="detailDialogCtrl.isShow=false" />
    <!-- 诱饵列表 -->
    <BaitListDialog v-if="baitListDialogCtrl.isShow" :ServerID="baitListDialogCtrl.id" @close="baitListDialogCtrl.isShow=false" />
    <!-- 蜜签列表 -->
    <TokenListDialog v-if="tokenListDialogCtrl.isShow" :ServerID="tokenListDialogCtrl.id" @close="tokenListDialogCtrl.isShow=false" />
  </PageContent>
</template>

<script>
import AddDialog from './AddDialog.vue';
import DetailDialog from './DetailDialog.vue';
import BaitListDialog from './BaitListDialog.vue';
import TokenListDialog from './TokenListDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: {
    AddDialog,
    DetailDialog,
    BaitListDialog,
    TokenListDialog
  },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.honeypotSearch,
      apiUrl: this.$apis.honeypotCreate,
      isShowAddDialog: false,
      detailDialogCtrl: {
        isShow: false,
        data: {}
      },
      // 镜像下拉选择项
      imageAddressOptions: [],
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
    this.getImageAddressOptions();
    this.intervalRefresh();
  },
  methods: {
    /**
     * 获取镜像下拉
     */
    getImageAddressOptions () {
      this.$axios.get(this.$apis.getImagesPod).then(res => {
        this.imageAddressOptions = res.data;
      });
    },
    async podStatusCheck (record) {
      try {
        const res = await this.$Server('/testpodstatus', 'POST', {
          honeypotid: record.honeypotid
        })
        const { code, message } = res
        if (code === 1001) {
          record.statusText = '离线'
          this.$message.error(message)
        } else {
          this.$message.success(message)
        }
      } catch (e) {
        record.statusText = '离线'
      }
    },

    /**
     * 查看详情
     */
    showDetail (row) {
      this.loading = true
      this.$axios.get(`${this.$apis.honeypotCreate}/${row.ID}`).then(res => {
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
     * 显示蜜签列表弹窗
     */
    showTokenDialog ({ ID }) {
      this.tokenListDialogCtrl = {
        isShow: true,
        id: ID
      };
    },

    /**
     * 显示诱饵列表弹窗
     */
    showBaitDialog ({ ID }) {
      this.baitListDialogCtrl = {
        isShow: true,
        id: ID
      };
    }
  }
}
</script>

<style scoped>
</style>
