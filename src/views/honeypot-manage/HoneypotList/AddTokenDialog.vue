<template>
  <el-dialog title="新建蜜罐密签" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="密签" prop="TokenName">
        <div class="flex-left">
          <el-select v-model="form.TokenName">
            <el-option v-for="item in tokenOptions" :key="item.TokenName" :label="item.TokenName" :value="item.TokenName" />
          </el-select>
          <el-link type="primary" class="form-item-link" @click.native="$router.push({name: 'sign'})">创建密签</el-link>
        </div>
      </el-form-item>
      <el-form-item label="部署路径" prop="DeployPath">
        <el-input v-model="form.DeployPath" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm" :loading="loading">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    honeypotID: ''
  },
  data () {
    return {
      loading: false,
      form: {
        HoneypotID: this.honeypotID,
        TokenName: '',
        DeployPath: '',
      },
      rules: {
        TokenName: [{ required: true, message: '请选择密签', trigger: 'blur' }],
        DeployPath: [{ required: true, message: '请输入部署路径', trigger: 'blur' }],
      },
      tokenOptions: []
    }
  },

  created () {
    this.getTokenOptions();
  },

  methods: {
    /**
     * 获取新增弹出里，密签名称下拉选项
     */
    async getTokenOptions () {
      if (!this.$parent.tokenOptions) {
        let { data } = await this.$axios.post(this.$apis.signSearch, {
          PageNumber: 1,
          PageSize: 9999
        });
        this.$parent.tokenOptions = data.List || [];
      }
      this.tokenOptions = this.$parent.tokenOptions;
    },
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
    save () {
      this.loading = true;
      this.$axios.post(this.$apis.tokenHoneypotCreate, this.form).then(res => {
        this.loading = false;
        this.$message.success('新建成功！');
        this.$emit('save');
        this.close();
      }).catch(() => {
        this.loading = false;
      });
    },

    /**
     * 关闭弹窗
     */
    close () {
      this.$emit('close');
    }
  }
}
</script>