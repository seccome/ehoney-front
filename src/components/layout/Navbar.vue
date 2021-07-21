<template>
  <div class="navbar">
    <div class="header f-clear">
      <div class="header-item go-logout f-right" @click="goLogout"><i class="esign-icon-kongzhitai"></i>登出
      </div>
      <div class="header-item go-datav f-right" @click="isShowRestpwdDialog=true"><i class="esign-icon-kongzhitai"></i>修改密码
      </div>
      <div class="header-item go-datav f-right" @click="goDatav"><i class="esign-icon-kongzhitai"></i>
        进入大屏
      </div>
      <div class="header-item go-datav f-right" @click="goDownload"><i class="esign-icon-bianzu21"></i>
        下载支持
      </div>
    </div>
    <Breadcrumb></Breadcrumb>
    <!-- 修改密码弹窗 -->
    <RestPwDialog v-if="isShowRestpwdDialog" @close="isShowRestpwdDialog=false" />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RestPwDialog from '@/components/RestPwDialog'

export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
    RestPwDialog
  },
  data() {
    return {
      isShowRestpwdDialog: false
    }
  },
  methods: {
    goDatav () {
      this.$router.push({
        path: '/datav'
      })
    },
    goDownload () {
      this.$router.push({
        path: '/download'
      })
    },
    async goLogout () {
      await this.$Server('/logout', 'get', {})

      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../assets/style/var';

.navbar {
  width: 100%;
  flex: 0 0 auto;

  .header {
    height: 57px;
    background: @--background-color-black;

    .header-item {
      cursor: pointer;
      user-select: none;
      width: 100px;
      height: 57px;
      margin-right: 20px;
      line-height: 57px;
      text-align: center;
      font-size: 12px;
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgba(4, 86, 254, 1);
      }

      .esign-icon-kongzhitai {
        margin-right: 6px;
      }
    }

    .go-logout {
      width: 60px;
      //margin-left: 10px;
    }
  }
}
</style>
