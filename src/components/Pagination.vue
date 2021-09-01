<template>
  <div class="pagination-box">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="internalCurrentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
  },
  name: 'Pagination',
  data() {
    return {
      internalCurrentPage: 1,
    }
  },
  computed: {
    // internalCurrentPage() {
    //   return this.currentPage
    // }
  },
  watch: {
    currentPage: {
      immediate: true,
      handler(newVal) {
        this.internalCurrentPage = newVal
      }
    },
  },
  methods: {
    handleSizeChange() {
      this.$emit('size-change', ...arguments)
    },
    handleCurrentChange(newVal) {
      this.$emit('update:currentPage', newVal)
      this.$emit('current-change', ...arguments)
    },
  },
}
</script>

