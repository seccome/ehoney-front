<template>
  <el-dialog
    title="新建密签"
    width="520px"
    v-if="visible"
    custom-class="dialog-reset"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    :visible.sync="visible">
    <el-form
      ref="createdFormRef" :model="createdFrom" :rules="createdFormRules"
      class="created-from"
      v-loading="loading"
      label-width="75px">
      <el-form-item label="密签类型" prop="type">
        <select-opt v-model="createdFrom.type" select-type="getsigntype"
                    @change="handleChange"></select-opt>
      </el-form-item>
      <el-form-item label="密签选择" prop="signId">
        <el-select v-model="createdFrom.signId" placeholder="请选择">
          <el-option
            v-for="item in signsbytypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部署目录" prop="address">
        <el-input v-model="createdFrom.address" placeholder="部署目录"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer-box" slot="footer">
      <el-button size="small" @click="hide(false)">取消</el-button>
      <el-button size="small" type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  name: 'CreatedSign',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新建密签'
    },
    // app-应用管理下创建诱饵，cluster-蜜罐管理下创建诱饵
    addType: {
      type: String,
      default: 'app'
    }
  },
  created() {
    // this.getsigntype()
    // this.getsignsbytype()
  },
  data() {
    return {
      createdFormRules: {
        type: { required: true, message: '请选择密签类型', trigger: 'change' },
        signId: { required: true, message: '请选择密签选择', trigger: 'change' },
        address: { required: true, message: '请填写部署目录', trigger: 'blur' }
      },
      createdFrom: {
        type: '',
        signId: '',
        address: '',
      },
      signtypeList: [],
      signsbytypeList: [],
      loading: false
    }
  },
  methods: {
    async submit() {

      if (this.loading) return
      this.loading = true

      try {
        await this.$refs.createdFormRef.validate()

        if (this.addType === 'app') {
          const { agentId = '', } = this.$route.params

          await this.$Server('/applicationsignpolicyadd', 'POST', {
            agentId: agentId,
            ...this.createdFrom,
          })
        }

        if (this.addType === 'cluster') {
          const { honeypotId = '' } = this.$route.params

          await this.$Server('/honeysignpolicyadd', 'POST', {
            HoneypotId: honeypotId,
            ...this.createdFrom,
            signType: this.createdFrom.type
          })
        }

        setTimeout(() => {
          this.$message.success('新建成功')

          this.hide(true)
        }, 100)
      } catch (e) {console.log(e)} finally {
        this.loading = false
      }
    },
    async getsigntype() {
      try {
        const res = await this.$Server('/getsigntype', 'POST', {})

        if (!res.data) return

        this.signtypeList = res.data.map(item => {
          return {
            value: item.signtype,
            label: item.signtype
          }
        })
      } catch (e) {console.log(e)}

    },
    async getsignsbytype() {
      try {
        const res = await this.$Server('/getsignsbytype', 'POST', {
          type: this.createdFrom.type
        })

        if (!res.data) return

        const { list } = res.data
        this.signsbytypeList = list.map(item => {
          return {
            value: item.signid,
            label: item.signname
          }
        })
      } catch (e) {console.log(e)}

    },
    handleChange() {
      console.log('handleChange')
      this.getsignsbytype()
    },
    show() {
      this.visible = true
    },
    hide(isUpdate = false) {
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
