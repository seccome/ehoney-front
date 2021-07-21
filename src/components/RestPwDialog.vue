<template>
  <el-dialog title="修改密码" visible width="400px" :close-on-click-modal="false" :before-close="close" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="原始密码" prop="oldPwd">
        <el-input v-model="form.oldPwd" :type="showOldPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showOldPwd" class="el-icon-view" @click="showOldPwd=false"></i>
            <i v-else class="iconfont esign-icon-eye-close" @click="showOldPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="form.newPwd" :type="showNewPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showNewPwd" class="el-icon-view" @click="showNewPwd=false"></i>
            <i v-else class="iconfont esign-icon-eye-close" @click="showNewPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="repeatPwd">
        <el-input v-model="form.repeatPwd" :type="showRepeatPwd?'text':'password'">
          <template slot="suffix">
            <i v-if="showRepeatPwd" class="el-icon-view" @click="showRepeatPwd=false"></i>
            <i v-else class="iconfont esign-icon-eye-close" @click="showRepeatPwd=true"></i>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.newPwd) {
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
        oldPwd: '',
        newPwd: '',
        repeatPwd: '',
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        repeatPwd: [{ required: true, validator: validatePass, trigger: 'blur' }]
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
      this.$Server('/passwordupdate', 'POST', this.form).then(res => {
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