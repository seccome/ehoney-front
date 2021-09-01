<template>
  <el-dialog title="反制信息" visible width="600px" :close-on-click-modal="false" :before-close="close">
    <el-table :data="tableData" width="100%" :border="false">
      <el-table-column label="key" prop="key"></el-table-column>
      <el-table-column label="value" prop="value"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-pagination layout="prev, pager, next" :current-page.sync="currentPage" :page-count="CounterInfo.length" />
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    CounterInfo: Array
  },

  data () {
    return {
      currentPage: 3
    }
  },

  computed: {
    tableData() {
      let currentData = this.CounterInfo[this.currentPage - 1];
      currentData = JSON.parse(currentData);
      return Object.keys(currentData).map(key => ({
        key,
        value: currentData[key]
      }))
    }
  },

  methods: {
    /**
     * 关闭弹窗
     */
    close () {
      this.$emit('close');
    }
  }
}
</script>