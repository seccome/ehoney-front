<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="告警类型">
        <el-select placeholder="请输入告警类型" v-model="searchParams.Type">
          <el-option v-for="item in TypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </form-item>
      <form-item label="蜜罐IP">
        <el-input placeholder="请输入蜜罐IP" v-model="searchParams.HoneypotIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="攻击IP">
        <el-input placeholder="请输入攻击IP" v-model="searchParams.AttackIP" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="协议类型">
        <el-input placeholder="请输入协议类型" v-model="searchParams.ProtocolType" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="攻击时间">
        <el-date-picker v-model="searchParams.dateRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" />
      </form-item>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="search">查询</el-button>
        <el-button size="small" @click="resetParams">重置</el-button>
      </div>
    </div>
    <div class="page-main" style="display:block;overflow:auto">
        <el-card shadow="never" class="my-3 mr-2" v-for="(item,index) in tableData" :key="index">
          <el-row>
            <el-col :span="4">
              <span class="desc-field">告警类型: </span>{{ item.Type}}
            </el-col>
            <el-col :span="5">
              <span class="desc-field">蜜罐IP: </span><span style="font-weight: bold">{{ item.HoneypotIP}}</span>
            </el-col>
            <el-col :span="5">
              <span class="desc-field">攻击IP: </span><span style="font-weight: bold">{{ item.AttackIP}}</span>
            </el-col>
            <el-col :span="4">
              <span class="desc-field">协议类型: </span>{{ item.ProtocolType}}
            </el-col>
            <el-col :span="6">
              <span class="desc-field">攻击时间: </span>{{ item.Time}}
            </el-col>
            <el-col :span="24" class="mt-1">
              <span class="desc-field">日志: </span>{{ item.Log}}<a class="primary--text ml-2" style="cursor: pointer;" @click="showDetail(item)">查看详情</a>
            </el-col>
          </el-row>
        </el-card>
      <!-- <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="告警类型" prop="Type"></el-table-column>
          <el-table-column label="攻击时间" prop="Time"></el-table-column>
          <el-table-column label="蜜罐IP" prop="HoneypotIP"></el-table-column>
          <el-table-column label="攻击IP" prop="AttackIP"></el-table-column>
          <el-table-column label="协议类型" prop="ProtocolType"></el-table-column>
          <el-table-column label="日志" prop="Log"></el-table-column>
          <el-table-column label="操作" width="50px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-view" circle @click="showDetail(row)"></el-button>
            </template>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
      </ListLayout> -->
    </div>
    <!-- 详情弹窗 -->
    <DetailDialog v-if="detailDialogCtrl.isShow" :detailData="detailDialogCtrl.data" @close="detailDialogCtrl.isShow=false" />
  </PageContent>
</template>

<script>
import DetailDialog from './DetailDialog.vue';
import pageList from '@/mixins/pageList';

export default {
  components: { DetailDialog },

  mixins: [pageList],

  data () {
    return {
      searchUrl: this.$apis.trafficAttackSearch,
      searchParams: {
        Payload: '',
        Type: '',
        HoneypotIP: '',
        AttackIP: '',
        ProtocolType: '',
        dateRange: []
      },
      TypeOptions: ['Falco事件', '攻击事件'],
      // 上一次滚动条到底部的距离
      prevScrollTop: 0,
      // 已经加载完所有数据
      isEnd: false,
      detailDialogCtrl: {
        isShow: false,
        data: {}
      },
    }
  },

  created () {
    this.search();
  },

  mounted () {
    // let container = this.$el.querySelector('.el-table__body-wrapper');
    let container = this.$el.querySelector('.page-main');
    container.addEventListener('scroll', this.onScroll);
  },

  methods: {
    /**
     * 滚动事件
     */
    onScroll ({ target }) {
      // 已经加载完所有数据不再加载
      if (this.isEnd) return false;
      let scrollTop = target.scrollTop;
      // 如果本次滚动条到底部距离，小于上一次。就是往上滚动，不加载数据
      if (scrollTop < this.prevScrollTop) {
        this.prevScrollTop = scrollTop;
      } else {
        this.prevScrollTop = scrollTop;
        if (this.loading) return false;
        if ((target.scrollTop + target.clientHeight) > (target.scrollHeight - 10)) {
          this.loading = true;
          setTimeout(() => {
            this.getTableData();
          }, 100)
        }
      }
    },

    search () {
      this.isEnd = false;
      this.pagination.page = 1;
      this.tableData = [];
      this.getTableData();
    },

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
        Type: this.searchParams.Type,
        HoneypotIP: this.searchParams.HoneypotIP,
        AttackIP: this.searchParams.AttackIP,
        ProtocolType: this.searchParams.ProtocolType,
        StartTime,
        EndTime
      }
    },

    getTableData () {
      this.loading = true;
      this.$axios.post(this.$apis.traceSourceSearch, {
        ...this.getSearchParams(),
        PageNumber: this.pagination.page,
        PageSize: 50
      }).then(({ data }) => {
        this.loading = false;
        let copyData = data.List || [];
        if (copyData.length > 0) {
          ++this.pagination.page;
          this.tableData.push(...copyData);
        } else {
          this.isEnd = true;
        }
      }).catch(err => {
        this.loading = false;
      });
    },

    /**
     * 查看详情
     */
    showDetail ({ Detail }) {
      let data = {};
      if (Detail) {
        data = JSON.parse(Detail);
      }
      this.detailDialogCtrl = {
        isShow: true,
        data
      }
    },

  }
}
</script>

<style lang="less" scoped>
/deep/ .el-card__body{
  padding: 10px;
  font-size: 13px;
  line-height: 1.6em;
  .desc-field {
    font-weight: 500;
    color: #666;
  }
}
</style>