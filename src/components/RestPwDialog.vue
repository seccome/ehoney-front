<template>
  <el-dialog title="修改密码" visible width="400px" :close-on-click-modal="false" :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="原始密码" prop="OldPassword">
        <el-input v-model="form.OldPassword" :type="showOldPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showOldPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showOldPwd=false"></i>
            <i v-else class="el-icon-view" style="cursor:pointer" @click="showOldPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="NewPassword">
        <el-input v-model="form.NewPassword" :type="showNewPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showNewPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showNewPwd=false"></i>
            <i v-else class="el-icon-view" style="cursor:pointer" @click="showNewPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="RepeatPassword">
        <el-input v-model="form.RepeatPassword" :type="showRepeatPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showRepeatPwd" class="iconfont esign-icon-hide" style="cursor:pointer" @click="showRepeatPwd=false"></i>
            <i v-else class="el-icon-view" style="cursor:pointer" @click="showRepeatPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm" :loading="loading">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {rules} from '@/lib/config';

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
      } else if (value !== this.form.NewPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      loading: false,
      showOldPwd: false,
      showNewPwd: false,
      showRepeatPwd: false,
      form: {
        OldPassword: '',
        NewPassword: '',
        RepeatPassword: '',
      },
      rules: {
        OldPassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        NewPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        RepeatPassword: [{ required: true, validator: validateReptPass, trigger: 'blur' }]
      }
    }
  },

  methods: {
    /**
     * 校验表单
     */
    validateForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.save();
        }
      });
    },

    /**
     * 保存接口请求
     */
    save() {
      this.loading = true;
      this.$axios.put(this.$apis.resetPwd, this.form).then(res => {
        this.loading = false;
        this.$message.success('修改成功！');
        this.close();
      }).catch(() => {
        this.loading = false;
      });
    },

    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('close');
    }
  }
}
</script>