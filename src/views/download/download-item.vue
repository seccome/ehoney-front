<template>
  <div class="download-item">
    <el-card shadow="hover" @click.native="download('/agent/download')">
      <img src="@/assets/images/download.svg"/>
      <p>安装到Linux探针服务器实现探针上线</p>
      <el-button type="primary">下载 Linux Agent</el-button>
    </el-card>

    <el-card shadow="hover" @click.native="download('/agent/downloadwin')">
      <img src="@/assets/images/download.svg"/>
      <p>安装到Window探针服务器实现探针上线</p>
      <el-button type="primary">下载 Windows Agent</el-button>
    </el-card>
  </div>
</template>

<script>
import env from '@/env.config.js'
export default {
  methods: {
    async download(url) {
      const ele = document.createElement('a')
      const base = env[window.__env__ || 'default'].VUE_APP_API_URL
      ele.href=`${base}${url}`
      ele.target = '_blank'
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    }
  }
}
</script>

<style lang="less">
.download-item {
  display: flex;
  width: 620px;
  height: 200px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    border: 1px solid #E7E7E7;
    cursor: pointer;
    text-align: center;
    margin-right: 8px;
    &:hover {
      background: #F8FAFD;
    }
    img {
      width: 43px;
      // height: 31px;
      margin-top: 28px;
    }
    p{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin: 20px 0;
    }
  }
}
</style>
