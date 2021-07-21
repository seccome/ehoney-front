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
  name: 'RedisSetting',
  components: {
    SettingPage,
  },
  data() {
    return {
      tableColumns: [
        {
          label: 'redis地址',
          key: 'redisurl'
        },
        {
          label: 'redis端口',
          key: 'redisport'
        },
        {
          label: '密码',
          key: 'password'
        },
      ],
      rules: {
        redisip: { required: true, message: '请输入Redis IP', trigger: 'blur' },
        redisport: { required: true, message: '请输入Redis 端口', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
      },
      formItems: [
        {
          label: 'Redis IP',
          key: 'redisip',
          type: 'input',
          placeholder: '填写示例：127.0.0.1'
        },
        {
          label: 'Redis 端口',
          key: 'redisport',
          type: 'input'
        },
        {
          label: '密码',
          key: 'password',
          type: 'password'
        },
      ],
      form: {
        redisip: '',
        redisport: '',
        password: '',
      },
      functions: {
        getList: 'getredisinfo',
        delete: this.deleteredisinfo,
        add: 'addredisconfig'
      }
    }
  },
  methods: {
    async deleteredisinfo(item) {
      const res = await this.$Server(`/deleteredisinfo`, 'POST', {
        redisid: item.redisid,
      })
      return res
    }
  }
}
</script>
