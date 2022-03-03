<template>
  <span>
    <el-select v-model="selectValue" clearable placeholder="请选择" @change="selectChange">
      <el-option
        v-for="item in relationList[index]"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />

    </el-select>
  </span>

</template>

<script>
import {
  generalPatch,
  generalReplace
} from './general'
export default {
  name: 'SelectAndSet',
  props: {
    'relationList': Object,
    'value': Object,
    'model': Object,
    'modelName': String,
    'index': String

  },
  data() {
    return {
      selectValue: null
    }
  },
  watch: {

  },
  created() {
    console.log('asd')
    console.log(this.relationList)// 选项的数组
    console.log(this.value)// 这一行数据对象
    console.log(this.model)// json里定义的model
    console.log(this.modelName)// model名字
    console.log(this.index)// 字段名
    this.selectValue = this.value[this.model.foreignKey] || null
    //
  },
  methods: {
    selectChange(data) {
      console.log(data)
      var postData = {}
      postData[this.model.foreignKey] = data
      generalPatch(this.modelName, this.value.id, postData).then(response => {
        console.log(response)
      }).catch(error => {
        this.$message({
          message: Error,
          type: 'Error'
        })
      })
    }
  }
}
</script>

<style>
</style>
