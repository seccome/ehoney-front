<template>
  <div class="track-detail-wrapper">
    <div class="track-detail-wrapper-tab-box">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane label="列表信息" name="list"></el-tab-pane>
        <el-tab-pane label="足迹信息" name="path"></el-tab-pane>
      </el-tabs>
    </div>
    <router-view class="track-detail-wrapper-view"></router-view>
  </div>
</template>

<script>
export default {
  name: 'TrackDetailWrapper',
  data() {
    return {
      activeName: 'list'
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        console.log('________', route)
        const { fullPath } = route

        if (fullPath.endsWith('list')) {
          this.activeName = 'list'
        }

        if (fullPath.endsWith('path')) {
          this.activeName = 'path'
        }
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
      this.$router.push({
        path: this.activeName
      })
    }
  }
}
</script>

<style scoped lang="less">
@import url('../../assets/style/var');

.track-detail-wrapper {
  background-color: @--background-color-base;
}

.track-detail-wrapper-tab-box {
  margin: 20px;
  margin-bottom: 0px;
  padding: 20px;
  padding-bottom: 0px;
  background: #ffffff;
}

.track-detail-wrapper-view {
  /deep/ .content {
    padding-top: 0px;
  }
}
</style>
