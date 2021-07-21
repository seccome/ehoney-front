<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c1c1c1;
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  background-color: #f1f1f1;
}

</style>
