<template>
  <el-dialog title="新建透明转发" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="协议转发">
        <el-select v-model="form.ProtocolProxyID" filterable :loading="ProtocolProxyLoading">
          <el-option v-for="item in ProtocolProxyOptions" :key="item.ID" :label="`${item.ServerType}(${item.ProxyPort})`" :value="item.ID" />
        </el-select>
      </el-form-item>
      <el-form-item label="蜜罐">
        <el-input :value="currentProxy.HoneypotName" disabled></el-input>
      </el-form-item>
      <el-form-item label="转发端口">
        <el-input :value="currentProxy.ProxyPort" disabled></el-input>
      </el-form-item>
      <el-form-item label="探针" prop="ProbeID">
        <el-select v-model="form.ProbeID" filterable :loading="ProbeLoading">
          <el-option v-for="item in ProbeOptions" :key="item.ID" :label="`${item.HostName}(${item.ProbeIP})`" :value="item.ID" />
        </el-select>
      </el-form-item>
      <el-form-item label="代理端口" prop="ProxyPort">
        <el-input :value="form.ProxyPort" @input="changePort" clearable></el-input>
        <el-alert :title="`请确保探针转发端口不被占用 [${currentProxy.MinPort} - ${currentProxy.MaxPort}]`" type="warning" show-icon :closable="false" ></el-alert>
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
  data () {
    return {
      loading: false,
      form: {
        ProbeID: '',
        ProxyPort: '',
        ProtocolProxyID: ''
      },
      ProbeOptions: [],
      ProbeLoading: false,
      ProtocolProxyOptions: [],
      ProtocolProxyLoading: false,
      rules: {
        ProtocolProxyID: [{ required: true, message: '请选择协议转发', trigger: 'blur' }],
        ProbeID: [{ required: true, message: '请选择探针', trigger: 'blur' }],
        ProxyPort: [{ required: true, message: '请输入代理端口', trigger: 'blur' }],
      }
    }
  },

  created() {
    this.getProbeOptions();
    this.getProtocolProxy();
  },

  computed: {
    proxyMap() {
      let _map = {};
      this.ProtocolProxyOptions.forEach(item => {
        _map[item.ID] = item;
      });
      return _map;
    },

    currentProxy() {
      return this.proxyMap[this.form.ProtocolProxyID] || {MinPort: '', MaxPort: ''};
    }
  },

  methods: {
    async getProtocolProxy() {
      // this.$parent.ProtocolProxyOptions。用来做缓存，防止重复打开弹窗，重复请求
      if (!this.$parent.ProtocolProxyOptions) {
        this.ProtocolProxyLoading = true;
        let {data} = await this.$axios.post(this.$apis.protocolProxySearch, {
          PageNumber: 1,
          PageSize: 9999
        });
        this.$parent.ProtocolProxyOptions = data.List || [];
        this.ProtocolProxyLoading = false;
      }
      this.ProtocolProxyOptions = this.$parent.ProtocolProxyOptions;
    },

    async getProbeOptions() {
      // this.$parent.ProbeOptions。用来做缓存，防止重复打开弹窗，重复请求
      if (!this.$parent.ProbeOptions) {
        this.ProbeLoading = true;
        let {data} = await this.$axios.post(this.$apis.probeListSearch, {
          PageNumber: 1,
          PageSize: 9999
        });
        this.$parent.ProbeOptions = data.List || [];
        this.ProbeLoading = false;
      }
      this.ProbeOptions = this.$parent.ProbeOptions;
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
      this.$axios.post(this.$apis.transparentProxyCreate, params).then(res => {
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