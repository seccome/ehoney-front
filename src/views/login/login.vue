<template>
  <div class="login-page">
    <div class="logo"></div>
    <div class="login-wrapper">
      <div class="title">欺骗防御系统</div>
      <el-form
        :model="loginForm" :rules="loginRules" ref="loginFormRef" class="demo-ruleForm">
        <el-form-item label="" prop="account">
          <el-input v-model="loginForm.account"
            size="medium"
            prefix-icon="el-icon-message"
            placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password"
            type="password"
            size="medium"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            @keyup.enter="submit"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" class="login-btn" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="copyright">
      Copyright ©{{ new Date().getFullYear() }} Seccome 团队 版权所有
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    // const RegexPhone = /^(0|86|17951)?1[0-9]{10}$/
    // const RegEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    const checkAccount = (rule, value, callback) => {
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
      loginRules: {
        account: [
          { validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { validator: checkPass, trigger: 'blur' }
        ]
      },
      loginForm: {
        account: '',
        password: ''
      },
    }
  },
  methods: {
    async submit() {
      await this.$refs.loginFormRef.validate()

      const res = await this.$Server('/login', 'POST', {
        Username: this.loginForm.account,
        Password: this.loginForm.password,
      })
      const {code, data} = res
      if (res.code === 0) {
        const isFirstLogin = data === 1
        window.sessionStorage.setItem('isFirstLogin', isFirstLogin)
        window.sessionStorage.removeItem('visitedPage')
        this.$router.push('/')
      }

    },
    onEnterPress(e) {
      const code = e.keyCode || e.which
      if (code === 13) {
        this.submit()
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onEnterPress)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onEnterPress);
  }
}
</script>

<style scoped lang="less">
.login-page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #1c1c1c;
  background: url("./login_bg.png") no-repeat;
  background-size: cover;

  .login-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 24px;
    width: 400px;
    height: 360px;
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

    .login-btn {
      height: 48px;
      width: 100%;
      font-size: 16px;
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
    color: #DDDDDD;
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
