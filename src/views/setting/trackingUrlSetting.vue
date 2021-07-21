<template>
  <div class="tracking-url">
    <Card>
      <div class="tracking-url__form">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" width="500px">
          <el-form-item label="密签追踪url" prop="tracehost">
            <el-row>
              <el-col :span="22">
            <el-input v-model="form.tracehost"></el-input>
              </el-col>
              <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="如需要公网使用，请配置映射的公网IP" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
             </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button v-if="type==='new'" type="primary" @click="submitForm('form')">提交</el-button>
            <el-button v-else type="primary" @click="submitForm('form')">更新</el-button>
          </el-form-item>
        </el-form>
      </div>

    </Card>
  </div>
</template>

<script>
import Card from '@/components/Card'
export default {
  data() {
    return {
      rules: {
        tracehost: [
          { required: true, message: '密签追踪url不能为空'},
        ]
      },
      form: {
        tracehost: ''
      },
      type: 'new'
    }
  },
  components: {
    Card
  },
  created() {
    this.getTraceInfo()
  },
  methods: {
    async getTraceInfo() {
      const res = await this.$Server(`/gettraceinfo`, 'POST')
      const {data, code} = res
      if (code === 0 && data) {
        this.type = 'update'
        this.form.tracehost = data
      }
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    async submitForm(name) {
      try {
        await this.$refs[name].validate()
        const res = await this.$Server(`/addtraceinfo`, 'POST', {
          ...this.form,
        })
        if (res.code === 0) {
          this.$message.success('密签追踪url配置成功')
          this.getTraceInfo()
        }
      }catch(e){
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less">
@import "../../assets/style/var";
.tracking-url {
  padding: 20px;
  background: @--background-color-base;
  &__form {
    width: 500px;
    .el-button {
      width: 100px;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
}
</style>
