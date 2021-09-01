<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
    <el-form-item prop="username">
      <el-input v-model="registerForm.username" size="medium" prefix-icon="el-icon-message" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="registerForm.password" :type="showNewPwd?'text':'password'" size="medium" prefix-icon="el-icon-lock" placeholder="请输入密码" @keyup.native.enter="submit">
        <template slot="suffix">
          <i v-if="showNewPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showNewPwd=false"></i>
          <i v-else class="el-icon-view" style="cursor:pointer" @click="showNewPwd=true"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="repeatPwd">
      <el-input v-model="registerForm.repeatPwd" :type="showRepeatPwd?'text':'password'" size="medium" prefix-icon="el-icon-lock" placeholder="请再次输入密码" @keyup.native.enter="submit">
        <template slot="suffix">
          <i v-if="showRepeatPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showRepeatPwd=false"></i>
          <i v-else class="el-icon-view" style="cursor:pointer" @click="showRepeatPwd=true"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="mb-2">
      <el-button type="success" class="btn-block" @click="submit" :loading="loading">立即注册</el-button>
    </el-form-item>
    <el-form-item class="ma-0">
      <el-button type="text" @click="$emit('showLogin')">已有账号，去登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { rules } from '@/lib/config';

export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位!'));
      } else if (!rules.pwdReg.test(value)) {
        callback(new Error(rules.pwdRegTip));
      } else {
        callback();
      }
    };

    var validateReptPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      loading: false,
      showNewPwd: false,
      showRepeatPwd: false,
      registerForm: {
        username: '',
        password: '',
        repeatPwd: '',
      },
      registerRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        repeatPwd: [{ required: true, validator: validateReptPass, trigger: 'blur' }]
      }
    }
  },

  methods: {
    submit () {
      this.$refs.registerForm.validate(valid => {
        if (!valid) return false;
        this.loading = true;
        this.$axios.post(this.$apis.register, this.registerForm).then(res => {
          this.loading = false;
          this.$emit('loginSuccess', res);
        }).catch(err => {
          this.loading = false;
        });
      });
    }
  }
}
</script>