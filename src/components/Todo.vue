<template>
  <div class="todo">
    <div class="todo-content">
      <img src="@/assets/images/empty.png"/>
      <p>敬请期待...</p>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  }
}
</script>

<style scoped lang="less">
@import "@/assets/style/var";

.todo {
  padding: 20px;
  background: @--background-color-base;
  width: 100%;
  height: 100%;
  &-content {
    width: 100%;
    height: 100%;
    padding-top: 100px;
    text-align: center;
    background: #fff;
  }
}

</style>
