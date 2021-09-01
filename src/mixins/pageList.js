import {statusMap} from '@/lib/config.js';

export default {
  data () {
    return {
      // 状态枚举
      statusMap,
      // 请求中
      loading: false,
      // 列表查询url
      searchUrl: '',
      // 其他通用接口url
      apiUrl: '',
      // 查询条件
      searchParams: {
        Payload: ''
      },
      cloneParams: {},
      // 分页
      pagination: {
        page: 1,
        size: 10,
        totalCount: 0
      },
      // 列表数据
      tableData: [],
      // 定时刷新器
      intervalTimer: 0
    }
  },

  created() {
    this.cloneParams = {...this.searchParams};
  },

  destroyed() {
    clearInterval(this.intervalTimer);
  },

  methods: {
    /**
     * 定时刷新数据，获取最新状态
     */
    intervalRefresh() {
      this.intervalTimer = setInterval(() => {
        this.getTableData(false);
      }, 2000);
    },

    /**
     * 重置查询条件
     */
    resetParams() {
      this.searchParams = {...this.cloneParams};
    },

    /**
     * 每页条数改变
     * @param {Number} size 每页展示条数
     */
    sizeChange (size) {
      this.pagination.size = size;
      this.search();
    },

    /**
     * 查询
     */
    search () {
      this.pagination.page = 1;
      this.getTableData();
    },

    /**
     * 转换查询条件
     */
    getSearchParams() {
      return this.searchParams;
    },

    /**
     * 获取数据
     */
    getTableData (loading=true) {
      this.loading = loading;
      this.$axios.post(this.searchUrl, {
        ...this.getSearchParams(),
        PageNumber: this.pagination.page,
        PageSize: this.pagination.size
      }).then(({ data }) => {
        this.loading = false;
        this.tableData = data.List || [];
        this.pagination.totalCount = data.Count;
      }).catch(err => {
        this.loading = false;
      });
    },

    /**
     * 删除行
     * @param {Object} row 当前操作行数据
     * @param {String} confirmName 确认提示名称
     */
    deleteRow (row, confirmName) {
      this.$confirm(`确认删除 ${row[confirmName] || ''}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        return this.$axios.delete(`${this.apiUrl}/${row.ID}`);
      }).then(res => {
        this.search();
        this.$message.success('删除成功！');
      }).catch(err => {
        this.loading = false;
        console.log(err)
      });
    },

    /**
     * 下载密签
     */
     downloadFile({ID}) {
      this.$axios.get(`${this.apiUrl}/${ID}`).then(res => {
        window.open(res.data);
      })
    },

    /**
     * 关闭弹窗
     */
     close () {
      this.$emit('close');
    }
  }
}