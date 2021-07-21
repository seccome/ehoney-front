<template>
  <PageContent>
    <div slot="form" class="mirror-list page-form">
      <el-form :inline="true" :model="searchForm" class="searchForm" label-width="80px" ref="searchForm">
        <el-form-item label="镜像名称" prop="ImagesName">
          <el-input v-model="searchForm.ImagesName"
                    placeholder="请输入镜像名称"></el-input>
        </el-form-item>
        <el-form-item label="镜像类型" prop="ImageType">
          <el-select v-model="searchForm.ImageType" placeholder="请选择">
            <el-option
              v-for="item in mirrorTypeList"
              :key="item.honeyTypeId"
              :label="item.honeyPotType"
              :value="item.honeyTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型" prop="ImageOS">
          <el-select v-model="searchForm.ImageOS" placeholder="请选择">
            <el-option
              v-for="item in systemTypeList"
              :key="item.sysId"
              :label="item.sysType"
              :value="item.sysId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button size="small" type="primary" @click="onSearch">查询</el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </div>
    </div>
    <div class="attack-body page-main">
      <ListLayout>
        <el-table slot="list" :data="tableData" width="100%" height="100%" :border="false" v-loading="loading">
          <el-table-column label="镜像名称" prop="imagename"></el-table-column>
          <el-table-column label="镜像地址" prop="imageaddress"></el-table-column>
          <el-table-column label="镜像端口" prop="imageport">
          </el-table-column>
          <el-table-column label="镜像类型" prop="imagetype">
          </el-table-column>
          <el-table-column label="系统类型" prop="imageos">
          </el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button type="text"
                @click="edit(scope.row)">编辑
              </el-button>
            </div>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159"/>
          </div>
        </el-table>
        <Pagination
          slot="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :current-page.sync="queryParam.PageNum">
        </Pagination>
      </ListLayout>
    </div>
    <el-dialog
      title="修改镜像信息"
      :visible.sync="dialogVisible"
      width="30%"
      class="modifyDialog"
      @close="close">
      <el-form ref="modifyForm" :model="modifyForm" label-width="80px" :rules="modifyFormRules">
        <el-form-item label="镜像名称" prop="imagename">
          <el-input v-model="modifyForm.imagename" disabled></el-input>
        </el-form-item>
        <el-form-item label="镜像端口" prop="imageport">
          <el-input v-model="modifyForm.imageport"></el-input>
        </el-form-item>
        <el-form-item label="镜像类型" prop="imagetype">
          <el-select v-model="modifyForm.imagetype" placeholder="请选择">
            <el-option
              v-for="item in mirrorTypeList"
              :key="item.honeyTypeId"
              :label="item.honeyPotType"
              :value="item.honeyTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型" prop="imageos">
          <el-select v-model="modifyForm.imageos" placeholder="请选择">
            <el-option
              v-for="item in systemTypeList"
              :key="item.sysId"
              :label="item.sysType"
              :value="item.sysId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </PageContent>
</template>

<script>

export default {
  name: 'MirrorList',
  data() {
    return {
      searchForm:{
        ImagesName:"",
        ImageType:"",
        ImageOS:"",
      },
      queryParam: {
        PageNum: 1,
        PageSize: 10
      },
      modifyForm: {
        imagename:'',
        imageport:'',
        imagetype:'',
        imageos:'',
      },
      loading: false,
      dialogVisible: false,
      // editData: null,
      mirrorTypeList: [],
      systemTypeList: [],
      tableData: [],
      totalCount: 0,
      modifyFormRules: {
        imageport: { required: true, message: '请输入镜像端口', trigger: 'blur' },
        imagetype: { required: true, message: '请选择镜像类型', trigger: 'change' },
        imageos: { required: true, message: '请选择系统类型', trigger: 'change' },
      }
    }
  },
  created() {
    this.getMirrorTypeList()
    this.getSystemTypeList()
    this.getTableData()
  },
  watch: {
    queryParam () {
      this.getTableData()
    }
  },
  methods: {
    onSearch(){
      this.queryParam = {
        ...this.queryParam,
        ...this.searchForm,
        PageNum: 1
      }
    },
    async confirmSubmit() {
      try{
        await this.$refs.modifyForm.validate()
        const res = await this.$Server('/honeyimageedit', 'POST',
          {
            id:this.modifyForm.id,
            ImageOS:this.modifyForm.imageos,
            ImageType:this.modifyForm.imagetype,
            Imageport:+this.modifyForm.imageport,
          }
        )
        if(res.code === 0){
          this.$message.success(res.message)
          this.queryParam = {
            ...this.queryParam,
            PageNum: 1
          }
          this.dialogVisible = false
        }
      } catch(e) {
        console.log(2)
      }
    },
    close() {
      this.$refs.modifyForm.resetFields()
      this.editData = null
    },
    getImageTypeId(type) {
      const matchedItem = this.mirrorTypeList.find(item => item.honeyPotType===type)
      return matchedItem?matchedItem.honeyTypeId: ''
    },
    getImageOSId(type) {
      const matchedItem = this.systemTypeList.find(item => item.sysType===type)
      return matchedItem?matchedItem.sysId: ''
    },
    edit(info) {
      this.modifyForm = {
        id: info.id,
        imagename: info.imagename,
        imageport:info.imageport,
        imagetype:this.getImageTypeId(info.imagetype),
        imageos:this.getImageOSId(info.imageos),
      }
      this.dialogVisible = true
    },
    async getMirrorTypeList() {
      const res = await this.$Server('/gethoneypotstype', 'POST')
      this.mirrorTypeList = res.data
    },
    async getSystemTypeList() {
        const res = await this.$Server('/getsystype', 'POST')
        this.systemTypeList = res.data
    },
    async getTableData() {
      try {
        this.loading = true
        const res = await this.$Server('/gethoneyimagelists', 'POST', this.queryParam)

        if (!res.data) {
          this.totalCount = 0
          this.tableData = []

          return
        }

        const { list, total } = res.data

        this.totalCount = total

        this.tableData = list
      } finally {
        this.loading = false
      }
    },
    resetData() {
      this.$refs.searchForm.resetFields()
    },
    handleSizeChange(pageSize) {
      this.queryParam = {
        ...this.queryParam,
        PageSize: pageSize,
        PageNum: 1
      }
    },
    handleCurrentChange(index) {
       this.queryParam = {
        ...this.queryParam,
        PageNum: index
      }
    },
  }
}
</script>

<style lang='less'>
.mirror-list {
  .searchForm{
    margin-top: 16px;
    .el-form-item {
      margin-bottom: 0;
      &__label {
        font-size: 14px;
      }
    }
  }
}
.modifyDialog {
  .el-input, .el-select {
    width: 100%;
  }
}
</style>
