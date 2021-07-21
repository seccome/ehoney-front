<template>
  <div class="setting">
    <div class="setting-box">
      <Card title="新建蜜罐">
        <el-form
          :model="createForm" :rules="rules" ref="createFormRef" label-width="100px" v-loading="loading">
          <el-form-item label="蜜罐名称" prop="name">
            <el-input v-model="createForm.name" max="15" placeholder="请输入小写字母或小写字母加数字"></el-input>
          </el-form-item>
          <el-form-item label="镜像选择" prop="imageid">
            <el-select v-model="createForm.imageid" placeholder="请选择">
              <el-option
                v-for="item in podimageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="addPodadd">添加</el-button>
          </el-form-item>
        </el-form>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {
  name: 'CreateCluster',
  components: { Card },
  data() {
    const checkPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入端口'))
      }

      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      }

      callback()
    }
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入名称'))
      }

      if (!/(?!^[0-9]{1,15}$)^[0-9a-z]{1,15}$/.test(value)) {
        callback(new Error('请输入小写字母或小写字母加数字'))
      }

      callback()
    }
    return {
      rules: {
        name: { required: true, validator: checkName, trigger: 'blur' },
        imageid: { required: true, message: '请选择镜像', trigger: 'change' },
      },
      // 蜜罐
      clusterValue: '',
      podimageOptions: [],
      createForm: {
        name: '',
        imageid: '',
      },
      messagesForm: {
        mobile: '',
      },
      loading: false
    }
  },
  created() {
    this.getpodimage()
  },
  methods: {
    async checkSatus(name) {
      try {
        const res = await this.$Server('/podstatuscheck', 'POST', {
          name
        })
        const {data, message} = res
        if (data === 0) {
          window.setTimeout(() => this.checkSatus(name), 3000)
          return
        }
        if (data === 1) {
          this.$message.success(message)

        } else if(data===2) {
          this.$message.error(message)
        }
        this.loading = false
        this.$nextTick(() => {
          this.$router.push({
            name: 'HoneypotList'
          })
        })
      }
      catch(err) {
        this.loading = false
      }
    },
    async addPodadd() {
      try {
        if (this.loading) return

        await this.$refs.createFormRef.validate()

        // const { honeypotId } = this.$route.params
        this.loading = true

        const res = await this.$Server('/podadd', 'POST', {
          honeyserverid: '',
          ...this.createForm
        })

        this.checkSatus(this.createForm.name)
      } catch (e) {
      this.loading = false}
    },
    async getpodimage() {
      const res = await this.$Server('/getpodimage', 'POST', {})

      console.log('res', res)
      const { list } = res.data
      this.podimageOptions = list.map(item => {
        return {
          value: item.id,
          label: item.podimage
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../assets/style/var";

.setting {
  padding: 20px;
  background: @--background-color-base;
}

.setting-box {
  height: 100%;
  //background: @--background-color-base;
  overflow-y: scroll;

  .el-form {
    width: 500px;
  }

  /deep/ .el-input {
    width: 320px;
  }

  /deep/ .el-form-item__label {
    font-size: 14px;
    padding-right: 16px;
  }
}

.is-card-last {
  //padding-bottom: 0px;
  margin-bottom: 0px;
}

</style>
