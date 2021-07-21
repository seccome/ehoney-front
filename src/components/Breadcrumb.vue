<template>
  <div class="breadcrumb-box">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span class="no-redirect" v-if="index === levelList.length-1">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      this.getBreadcrumb(route)
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      this.levelList = matched.filter(item => item.meta && item.meta.title)
    },
    handleLink(item) {
      const { name } = item
      this.$router.push({
        name,
        params: this.$route.params
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../assets/style/var";

.breadcrumb-box {
  padding: 16px 20px 0px 20px;
  height: 36px;
  background: @--background-color-base;
}
</style>
