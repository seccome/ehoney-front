<template>
  <el-dialog
    :title="title"
    width="520px"
    custom-class="dialog-reset"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    :visible.sync="visible">
    <div class="add-body">
      <el-form ref="createdFormRef"
               :model="createdFrom"
               :rules="createdFormRules"
               v-loading="loading"
               class="created-from"
               label-width="75px">
        <el-form-item :label="isSign ? '密签名称' : '诱饵名称'" prop="baitname">
          <el-input v-model="createdFrom.baitname" :placeholder="isSign ? '密签名称' : '诱饵名称'"></el-input>
        </el-form-item>
        <el-form-item label="系统类型" prop="sysid" v-if="!isSign">
          <select-opt v-model="createdFrom.sysid" select-type="getsystype"></select-opt>
        </el-form-item>
        <el-form-item label="文件上传" prop="file">
          <div class="upload-box">
            <div class="not-file" v-show="!createdFrom.file">
              <div class="icon-box">
                <svg width="40" height="42" viewBox="0 0 48 50" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M27 0l11 11v17h-2V12H26V1.999L2 2v40h24.414c-.27-.954-.414-1.96-.414-3 0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11a11 11 0 0 1-9.8-6H0V0h27zm10 30a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 2.5l3.5 4.5H38v8h-2v-8h-2.5l3.5-4.5zM19 33v2H7v-2h12zm5-5v2H7v-2h17zm4-5v2H7v-2h21zm0-5v2H7v-2h21zm-4-5v2H7v-2h17zm10.172-3L28 3.828V10h6.172z"
                    fill="currentColor" fill-rule="evenodd"/>
                </svg>
              </div>
              <div class="main-text">点击文件上传</div>
            </div>
            <div class="success" v-show="createdFrom.file">
              <div class="file-name">{{ createdFrom.file.name }}</div>
              <div class="main-text">文件上传成功</div>
            </div>
            <input class="upload-file" v-bind="createdFrom.file" type="file"
                   @change="uploadFile"/>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box" slot="footer">
      <el-button size="small" @click="hide">取消</el-button>
      <el-button size="small" type="primary" @click="submit">新建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Upload',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    // 是否新建密签
    isSign: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      createdFormRules: {
        baitname: {
          required: true,
          message: `请填写${ this.isSign ? '密签名称' : '诱饵名称' }`, trigger: 'change'
        },
        sysid: { required: true, message: '请选择系统类型', trigger: 'change' },
        file: { required: true, message: '请上传文件', trigger: 'blur' },
      },
      createdFrom: {
        baitname: '',
        sysid: '',
        file: '',
      },
      typeOptions: [],
      loading: false,
    }
  },
  methods: {
    async uploadFile(e) {

      this.createdFrom.file = ''

      const file = e.target.files[0]

      const { size, name } = file
      // 校验文件格式
      if ((name.indexOf('.html') > -1)) {
        this.$message.error('不能上传.html')

        return
      }

      const successSize = await this.checkFile(size)

      if (successSize) {
        this.createdFrom.file = file
      }

      // 清空上传内容
      e.target.value = ''
    },
    async submit() {

      if (this.loading) return
      this.loading = true

      try {
        await this.$refs.createdFormRef.validate()

        const { baitname, sysid, file, } = this.createdFrom

        const formdata = new FormData()

        formdata.append('file', file)

        const url = this.isSign
          ? `/createsign?signname=${ baitname }`
          : `/createbaits?sysid=${ sysid }&baitname=${ baitname }`

        const res = await axios.post(url, formdata)

        console.log('res', res)

        setTimeout(() => {
          this.$message.success('新建成功')

          this.hide(true)
        }, 100)
      } catch (e) {console.log(e)} finally {
        this.loading = false
      }
    },
    checkFile(size) {
      let successSize = true
      // 大于 10 MB
      if (size / 1024 / 1024 > this.fileSize) {
        successSize = false
        this.$message.error('文件大于10M，上传失败')
      }

      // 小于 1kb的
      if (size / 1024 < this.minSize) {
        successSize = false
        this.$message.error('文件小于1kb，上传失败')
      }

      return successSize
    },
    show() {
      this.visible = true
    },
    hide(isUpdate) {
      this.$emit('update:visible', false)
      this.$emit('close', isUpdate)
    },
    beforeClose() {
      this.hide()
    }
  }
}
</script>

<style scoped lang="less">
.upload-box {
  position: relative;
  margin: 6px 0px;
  height: 120px;
  width: 320px;
  background-color: #fafbfe;
  border-radius: 3px;
  border: 1px dashed #ccc;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border: 1px dashed #0975e0;
  }

  .icon-box {
    margin-top: 20px;
    font-size: 24px;
    text-align: center;
  }

  .main-text {
    text-align: center;
    margin: 6px 0 7px;
    color: #4d4d4d;
    line-height: 20px;
  }

  .sub-text {
    text-align: center;
    color: #999;
  }

  .upload-file {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .file-name {
    font-size: 18px;
    line-height: 24px;
    //color: #13ce66;
    text-align: center;
    margin: 18px 0px;
    margin-top: 24px;
  }

  .success .main-text {
    color: #13ce66;
  }

}

.is-error {
  .upload-box, .upload-box:hover {
    border: 1px dashed #e31c1c;
  }
}
</style>
