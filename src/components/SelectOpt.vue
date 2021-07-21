<template>
  <el-select v-model="innerVal" placeholder="请选择" @change="changeValue">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectOpt',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    selectType: {
      type: String,
      default: '',
    },
    value: {
      required: true
    }
  },
  data() {
    return {
      options: [],
      innerVal: '',
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.innerVal = val
      }
    },
    selectType: {
      immediate: true,
      handler(type) {
        this.getOption(type)
      }
    }
  },
  created() {
  },
  methods: {
    async getOption(type) {
      if (!type) return

      const typeMap = {
        // 系统类型
        getsystype: '/getsystype',
        // 诱饵类型
        getAllBaitType: '/getAllBaitType',
        // 蜜罐列表诱饵类型
        getAllHoneyBaitType: '/getallhoneybaittype',
        // 蜜罐类型
        gethoneypotstype: '/gethoneypotstype',
        // 密签类型
        getsigntype: '/getsigntype'
      }

      const res = await this.$Server(typeMap[type], 'POST', {})

      if (!res.data) {
        this.totalCount = 0
        this.tableData = []

        return
      }

      const { data } = res

      this.options = data.map(item => {
        if (type === 'getsystype') {
          return {
            label: item.sysType,
            value: item.sysId
          }
        }

        if (type === 'getAllBaitType' || type === 'getAllHoneyBaitType') {
          return {
            label: item.baitType,
            value: item.baitType,
          }
        }

        if (type === 'gethoneypotstype') {
          return {
            label: item.honeyPotType,
            value: item.honeyTypeId
          }
        }

        if (type === 'getsigntype') {
          return {
            label: item.signtype,
            value: item.signtype
          }
        }
      })

    },
    changeValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
