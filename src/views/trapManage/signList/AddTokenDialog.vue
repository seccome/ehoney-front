<template>
  <el-dialog title="新建密签" visible width="500px" :close-on-click-modal="false" :before-close="close" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="密签名称" prop="TokenName">
        <el-input v-model="form.TokenName" clearable></el-input>
      </el-form-item>
      <el-form-item label="密签类型" prop="TokenType">
        <el-select v-model="form.TokenType">
          <el-option v-for="item in tokenTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件" v-if="['FILE', 'EXE'].includes(form.TokenType)">
        <el-button size="small" type="primary" @click="getFile(form.TokenType)">选取文件</el-button>
        <el-alert :title="`只允许上传以下附件类型：${fileTypeMap[form.TokenType].tip}`" type="warning" show-icon :closable="false" />
        <ul class="el-upload-list el-upload-list--text">
          <li class="el-upload-list__item is-ready" v-for="(file, index) in fileList" :key="index">
            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}}</a>
            <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
            <i class="el-icon-close" @click="fileList = []"></i>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="密签内容" v-if="form.TokenType==='BrowserPDF'" prop="TokenData">
        <el-input v-model="form.TokenData" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="validateForm" :loading="loading">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {getFile} from '@/lib/util';

export default {
  props: {
    tokenTypeOptions: Array,
  },
  data () {
    return {
      loading: false,
      fileList: [],
      form: {
        TokenName: '',
        TokenType: '',
        TokenData: ''
      },
      rules: {
        TokenName: [{ required: true, message: '请输入密签名称', trigger: 'blur' }],
        TokenType: [{ required: true, message: '请选择密签类型', trigger: 'blur' }],
        TokenData: [{ required: true, message: '请输入密签内容', trigger: 'blur' }],
      },
      fileTypeMap: {
        FILE: {list: ['pdf', 'docx', 'xlsx', 'pptx'], tip: '.pdf,.docx,.xlsx,.pptx'},
        EXE: {list: ['exe'], tip: '.exe'}
      }
    }
  },

  methods: {
    async getFile (type) {
      let file = await getFile({typeList: this.fileTypeMap[type].list});
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
      if (['FILE', 'EXE'].includes(this.form.TokenType)) {
        if (this.fileList.length < 1) {
          this.$message.error('请选取文件！')
        } else {
          this.saveFile();
        }
      } else if (this.form.TokenType === 'BrowserPDF') {
        this.saveHis();
      }
    },

    /**
     * file接口请求
     */
    saveFile () {
      const formData = new FormData();
      formData.append('TokenName', this.form.TokenName);
      formData.append('TokenType', this.form.TokenType);
      formData.append('file', this.fileList[0]);
      this.loading = true;
      this.$axios({
        url: this.$apis.signCreate,
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
      formData.append('TokenName', this.form.TokenName);
      formData.append('TokenType', this.form.TokenType);
      formData.append('TokenData', this.form.TokenData);
      this.$axios({
        url: this.$apis.signCreate,
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