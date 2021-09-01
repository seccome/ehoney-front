<template>
  <div class="page-content">
    <div class="content">
      <div class="page-form-box is-card" v-if="$slots.form">
        <slot name="form" class="page-form"></slot>
      </div>
      <div class="page-main-box is-card">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageContent'
}
</script>

<style scoped lang="less">
@import "../../assets/style/var";

.is-card {
  box-sizing: border-box;
  padding: 10px;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
}

.page-content {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .content {
    box-sizing: border-box;
    padding: 8px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: @--background-color-base;

    .page-form-box {
      position: relative;
      margin-bottom: 10px;
      flex: 0 0 auto;
      display: flex;
    }

    .page-main-box {
      flex: 1;
      overflow: hidden;
    }

    .page-form {
      position: relative;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      //.form-item + .form-item {
      //   margin-right: 20px;
      //}
      /deep/ .el-select, /deep/ .el-input {
        width: 160px;
      }

      .last-from-item {
        margin-right: 180px !important;
      }

      .btn-box {
        position: absolute;
        right: 0px;
        bottom: 5px;

        .el-button + .el-button {
          margin-left: 16px;
        }
      }
    }

    .page-main {
      flex: 1;
      display: flex;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
