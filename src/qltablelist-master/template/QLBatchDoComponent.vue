<template>
  <div>{{ multipleSelection }}</div>
</template>
<script>
export default {
  name: 'QLBatchDoComponent',
  components: {},
  props: {
    'jsonList': Object, // json文件内容
    multipleSelection: Array, // 选中的行的数据
    getData: { // 重新获取数据的回调函数
      type: Function
    }
  },
  data() {
    return {}
  },
  watch: {
    value(newValue, oldValue) { // 监听value值得改变并更新
      value = newValue
    }
  },
  created() {},
  methods: {}
}
</script>
<style>
</style>
