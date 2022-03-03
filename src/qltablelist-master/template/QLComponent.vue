<template>
  <div>{{ value }}</div>
</template>
<script>
export default {
  name: 'QLComponent',
  components: {},
  props: {
    'relationList': Object, // model关系的列表
    'value': Object, // 当前这条数据的所有值
    'model': Object, // json文件中当前字段的配置内容
    'modelName': String, // model的名字
    'index': String, // 当前这条数据在表格中的索引
    whereObj: { // 数据查询条件
      type: Object,
      default: () => {}
    },
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
