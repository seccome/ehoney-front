<template>
  <setting-page
    :tableColumns="tableColumns"
    :rules="rules"
    :formItems="formItems"
    :functions="functions"
    :form="form"
  ></setting-page>
</template>

<script>
import SettingPage from './Setting'
export default {
  name: 'MirrorSetting',
  components: {
    SettingPage,
  },
  data() {
    return {
      tableColumns: [
        {
          label: 'harbor url',
          key: 'harborurl'
        },
        {
          label: '用户名',
          key: 'username'
        },
        {
          label: '密码',
          key: 'password'
        },
        {
          label: '项目名',
          key: 'projectname'
        },
      ],
      rules: {
        harborUrl: { required: true, message: '请输入harbor url', trigger: 'blur' },
        userName: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        projectName: { required: true, message: '请输入项目名', trigger: 'blur' },
      },
      formItems: [
        {
          label: 'HarborUrl',
          key: 'harborUrl',
          type: 'input'
        },
        {
          label: '用户名',
          key: 'userName',
          type: 'input'
        },
        {
          label: '密码',
          key: 'password',
          type: 'password'
        },
        {
          label: '项目名',
          key: 'projectName',
          type: 'input'
        },
      ],
      form: {
        harborUrl: '',
        userName: '',
        password: '',
        projectName: ''
      },
      functions: {
        getList: 'getharborinfo',
        delete: this.deleteharborinfo,
        add: 'addharborconfig'
      }
    }
  },
  methods: {
    async deleteharborinfo(item) {
      const res = await this.$Server(`/deleteharborinfo`, 'POST', {
        HarborId: item.harborid,
      })
      return res
    }
  }
}
</script>
