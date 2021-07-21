<template>
  <el-dialog
    :title="title"
    width="520px"
    custom-class="dialog-reset"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    :visible.sync="visible">
    <el-form ref="createdFormRef" :model="createdFrom" :rules="createdFormRules"
             v-loading="loading"
             class="created-from"
             label-width="75px">
      <el-form-item label="诱饵类型" prop="baitType">
        <select-opt v-model="createdFrom.type" :select-type="creationType === 'cluster'?'getAllHoneyBaitType':'getAllBaitType'"></select-opt>
      </el-form-item>
      <el-form-item label="诱饵选择" prop="baitId" v-if="createdFrom.type === 'file'">
        <el-select v-model="createdFrom.baitId" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部署目录" prop="address" v-if="createdFrom.type === 'file'">
        <el-input v-model="createdFrom.address" placeholder="部署目录"></el-input>
      </el-form-item>
      <el-form-item label="诱饵策略" prop="data" v-if="createdFrom.type === 'history'">
        <el-input v-model="createdFrom.data" placeholder="诱饵策略" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer-box" slot="footer">
      <el-button size="small" @click="hide">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreatedDecoy',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新建诱饵'
    },
    // app-应用管理下创建诱饵，cluster-蜜罐管理下创建诱饵
    creationType: {
      type: String,
      default: 'app'
    }
  },
  data() {
    return {
      createdFormRules: {
        type: { required: true, message: '请选择诱饵', trigger: 'change' },
        baitId: { required: true, message: '请选择诱饵', trigger: 'change' },
        address: { required: true, message: '请填写部署目录', trigger: 'blur' },
        data: { required: true, message: '请填写略', trigger: 'change' },
      },
      createdFrom: {
        type: 'file',
        baitId: '',
        address: '',
        data: '',
      },
      typeOptions: [],
      loading: false,
    }
  },
  created() {
    this.getbaits()
  },
  methods: {
    async getbaits() {
      const res = await this.$Server('/getbaitsbytype', 'POST', {})

      if (!res.data) {
        this.totalCount = 0
        this.tableData = []

        return
      }

      const { list } = res.data
      this.typeOptions = list.map(item => {
        return {
          value: item.baitid,
          label: item.baitinfo,
        }
      })

    },
    async submit() {
      if (this.loading) return
      this.loading = true

      try {

        await this.$refs.createdFormRef.validate()

        // 应用管理下创建诱饵
        if (this.creationType === 'app') {
          const { agentId } = this.$route.params

          await this.$Server('/applicationbaitpolicyadd', 'POST', {
            AgentId: agentId,
            BaitId: this.createdFrom.baitId,
            Data: this.createdFrom.data,
            Type: this.createdFrom.type,
            Address: this.createdFrom.address
          })
        }

        // 蜜罐管理下创建诱饵
        if (this.creationType === 'cluster') {
          const { honeypotId } = this.$route.params

          await this.$Server('/honeybaitpolicyadd', 'POST', {
            HoneypotId: honeypotId,
            BaitId: this.createdFrom.baitId,
            Data: this.createdFrom.data,
            BaitType: this.createdFrom.type,
            Address: this.createdFrom.address
          })
        }

        this.$message.success('创建成功')

        setTimeout(() => {
          this.hide(true)
        }, 300)

      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
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
</style>
