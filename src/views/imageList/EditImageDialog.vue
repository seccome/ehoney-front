<template>
  <el-dialog title="镜像配置" visible width="540px" :close-on-click-modal="false" :before-close="close" v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="镜像名称" prop="ImageName">
        <el-input :value="form.ImageName" disabled clearable></el-input>
      </el-form-item>
      <el-form-item label="镜像端口" prop="ImagePort">
        <el-input :value="form.ImagePort" @input="changePort" clearable></el-input>
        <el-alert title="请根据镜像正确设置服务端口、才能保证协议转发的正确性" type="warning" show-icon :closable="false"></el-alert>
      </el-form-item>
      <el-form-item label="协议类型" prop="ImageType">
        <el-select v-model="form.ImageType">
          <el-option v-for="item in imageTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
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
  props: {
    imageTypeOptions: Array,
    dialogData: Object
  },
  data () {
    return {
      loading: false,
      form: {
        ImageName: '',
        ImagePort: '',
        ImageType: '',
      },
      rules: {
        ImagePort: [{ required: true, message: '请输入镜像端口', trigger: 'blur' }],
        ImageType: [{ required: true, message: '请选择协议类型', trigger: 'blur' }],
      }
    }
  },

  created() {
    Object.assign(this.form, this.dialogData);
  },

  methods: {
    changePort(val) {
      this.form.ImagePort = val.replace(/[^\d]/g,'');
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
      this.$axios.put(`${this.$apis.imageListCreate}/${this.dialogData.id}`, {
        ImagePort: Number(this.form.ImagePort),
        ImageType: this.form.ImageType,
      }).then(res => {
        this.loading = false;
        this.$message.success('配置成功！');
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