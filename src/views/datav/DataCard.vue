<template>
  <div class="data-card" :class="{'isVery-card': isVery}">
    <div class="card-main">
      <div class="card-title" v-if="this.title">
        <div class="card-title-icon"></div>
        <div class="card-title-icon"></div>
        <span>{{ title }}</span>
      </div>
      <div class="card-main-box">
        <slot></slot>
      </div>
    </div>
    <i class="corner corner-a" :class="isVery ? ['corner-isVery corner-isVery-a'] :''"></i>
    <i class="corner corner-b" :class="isVery ? ['corner-isVery corner-isVery-b'] :''"></i>
    <i class="corner corner-c" :class="isVery ? ['corner-isVery corner-isVery-c'] :''"></i>
    <i class="corner corner-d" :class="isVery ? ['corner-isVery corner-isVery-d'] :''"></i>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    isVery: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
.data-card {
  height: 100%;
  position: relative;
  background: rgba(0, 88, 255, 0.1);
  box-shadow: inset 0px 0px 40px 0px rgba(235, 243, 255, 0.08);

  .card-main {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 30;
    display: flex;
    flex-direction: column;
    padding: 20px 30px;

    .card-title {
      flex: 0 0 26px;
      line-height: 26px;
      font-size: 18px;
      font-weight: 500;
      color: #AFDEFF;

      .card-title-icon {
        margin-right: 6px;
        display: inline-block;
        width: 4px;
        height: 12px;
        background: #AFDEFF;
      }
    }

    .card-main-box {
      flex: 1;
    }
  }

  .corner {
    display: block;
    position: absolute;
    z-index: 10;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url("./imges/img-1.png");
  }

  .corner-a {
    top: -2px;
    left: -5px;
    width: 23px;
    height: 60px;
    background-image: url("./imges/img-2.png");
  }

  .corner-b {
    top: -2px;
    right: -3px;
  }

  .corner-c {
    bottom: -2px;
    right: -3px;
    transform: rotate(90deg);
  }

  .corner-d {
    bottom: -2px;
    left: -3px;
    transform: rotate(180deg);
  }

  .corner-isVery {
    width: 41px;
    height: 41px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url("./imges/img-8.png");
  }

  .corner-isVery-a {
    transform: rotate(0deg);
    left: -2px;
  }

  .corner-isVery-b {
    transform: rotate(90deg);
    right: -2px;
  }

  .corner-isVery-c {
    transform: rotate(180deg);
    right: -2px;
  }

  .corner-isVery-d {
    transform: rotate(270deg);
    left: -2px;
  }
}

.isVery-card {
  border: 2px solid #4572ED;

  .card-main-box {
    overflow: hidden;
  }
}
</style>
