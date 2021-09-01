<template>
  <el-dialog title="新建探针诱饵" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="诱饵" prop="BaitID">
        <div class="flex-left">
          <el-select v-model="form.BaitID">
            <el-option v-for="item in baitOptions" :key="item.ID" :label="item.BaitName" :value="item.ID" />
          </el-select>
          <el-link type="primary" class="form-item-link" @click.native="$router.push({name: 'trap'})">创建诱饵</el-link>
        </div>
      </el-form-item>
      <el-form-item label="诱饵类型">
        <el-input :value="BaitType" disabled></el-input>
      </el-form-item>
      <el-form-item label="部署路径" prop="DeployPath" v-if="BaitType==='FILE'">
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
        ProbeID: this.honeypotID,
        BaitID: '',
        DeployPath: '',
      },
      rules: {
        BaitID: [{ required: true, message: '请选择诱饵', trigger: 'blur' }],
        DeployPath: [{ required: true, message: '请输入部署路径', trigger: 'blur' }],
      },
      baitOptions: []
    }
  },

  computed: {
    BaitType() {
      let baitItem = this.baitOptions.find(({ID}) => this.form.BaitID === ID) || {};
      return baitItem.BaitType;
    }
  },

  created () {
    this.getBaitOptions();
  },

  methods: {
    /**
     * 获取新增弹出里，密签名称下拉选项
     */
    async getBaitOptions () {
      if (!this.$parent.baitOptions) {
        let { data } = await this.$axios.post(this.$apis.trapSearch, {
          PageNumber: 1,
          PageSize: 9999
        });
        this.$parent.baitOptions = data.List || [];
      }
      this.baitOptions = this.$parent.baitOptions;
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
      this.$axios.post(this.$apis.baitProbeCreate, this.form).then(res => {
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