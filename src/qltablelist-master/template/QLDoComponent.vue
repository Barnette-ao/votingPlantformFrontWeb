<template>
  <div>{{ value }}</div>
</template>
<script>
export default {
  name: 'QLDoFrameComponent',
  components: {},
  props: {
    'jsonList': Object, // json文件内容
    'value': Object, // 当前这条数据的所有值
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
