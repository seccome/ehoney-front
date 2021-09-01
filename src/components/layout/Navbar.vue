<template>
  <div class="navbar">
    <div class="header f-clear">
      <el-dropdown class="f-right">
        <div class="header-item"><i class="el-icon-user-solid mr-1"></i>{{userName}}</div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="isShowRestpwdDialog=true"><i class="el-icon-edit-outline"></i>修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="goLogout"><i class="esign-icon-remove"></i>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="header-item f-right" @click="$router.push('/datav')"><i class="esign-icon-kongzhitai"></i>
        进入大屏
      </div>
      <div class="header-item f-right" @click="$router.push('/download')"><i class="esign-icon-bianzu21"></i>
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
  data () {
    return {
      isShowRestpwdDialog: false,
      userName: localStorage.userName
    }
  },
  methods: {
    goLogout () {
      window.localStorage.setItem('userName', null);
      window.localStorage.setItem('token', null);
      this.$router.push({ path: '/login' });
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
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
      height: 57px;
      margin-right: 20px;
      line-height: 57px;
      text-align: center;
      font-size: 12px;
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        // color: rgba(4, 86, 254, 1);
      }

      .esign-icon-kongzhitai {
        margin-right: 6px;
      }
    }
  }
}
</style>
