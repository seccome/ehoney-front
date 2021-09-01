<template>
  <el-dialog :title="title" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="协议名称" prop="ProtocolType">
        <el-input v-model="form.ProtocolType" clearable :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="端口范围">
        <el-form ref="portForm" :model="form" :rules="rules">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="MinPort">
                <el-input :value="form.MinPort" @input="changePort($event, 'MinPort')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align:center"> - </el-col>
            <el-col :span="6">
              <el-form-item prop="MaxPort">
                <el-input :value="form.MaxPort" @input="changePort($event, 'MaxPort')"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-form-item>
      <el-form-item label="协议服务文件" v-if="!isEdit">
        <el-button size="small" type="primary" @click="getFile">选取协议服务文件</el-button>
        <!-- <el-alert title="协议服务文件在密网中启动" type="warning" show-icon :closable="false" /> -->
        <ul class="el-upload-list el-upload-list--text">
          <li class="el-upload-list__item is-ready" v-for="(file, index) in fileList" :key="index">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}}</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
            <i class="el-icon-close" @click="fileList = []"></i>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm" :loading="loading">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFile } from '@/lib/util';

export default {
  props: {
    dialogData: Object
  },

  data () {
    return {
      title: '新建协议类型',
      loading: false,
      fileList: [],
      form: {
        ProtocolType: '',
        MinPort: '',
        MaxPort: ''
      },
      rules: {
        ProtocolType: [{ required: true, message: '请输入协议名称', trigger: 'blur' }],
        MinPort: [{ required: true, message: '请输入开始端口', trigger: 'blur' }],
        MaxPort: [{ required: true, message: '请输入结束端口', trigger: 'blur' }],
      },
      isEdit: false
    }
  },

  created () {
    if (this.dialogData.data) {
      this.title = '修改协议类型';
      this.isEdit = true;
      Object.assign(this.form, this.dialogData.data);
    }
  },

  methods: {
    async getFile () {
      let file = await getFile();
      this.fileList = [file];
    },

    changePort (val, key) {
      this.form[key] = val.replace(/[^\d]/g, '');
    },

    /**
     * 校验表单
     */
    validateForm () {
      this.$refs.form.validate((valid) => {
        valid && this.validatePortForm();
      });
    },

    /**
     * 校验端口
     */
    validatePortForm () {
      this.$refs.portForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.editSave();
          } else {
            if (this.fileList.length < 1) {
              this.$message.error('请选取协议服务文件！')
            } else {
              this.save();
            }
          }
        }
      })
    },

    getFormData() {
      const formData = new FormData();
      let params = { ...this.form };
      params.MinPort = Number(params.MinPort);
      params.MaxPort = Number(params.MaxPort);
      Object.keys(this.form).forEach((key) => formData.append(key, this.form[key]));
      return formData;
    },

    editSave() {
      this.loading = true;
      this.$axios.post(`${this.$apis.protocolTypePort}/${this.dialogData.data.ID}`, this.getFormData()).then(res => {
        this.loading = false;
        this.$message.success('修改成功！');
        this.$emit('save');
        this.close();
      }).catch(() => {
        this.loading = false;
      });
    },

    /**
     * 保存接口请求
     */
    save () {
      var formData = this.getFormData();
      formData.append('file', this.fileList[0]);
      this.loading = true;
      this.$axios({
        url: this.$apis.protocolTypeCreate,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8'
        }
      }).then(res => {
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
      this.$emit('update:dialogData', {
        isShow: false,
        data: null
      });
    }
  }
}
</script>