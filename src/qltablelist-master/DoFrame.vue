<template>
  <span>
    <el-button
      v-if="json.pageDetails"
      size="mini"
      type="success"
      style="margin: 2px;"
      @click="detailsButton(json.pageDetails,value)"
    >详情
    </el-button>
    <EditData
      :value="value"
      :json="json"
      :table-list="tableList"
      :model-name="modelName"
      :get-data="getData"
      :relation-list="relationList"
    />

    <el-button
      v-if="!(json.hideList&&json.hideList.disabled)&&value.state"
      size="mini"
      type="danger"
      style="margin: 2px;"
      @click="disabledButton(value)"
    >失效
    </el-button>
    <el-popconfirm
      v-if="!(json.hideList&&json.hideList.delete)"
      title="删除后不可恢复,确定删除吗？"
      @confirm="deleteButton(value)"
    >
      <el-button slot="reference" size="mini" type="danger" style="margin: 2px;">删除
      </el-button>

    </el-popconfirm>
    <component
      :is="component.name"
      v-for="(component,keyC) in json.componentsDoList"
      :key="value.id+keyC"
      style="margin: 2px;"
      :value="value"
      :get-data="getData"
      :json-list="json"
    >
      <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>

  </span>
</template>

<script>
import {

  generalPatchOne,
  generalDelete,
  generalOwnPatchOne,
  generalOwnDelete
} from './components/general'
import EditData from './EditData'
export default {
  name: 'ListOneDetail',
  components: {
    EditData
  },
  props: {
    'value': Object,

    'json': Object,
    modelName: String,
    getData: {
      type: Function
    },
    tableList: Object,
    relationList: Object
  },
  data() {
    return {

    }
  },
  watch: {
    value(newV, oldV) {
      // do something
      this.value = newV
    },
    json(newV, oldV) {
      // do something
      this.json = newV

      console.log(this.data)
    },
    tableList(newV, oldV) {
      this.tableList = newV
    }

  },
  created() {
    // 操作下的自定义插件
    if (this.json.componentsDoList) {
      for (var i in this.json.componentsDoList) {
        console.log(this.json.componentsDoList[i])
        this.$options.components[this.json.componentsDoList[i].name] = this.json.componentsDoList[i].component
      }
    } else {
      this.json.componentsDoList = []
    }
    if (this.json.byUser) {
      this.Delete = generalOwnDelete
      this.PatchOne = generalOwnPatchOne
    } else {
      this.Delete = generalDelete
      this.PatchOne = generalPatchOne
    }
  },
  methods: {
    deleteButton(row) {
      console.log(row)
      this.Delete(this.modelName, row.id).then(response => {
        console.log(response)
        this.$message({
          message: '删除成功。'
        })
        this.getData()
      }).catch(error => {
        this.$message.error(error)
      })
    },
    detailsButton(url, row) {
      const {
        href
      } = this.$router.resolve({
        path: url + row.id,
        params: {}
      })
      window.open(href, '_blank')
    },
    disabledButton(row) {
      console.log(row)
      this.PatchOne(this.modelName, row.id, {
        state: 0
      }).then(response => {
        console.log(response)
        this.getData()
        this.$message({
          message: '失效成功。'
        })
        this.getData()
      }).catch(error => {
        this.$message.error(error)
      })
    }
  }
}
</script>

<style>
</style>
