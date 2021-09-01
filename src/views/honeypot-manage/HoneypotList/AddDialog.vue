<template>
  <el-dialog title="新建蜜罐" visible width="500px" :close-on-click-modal="false" :before-close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="蜜罐名称" prop="HoneypotName">
        <el-input v-model="form.HoneypotName" clearable></el-input>
      </el-form-item>
      <el-form-item label="镜像列表" prop="ImageAddress">
        <div class="flex-left">
          <el-select v-model="form.ImageAddress">
            <el-option v-for="item in imageAddressOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-link type="primary" class="form-item-link" @click.native="$router.push({name: 'imageList'})">镜像设置</el-link>
        </div>
        <el-alert title="只显示配置端口以及协议类型的镜像" type="warning" show-icon :closable="false" style="line-height: 20px;"></el-alert>
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
    imageAddressOptions: Array
  },
  data () {
    return {
      loading: false,
      form: {
        HoneypotName: '',
        ImageAddress: '',
      },
      rules: {
        HoneypotName: [{ required: true, message: '请输入蜜罐名称', trigger: 'blur' }],
        ImageAddress: [{ required: true, message: '请选择镜像列表', trigger: 'blur' }],
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
    save () {
      this.loading = true;
      this.$axios.post(this.$apis.honeypotCreate, this.form).then(res => {
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