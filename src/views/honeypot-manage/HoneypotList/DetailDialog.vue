<template>
  <el-dialog title="蜜罐详情" visible width="600px" :close-on-click-modal="false" :before-close="close">
    <el-table :data="tableData" width="100%" :border="false">
      <el-table-column label="key" prop="key"></el-table-column>
      <el-table-column label="value" prop="value"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailData: Object
  },

  computed: {
    tableData() {
      return Object.keys(this.detailData).map(key => ({
        key,
        value: this.detailData[key]
      }));
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