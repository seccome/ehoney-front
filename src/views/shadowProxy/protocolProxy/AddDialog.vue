<template>
  <el-dialog title="新建协议转发" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="协议类型">
        <div class="flex-left">
          <el-select v-model="ProtocolType" @change="form.HoneypotID = ''" clearable>
            <el-option v-for="item in protocolTypeOptions" :key="item.ID" :label="item.ProtocolType" :value="item.ProtocolType" />
          </el-select>
          <el-link type="primary" class="form-item-link" @click.native="$router.push({name: 'protocolType'})">创建协议</el-link>
        </div>
      </el-form-item>
      <el-form-item label="蜜罐" prop="HoneypotID">
        <div class="flex-left">
          <el-select v-model="form.HoneypotID">
            <el-option v-for="item in HoneypotFilterOptions" :key="item.ID" :label="item.HoneypotName" :value="item.ID" />
          </el-select>
          <el-link type="primary" class="form-item-link" @click.native="$router.push({name: 'honeypotList'})">创建蜜罐</el-link>
        </div>
      </el-form-item>
      <el-form-item label="转发端口" prop="ProxyPort">
        <el-input :value="form.ProxyPort" @input="changePort" clearable></el-input>
        <el-alert title="请确保蜜网转发端口不被占用" type="warning" show-icon :closable="false" ></el-alert>
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
    protocolTypeOptions: Array
  },
  data () {
    return {
      loading: false,
      ProtocolType: '',
      // 新增弹窗蜜罐下拉选项
      HoneypotOptions: [],
      form: {
        HoneypotID: '',
        ProxyPort: '',
      },
      rules: {
        HoneypotID: [{ required: true, message: '请选择蜜罐', trigger: 'blur' }],
        ProxyPort: [{ required: true, message: '请输入转发端口', trigger: 'blur' }],
      }
    }
  },

  computed: {
    HoneypotFilterOptions() {
      return this.HoneypotOptions.filter(item => item.ServerType===this.ProtocolType);
    }
  },

  created() {
    this.getHoneypotOptions();
  },

  methods: {
    /**
     * 获取 蜜罐下拉选项
     */
    getHoneypotOptions() {
      this.$axios.post(this.$apis.honeypotSearch, {
        PageNumber: 1,
        PageSize: 999
      }).then(({data}) => {
        this.HoneypotOptions = (data.List || []).filter(item => item.Status === 3);
      })
    },

    changePort(val) {
      this.form.ProxyPort = val.replace(/[^\d]/g,'');
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
      let params = {...this.form};
      params.ProxyPort = Number(params.ProxyPort);
      this.$axios.post(this.$apis.protocolProxyCreate, params).then(res => {
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