<template>
  <div class="download-page">
    <div class="download-page__content">
    <download-item></download-item>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'
import DownloadItem from './download-item'
export default {
  components: {
    Card,
    DownloadItem
  }
}
</script>

<style lang="less">
.download-page {
  background: #F5F6F8;
  padding: 20px;
  .download-item {
    margin: 40px;
  }
  &__content {
    background: #fff;
    min-height: 100%;
  }
}
</style>
