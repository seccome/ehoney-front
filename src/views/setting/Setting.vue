<template>
<PageContent>
    <div slot="form" class="page-form">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="90px"
        class="demo-ruleForm"
        label-position="left">
        <template v-for="(item, index) in formItems">
          <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.key" :key="index">
            <el-input v-model="form[item.key]" :placeholder="item.placeholder"></el-input>
          </el-form-item>
          <el-form-item v-if="item.type === 'password'" :label="item.label" :prop="item.key" :key="index">
            <el-input v-model="form[item.key]" type="password"></el-input>
          </el-form-item>
        </template>
          <el-form-item>
            <el-button type="primary" size="small" @click="addConfig">添加</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="page-main">
      <ListLayout>
        <el-table slot="list" :data="list" width="100%" height="100%" :border="false" v-loading="loadingStatus.list">
          <template v-for="(item, index) in tableColumns">
            <el-table-column :label="item.label" :prop="item.key" :key="index"></el-table-column>
          </template>
          <el-table-column label="操作" width="200">
            <div slot-scope="scope">
              <el-button type="text" @click="deleteConfig(scope.row)">删除</el-button>
            </div>
          </el-table-column>
          <div class="table-empty" slot="empty" style="width: 100%;">
            <img src="@/assets/images/empty.png" alt="" width="305" height="159"/>
          </div>
        </el-table>
      </ListLayout>
    </div>
  </PageContent>
</template>

<script>

export default {
  name: 'Setting',
  props: {
    tableColumns: Array,
    rules: Object,
    formItems: Array,
    functions: {},
    form:{}
  },
  data() {
    return {
      list: [],
      loadingStatus:{
        add: false,
        list: false
      },
    }
  },
  created() {
    this.formItems.forEach(item => {
      this.form[item.key] = ''
    })
    this.getConfigs()
  },
  methods: {
    async addConfig() {
      try {
        this.loadingStatus.add = true
        await this.$refs.form.validate()

        await this.$Server(`/${this.functions.add}`, 'POST', {
         ...this.form,
        })

        this.$message.success('添加成功')
        this.$refs.form.resetFields()
        this.getConfigs()
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingStatus.add = false
      }
    },
    async deleteConfig(item) {
      this.$confirm('确认删除？')
        .then(async ()=> {
          const res = await this.functions.delete(item)
          const {code } = res
          if (code === 0) {
            this.$message.success('删除成功')
            this.getConfigs()
          }
        })
        .catch(e => console.log(e));
    },
    async getConfigs() {
      try {
        this.loadingStatus.list = true
        const res = await this.$Server(`/${this.functions.getList}`, 'POST')
        this.loadingStatus.list = false
        const { code, data } = res
        if (code === 0) {
          this.list = data
        }
      } catch(e){
        this.$message.error('服务器端异常')
        this.loadingStatus.list = false
      }
    }
  }
}
</script>
