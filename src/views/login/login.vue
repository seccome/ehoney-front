<template>
  <div class="login-page">
    <div class="logo"></div>
    <div class="login-wrapper">
      <div class="title">欺骗防御系统</div>
      <el-form v-if="isShowLogin" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item label="" prop="username">
          <el-input v-model="loginForm.username" size="medium" prefix-icon="el-icon-message" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" :type="showNewPwd?'text':'password'" size="medium" prefix-icon="el-icon-lock" placeholder="请输入密码" @keyup.native.enter="submit">
            <template slot="suffix">
              <i v-if="showNewPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showNewPwd=false"></i>
              <i v-else class="el-icon-view" style="cursor:pointer" @click="showNewPwd=true"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="mb-2">
          <el-button type="primary" size="small" class="btn-block" @click="submit" :loading="loading">登 录</el-button>
        </el-form-item>
        <el-form-item class="ma-0">
          <el-button type="success" size="small" class="btn-block" @click="isShowLogin=false">注 册</el-button>
        </el-form-item>
      </el-form>
      <Register v-else @showLogin="isShowLogin=true" @loginSuccess="loginSuccess" />
    </div>
    <div class="copyright">
      Copyright ©{{ new Date().getFullYear() }} Seccome 团队 版权所有
    </div>
  </div>
</template>

<script>
import Register from './Register';

export default {
  name: 'login',
  components: { Register },
  data () {
    // const RegexPhone = /^(0|86|17951)?1[0-9]{10}$/
    // const RegEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    const checkusername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账号'))
      }

      // if (!RegexPhone.test(value) && !RegEmail.test(value)) {
      //   return callback(new Error('请输入正确的手机号码／邮箱'))
      // }
      callback()
    }

    const checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入密码'))
      }

      callback()
    }
    return {
      loading: false,
      isShowLogin: true,
      showNewPwd: false,
      loginRules: {
        username: [
          { validator: checkusername, trigger: 'blur' }
        ],
        password: [
          { validator: checkPass, trigger: 'blur' }
        ]
      },
      loginForm: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    async submit () {
      await this.$refs.loginFormRef.validate()
      this.loading = true;
      this.$axios.post(this.$apis.login, this.loginForm).then(res => {
        this.loading = false;
        this.loginSuccess(res);
      }).catch(err => {
        this.loading = false;
      });
    },

    /**
     * 登录成功处理
     */
    loginSuccess (res) {
      localStorage.setItem('userName', res.data.name);
      localStorage.setItem('token', res.data.token);
      this.$router.push('/');
    }
  },

}
</script>

<style scoped lang="less">
.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #1c1c1c;
  background: url('./login_bg.png') no-repeat;
  background-size: cover;

  .login-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 24px;
    width: 400px;
    height: 420px;
    border-radius: 2px;
    background: #ffffff;
    transform: translateX(-50%) translateY(-50%);

    .title {
      margin-top: 24px;
      margin-bottom: 40px;
      text-align: center;
      line-height: 33px;
      font-size: 24px;
      font-weight: 500;
      color: #333333;
    }

    /deep/ .el-input__inner {
      //letter-spacing: 1px;
      height: 40px;
      line-height: 40;
      font-size: 14px;
    }

    .el-form-item {
      margin-bottom: 24px;
    }

    .el-form-item:last-child {
      margin-top: 32px;
    }
  }

  .copyright {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    color: #dddddd;
    font-size: 12px;
  }

  .logo {
    position: absolute;
    top: 57px;
    left: 72px;
    width: 100%;
    height: 57px;
    background: url('../../assets/logo_ehoney_white.svg') no-repeat;
    background-size: 120px 32px;
    background-position: left 18px center;
  }
}
</style>
