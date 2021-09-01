<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="攻击IP">
        <el-input placeholder="请输入攻击IP" v-model="searchParams.AttackIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="探针IP">
        <el-input placeholder="请输入探针IP" v-model="searchParams.ProbeIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="跳转IP">
        <el-input placeholder="请输入跳转IP" v-model="searchParams.JumpIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="蜜罐IP">
        <el-input placeholder="请输入蜜罐IP" v-model="searchParams.HoneypotIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="协议类型">
        <el-input placeholder="请输入协议类型" v-model="searchParams.ProtocolType" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="resetParams">重置</el-button>
      </div>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="攻击IP" prop="AttackIP"></el-table-column>
          <el-table-column label="探针IP" prop="ProbeIP"></el-table-column>
          <el-table-column label="跳转IP" prop="JumpIP"></el-table-column>
          <el-table-column label="蜜罐IP" prop="HoneypotIP"></el-table-column>
          <el-table-column label="协议类型" prop="ProtocolType"></el-table-column>
          <el-table-column label="攻击时间" prop="AttackTime"></el-table-column>
          <el-table-column label="攻击位置" prop="AttackLocation"></el-table-column>
          <el-table-column label="操作" width="100px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-view" circle @click="showDetail(row)"></el-button>
              <el-tooltip class="item" effect="dark" content="反制信息" placement="bottom">
                <el-button type="primary" size="mini" icon="el-icon-tickets" circle @click="showCounteractDialog(row)" :disabled="row.CounterInfo.length===0"></el-button>
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
    <!-- 详情弹窗 -->
    <DetailDialog v-if="detailDialogCtrl.isShow" :detailData="detailDialogCtrl.data" @close="detailDialogCtrl.isShow=false" />
    <!-- 反制信息弹窗 -->
    <CounteractDialog v-if="CounteractDialogCtrl.isShow" :CounterInfo="CounteractDialogCtrl.data" @close="CounteractDialogCtrl.isShow=false" />
  </PageContent>
</template>

<script>
import DetailDialog from './DetailDialog.vue';
import CounteractDialog from './CounteractDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { 
    DetailDialog,
    CounteractDialog
  },

  mixins: [pageList],
  data () {
    return {
      searchParams: {
        Payload: '',
        AttackIP: '',
        ProbeIP: '',
        JumpIP: '',
        HoneypotIP: '',
        ProtocolType: ''
      },
      searchUrl: this.$apis.trafficAttackSearch,
      detailDialogCtrl: {
        isShow: false,
        data: {}
      },
      // 反制信息弹窗
      CounteractDialogCtrl: {
        isShow: false,
        data: []
      },
    }
  },

  created () {
    this.search();
  },

  methods: {
    /**
     * 查看详情
     */
    showDetail ({ AttackDetail }) {
      let data = {};
      if (AttackDetail) {
        data = JSON.parse(AttackDetail);
      }
      this.detailDialogCtrl = {
        isShow: true,
        data
      }
    },

    /**
     * 显示反制信息弹窗
     */
    showCounteractDialog({CounterInfo}) {
      this.CounteractDialogCtrl = {
        isShow: true,
        data: CounterInfo
      };
    }
  }
}
</script>