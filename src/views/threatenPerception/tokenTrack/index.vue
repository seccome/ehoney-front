<template>
  <PageContent v-loading="loading">
    <div slot="form" class="page-form">
      <form-item label="查询内容">
        <el-input placeholder="请输入查询内容" v-model="searchParams.Payload" clearable @keyup.enter.native="search"></el-input>
      </form-item>
      <form-item label="服务类型">
        <el-select placeholder="请选择服务类型" v-model="searchParams.ServerType" clearable>
          <el-option v-for="item in ServiceTypeOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </form-item>
      <form-item label="攻击IP">
        <el-input placeholder="请输入攻击IP" v-model="searchParams.AttackIP" clearable @keyup.enter.native="search"></el-input>
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
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false">
          <el-table-column label="密签名称" prop="TokenName"></el-table-column>
          <el-table-column label="密签类型" prop="TokenType"></el-table-column>
          <el-table-column label="攻击IP" prop="OpenIP"></el-table-column>
          <el-table-column label="攻击时间" prop="OpenTime"></el-table-column>
          <el-table-column label="攻击位置" prop="Location"></el-table-column>
          <el-table-column label="用户UA" prop="UserAgent"></el-table-column>
          <!-- <el-table-column label="操作" width="50px">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" icon="el-icon-view" circle></el-button>
            </template>
          </el-table-column> -->
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159" />
          </div>
        </el-table>
        <Pagination slot="pagination" @size-change="sizeChange" @current-change="getTableData" :total="pagination.totalCount" :pageSize="pagination.size" :current-page.sync="pagination.page" />
      </ListLayout>
    </div>
  </PageContent>
</template>

<script>
import pageList from '@/mixins/pageList';
import {ServiceTypeOptions} from '@/lib/config';

export default {
  mixins: [pageList],
  data () {
    return {
      searchUrl: this.$apis.tokenTracktSearch,
      // 查询条件
      searchParams: {
        Payload: '',
        ServerType: '',
        AttackIP: '',
        dateRange: []
      },
      // 服务类型下拉选项
      ServiceTypeOptions
    }
  },

  created() {
    this.search();
  },

  methods: {
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
        ServerType: this.searchParams.ServerType,
        AttackIP: this.searchParams.AttackIP,
        StartTime,
        EndTime
      }
    },
  }
}
</script>