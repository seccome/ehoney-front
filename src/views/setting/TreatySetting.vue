<template>
  <PageContent>
    <div slot="form" class="page-form">
    <el-form
         v-loading="loadingStatus.add"
        :model="form" ref="form" label-width="90px"
        :rules="rules"
        class="demo-ruleForm" label-position="left">
        <el-form-item label="服务类型" prop="protocolType">
          <el-input v-model="form.protocolType"></el-input>
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-upload
            class="upload-demo"
            ref="fileList"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-change="handleChange"
            :before-upload="handleBeforeUpload"
            :auto-upload="false">
            <el-button slot="trigger" size="small">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">每次只能上传一个文件，不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="addConfig">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="protocolList" width="100%" height="100%" :border="false" v-loading="loadingStatus.list">
         <el-table-column label="服务类型" prop="honeypottype"></el-table-column>
          <el-table-column label="模块目录" prop="softpath"></el-table-column>
          <!-- <el-table-column label="操作" width="200">
            <div slot-scope="scope">
              <el-button type="text" @click="deleteConfig(scope.row)">删除</el-button>
            </div>
          </el-table-column> -->
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159"/>
          </div>
        </el-table>
        <Pagination
          slot="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          :current-page="pageNum">
        </Pagination>
      </ListLayout>
    </div>
  </PageContent>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Setting',
  data() {
    return {
      rules: {
        protocolType: { required: true, message: '请输入服务类型', trigger: 'blur' },
        module: { required: true, message: '请上传模块', trigger: 'change' },
      },
      form: {
        protocolType: '',
        module: '',
      },
      loadingStatus:{
        add: false,
        list: false
      },
      protocolList: [],
      fileList: [],
      pageNum: 1,
      total: 0,
      searchParam: {
        PageSize: 10,
        PageNum: 1
      },
    }
  },
  watch: {
    searchParam: {
      handler() {
        this.getConfigs(this.searchParam)
      },
      deep: true
    },
    'form.module' () {
      this.$refs.form.validateField('module', (errorMessage) => {
        console.log(errorMessage)
      })
    }
  },
  created() {
    this.getConfigs(this.searchParam)
  },
  methods: {
    handleBeforeUpload() {
      if (this.fileList.length) {
         this.$message.warning('每次只能上传一个模块')
         return false
      }
    },
    handleChange(file, fileList) {
      this.form.module = file
      this.fileList = fileList
    },
    handleRemove() {
      this.form.module = null
      this.fileList = []
    },
    handleCurrentChange(val) {
      this.searchParam.PageNum = val
    },
    handleSizeChange(val) {
      this.searchParam.PageNum = 1
      this.searchParam.PageSize = val
    },
    deleteConfig(item) {
      this.$confirm('确认删除？')
        .then(async ()=> {
          const { typeid } = item
          const res = await this.$Server('/deleteprotocoltype', 'POST', {
            TypeId: typeid,
          })
          const {code } = res
          if (code === 0) {
            this.$message.success('删除成功')
            this.searchParam = {
              ...this.searchParam,
              PageNum: 1
            }
          }
        })
        .catch(e => console.log(e));
    },
    async addConfig() {
      const { protocolType } = this.form
      await this.$refs.form.validate()
      try {
        const formData = new FormData()
        formData.append('protocolname', protocolType)
        formData.append('file', this.form.module.raw)
        this.loadingStatus.add = true
        await axios({
          method:'post',
          url:`/createprotocoltype`,
          headers: {
            'content-type': 'multipart/form-data'
          },
          data: formData
        })
        this.loadingStatus.add = false
        this.searchParam = {
          ...this.searchParam,
          PageNum: 1
        }
      } catch (e) {
        this.loadingStatus.add = false
      }
    },
    async getConfigs(param = {}) {
      try {
        this.loadingStatus.list = true
        const res = await this.$Server('/getprotocoltype', 'POST', param)
        this.loadingStatus.list = false
        const { code, data } = res
        if (code === 0) {
          const {list, pageNum, total} = data
          this.protocolList = list
          this.pageNum = pageNum
          this.total = total
        }
      } catch(e){
        this.$message.error('服务器端异常')
        this.loadingStatus.list = false
      }
    }
  }
}
</script>
