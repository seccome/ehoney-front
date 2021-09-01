<template>
  <PageContent>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card mb-4" v-loading="loading.tokenForm">
          <div slot="header" class="flex-between-center">
            <span>密签跟踪设置</span>
            <el-button type="primary" @click="tokenFormSave">保 存</el-button>
          </div>
          <el-form ref="tokenForm" :model="tokenForm" :rules="rules.token" label-width="80px">
            <el-form-item label="URL" prop="TraceHost">
              <el-input v-model="tokenForm.TraceHost" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card mb-4 ml-2" v-loading="loading.WebhookForm">
          <div slot="header" class="flex-between-center">
            <span>Webhook设置</span>
            <el-button type="primary" @click="WebhookFormSave">保 存</el-button>
          </div>
          <el-form ref="WebhookForm" :model="WebhookForm" :rules="rules.WebHook" label-width="80px">
            <el-form-item label="钉钉接口" prop="WebHook">
              <el-input v-model="WebhookForm.WebHook" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card mb-4" v-loading="loading.HarborForm">
          <div slot="header" class="flex-between-center">
            <span>Harbor配置</span>
            <el-button type="primary" @click="HarborFormSave">保 存</el-button>
          </div>
          <el-form ref="HarborForm" :model="HarborForm" :rules="rules.HarborForm" label-width="80px">
            <el-alert title="设置容器镜像源、目前仅支持harbor(API v2.0)方式" type="warning" show-icon :closable="false" style="line-height: 20px;"></el-alert>
            <el-form-item label="URL" prop="HarborURL">
              <el-input v-model="HarborForm.HarborURL" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="AuthenticateUser">
              <el-input v-model="HarborForm.AuthenticateUser" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="AuthenticatePass">
              <el-input v-model="HarborForm.AuthenticatePass" clearable show-password></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="HarborProjectName">
              <el-input v-model="HarborForm.HarborProjectName" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </PageContent>
</template>

<script>
export default {
  data () {
    return {
      rules: {
        token: {
          TraceHost: [{ required: true, message: '请输入URL', trigger: 'blur' }]
        },
        WebHook: {
          WebHook: [{ required: true, message: '请输入钉钉接口', trigger: 'blur' }]
        },
        HarborForm: {
          HarborURL: [{ required: true, message: '请输入URL', trigger: 'blur' }],
          AuthenticateUser: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          AuthenticatePass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          HarborProjectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        }
      },
      loading: {
        tokenForm: false,
        WebhookForm: false,
        HarborForm: false,
      },
      tokenForm: {
        TraceHost: ''
      },
      WebhookForm: {
        WebHook: ''
      },
      HarborForm: {
        HarborURL: '',
        AuthenticateUser: '',
        AuthenticatePass: '',
        HarborProjectName: '',
      }
    }
  },

  created() {
    this.tokenFormSearch();
    this.WebhookFormSearch();
    this.HarborFormSearch();
  },

  methods: {
    tokenFormSearch() {
      this.loading.tokenForm = true;
      this.$axios.get(this.$apis.systemTokenTrace).then(res => {
        this.loading.tokenForm = false;
        this.tokenForm.TraceHost = res.data;
      }).catch(err => {
        this.loading.tokenForm = false;
      });
    },

    WebhookFormSearch() {
      this.loading.WebhookForm = true;
      this.$axios.get(this.$apis.systemWebhook).then(res => {
        this.loading.WebhookForm = false;
        this.WebhookForm.WebHook = res.data;
      }).catch(err => {
        this.loading.WebhookForm = false;
      });
    },

    HarborFormSearch() {
      this.loading.HarborForm = true;
      this.$axios.get(this.$apis.systemHarbor).then(res => {
        this.loading.HarborForm = false;
        Object.assign(this.HarborForm, res.data);
      }).catch(err => {
        this.loading.HarborForm = false;
      });
    },

    tokenFormSave() {
      this.$refs.tokenForm.validate(valid => {
        if (!valid) return;
        this.loading.tokenForm = true;
        this.$axios.put(this.$apis.systemTokenTrace, this.tokenForm).then(res => {
          this.loading.tokenForm = false;
          this.$message.success('密签跟踪设置成功！');
        }).catch(err => {
          this.loading.tokenForm = false;
        });
      });
    },

    WebhookFormSave() {
      this.$refs.WebhookForm.validate(valid => {
        if (!valid) return;
        this.loading.WebhookForm = true;
        this.$axios.put(this.$apis.systemWebhook, this.WebhookForm).then(res => {
          this.loading.WebhookForm = false;
          this.$message.success('Webhook设置成功！');
        }).catch(err => {
          this.loading.WebhookForm = false;
        });
      });
    },
    
    HarborFormSave() {
      this.$refs.HarborForm.validate(valid => {
        if (!valid) return;
        this.loading.HarborForm = true;
        this.$axios.put(this.$apis.systemHarbor, this.HarborForm).then(res => {
          this.loading.HarborForm = false;
          this.$message.success('Harbor配置成功！');
        }).catch(err => {
          this.loading.HarborForm = false;
        });
      });
    },
  }
}
</script>