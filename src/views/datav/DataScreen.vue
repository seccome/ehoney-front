<template>
  <div class="data-screen">
    <div class="screen-t">
      <div class="screen-t-l"></div>
      <div class="screen-t-stretch-l"></div>
      <div class="screen-t-m"></div>
      <div class="screen-t-stretch-r"></div>
      <div class="screen-t-r"></div>
    </div>
    <div class="screen-item screen-l"></div>
    <div class="screen-item screen-r"></div>
    <div class="data-main-box">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataScreen'
}
</script>

<style scoped lang="less">
.data-screen {
  width: 100%;
  height: 100%;
  min-height: 900px;
  position: relative;
  background: url("./imges/bg-img.png") repeat;

  .screen-item {
    position: absolute;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .screen-t {
    position: absolute;
    z-index: 10;
    top: 0px;
    left: 0px;
    display: flex;
    width: 100%;
    height: 120px;

    .screen-t-l, .screen-t-r {
      flex: 0 0 10px;
      width: 10px;
      height: 120px;
      background-image: url("./imges/img-4.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }

    .screen-t-m {
      flex: 0 0 1160px;
      width: 1160px;
      height: 120px;
      background: url("./imges/img-5.png") no-repeat;
      background-size: 100% 100%;
    }

    .screen-t-stretch-l, .screen-t-stretch-r {
      flex: 1;
      height: 100%;
      background: url("./imges/img-3.png") repeat-x;
      background-size: 100% 100%;
    }

    //.screen-t-stretch-r {
    //  flex: 1;
    //  height: 100%;
    //  background-size: 100% 100%;
    //  background: url("./imges/img-7.png") repeat-x;
    //}

    .screen-t-r {
      transform: rotateY(180deg);
    }

  }

  .screen-l {
    z-index: 20;
    top: 22px;
    left: 28px;
    bottom: 22px;
    width: 122px;
    //height: 100%;
    background-image: url("imges/img-6.png");
  }

  .screen-r {
    z-index: 20;
    top: 22px;
    right: 28px;
    bottom: 22px;
    width: 122px;
    transform: rotateY(180deg);
    //height: 100%;
    background-image: url("imges/img-6.png");
  }

  .data-main-box {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 40;
  }
}
</style>
