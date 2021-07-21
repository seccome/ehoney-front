<template>
  <div class="base">
    <Sidebar/>
    <div class="app-main">
      <Navbar></Navbar>
      <div class="view-box">
        <router-view class="page-view"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'

export default {
  name: 'Base',
  components: {
    Navbar,
    Sidebar
  }
}
</script>
<style scoped lang="less">
.base {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .app-main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .view-box {
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .page-view {
    flex: 1 1 auto;
    width: 100%;
    min-width: 1100px;
    height: 100%;
    min-height: 550px;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 1260px) {
  .app-main {
    flex: 1 1 1260px;
    width: 1260px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
  }
}

</style>
