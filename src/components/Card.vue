<template>
  <div class="card">
    <div class="card-title" v-if="!!title">{{ title }}</div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  name: 'Card'
}
</script>

<style scoped lang="less">
@import "../assets/style/var";

.card {
  margin-bottom: 20px;
  box-sizing: border-box;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  border-radius: 2px;

  .card-title {
    padding: 16px 20px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 500;
    color: @--color-text-primary;
    border-bottom: 1px solid #E9E9E9;
  }

  .card-body {
    padding: 20px;
  }

}

.card + .card {
  margin-bottom: 0px;
}
</style>
