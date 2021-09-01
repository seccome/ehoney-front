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
          <el-table-column label="镜像名称" prop="ImageName"></el-table-column>
          <el-table-column label="镜像地址" prop="ImageAddress"></el-table-column>
          <el-table-column label="协议端口" prop="ImagePort" width="100"></el-table-column>
          <el-table-column label="协议类型" prop="ImageType" width="120"></el-table-column>
          <el-table-column label="操作" width="50">
            <template v-slot="{row}">
              <el-button v-if="!row.DefaultFlag" type="primary" size="mini" icon="el-icon-edit-outline" circle @click="editRow(row)"></el-button>
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
    <EditImageDialog v-if="editDialogCtrl.isShow" :dialogData="editDialogCtrl.data" :imageTypeOptions="imageTypeOptions" @close="editDialogCtrl.isShow=false" @save="search" />
  </PageContent>
</template>

<script>
import EditImageDialog from './EditImageDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { EditImageDialog },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.imageListSearch,
      apiUrl: this.$apis.trapCreate,
      // 镜像类型 下拉选项
      imageTypeOptions: [],
      editDialogCtrl: {
        isShow: false,
        data: null
      }
    }
  },


  created () {
    this.getImageTypeOptions();
    this.search();
  },

  methods: {
    /**
     * 获取 新增弹窗里 镜像类型 下拉选项
     */
    getImageTypeOptions () {
      this.$axios.get(this.$apis.getProtocolType).then(res => {
        this.imageTypeOptions = res.data;
      });
    },

    /**
     * 编辑镜像
     */
    editRow (row) {
      this.editDialogCtrl = {
        isShow: true,
        data: { ...row }
      }
    }
  }
}
</script>