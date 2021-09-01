<template>
  <el-dialog title="新建诱饵" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body v-loading="loading">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="诱饵名称" prop="BaitName">
        <el-input v-model="form.BaitName" clearable></el-input>
      </el-form-item>
      <el-form-item label="诱饵类型" prop="BaitType">
        <el-select v-model="form.BaitType">
          <el-option v-for="item in baitTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="诱饵文件" v-if="form.BaitType==='FILE'">
        <el-button size="small" type="primary" @click="getFile">选取诱饵文件</el-button>
        <!-- <el-alert title="只允许上传以下附件类型：.pdf,.docx,.xlsx,.pptx" type="warning" show-icon :closable="false" /> -->
        <ul class="el-upload-list el-upload-list--text">
          <li class="el-upload-list__item is-ready" v-for="(file, index) in fileList" :key="index">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}}</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
            <i class="el-icon-close" @click="fileList = []"></i>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="诱饵内容" v-if="form.BaitType==='HISTORY'" prop="BaitData">
        <el-input v-model="form.BaitData" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getFile } from '@/lib/util';

export default {
  data () {
    return {
      loading: false,
      fileList: [],
      form: {
        BaitType: '',
        BaitName: '',
        BaitData: '',
      },
      rules: {
        BaitName: [{ required: true, message: '请输入诱饵名称', trigger: 'blur' }],
        BaitType: [{ required: true, message: '请选择诱饵类型', trigger: 'blur' }],
        BaitData: [{ required: true, message: '请输入诱饵内容', trigger: 'blur' }],
      },
      baitTypeOptions: []
    }
  },

  created () {
    this.getTrapType();
  },

  methods: {
    /**
     * 获取诱饵类型
     */
    async getTrapType () {
      if (!this.$parent.baitTypeOptions) {
        let { data } = await this.$axios.get(this.$apis.getTrapType);
        this.$parent.baitTypeOptions = data;
      }
      this.baitTypeOptions = this.$parent.baitTypeOptions;
    },

    /**
     * 获取本地选取的文件
     */
    async getFile () {
      let file = await getFile();
      this.fileList = [file];
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
     * 保存
     */
    save () {
      if (this.form.BaitType === 'FILE') {
        if (this.fileList.length < 1) {
          this.$message.error('请选取诱饵文件！')
        } else {
          this.saveFile();
        }
      } else if (this.form.BaitType === 'HISTORY') {
        this.saveHis();
      }
    },

    /**
     * file接口请求
     */
    saveFile () {
      const formData = new FormData();
      formData.append('BaitName', this.form.BaitName);
      formData.append('BaitType', this.form.BaitType);
      formData.append('file', this.fileList[0]);
      this.loading = true;
      this.$axios({
        url: this.$apis.trapCreate,
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
     * his接口请求
     */
    saveHis () {
      const formData = new FormData();
      formData.append('BaitName', this.form.BaitName);
      formData.append('BaitType', this.form.BaitType);
      formData.append('BaitData', this.form.BaitData);
      this.$axios({
        url: this.$apis.trapCreate,
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
      this.$emit('close');
    }
  }
}
</script>