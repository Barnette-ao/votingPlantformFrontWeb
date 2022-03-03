<template>
  <span>
    <component
      :is="component.name"
      v-for="(component,keyC) in json.componentsBatchDoList"
      :key="value.id+keyC"
      :value="value"
      :get-data="getData"
      :json-list="json"
      style="margin-right: 10px;"
      :multiple-selection="multipleSelection"
    >
      <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>
    <el-button
      v-if="!(json.hideList&&json.hideList.disabled)"
      :disabled="multipleSelection.length==0"
      size="mini"
      type="danger"
      style="margin-right: 10px;"
      @click="disabledButton()"
    >批量失效
    </el-button>

    <el-popconfirm
      v-if="!(json.hideList&&json.hideList.delete)"
      title="删除后不可恢复,确定删除吗？"
      @confirm="deleteButton()"
    >
      <el-button slot="reference" size="mini" type="danger" style="margin-right: 10px;" :disabled="multipleSelection.length==0">批量删除
      </el-button>

    </el-popconfirm>
    <el-button size="mini" type="primary" style="margin-right: 10px;" @click="getData()">刷新</el-button>

    <EditData
      :value="value"
      :json="json"
      :table-list="tableList"
      :model-name="modelName"
      :get-data="getData"
      :relation-list="relationList"
    />

  </span>
</template>

<script>
import {
  generalPost,
  generalPatch,
  generalUpdate,
  generalDelete

} from './components/general'
import EditData from './EditData'
export default {

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
    relationList: Object,
    multipleSelection: Array
  },
  data() {
    return {
      data: {
        id: null
      }

    }
  },
  watch: {
    value(newV, oldV) {
      // do something
      this.value = newV

      // console.log(this.data)
    },
    json(newV, oldV) {
      // do something
      this.json = newV

      // console.log(this.data)
    },
    tableList(newV, oldV) {
      this.tableList = newV
    },
    multipleSelection(newV, oldV) {
      // console.log(newV)
      this.multipleSelection = newV
    }

  },
  created() {
    // 操作下的自定义插件
    // console.log(this.json)
    if (this.json.componentsBatchDoList) {
      for (var i in this.json.componentsBatchDoList) {
        // console.log(this.json.componentsBatchDoList[i])
        this.$options.components[this.json.componentsBatchDoList[i].name] = this.json.componentsBatchDoList[i].component
      }
    } else {
      this.json.componentsBatchDoList = []
    }
  },
  methods: {
    disabledButton() {
      var row = []
      for (var i in this.multipleSelection) {
        row.push(this.multipleSelection[i].id)
      }
      generalUpdate(this.modelName, { id: { inq: row }}, { state: 0 }).then(response => {
        console.log(response)

        this.$message({
          message: '失效成功。'
        })
        this.getData()
      }).catch(error => {
        this.$message.error(error)
      })
    },
    deleteButton() {
      var row = []
      for (var i in this.multipleSelection) {
        row.push()
        generalDelete(this.modelName, this.multipleSelection[i].id).then(response => {
          console.log(response)

          this.$message({
            message: this.multipleSelection[i].id + '删除成功。'
          })
          this.getData()
        }).catch(error => {
          this.$message.error(error)
        })
      }
    }

  }
}
</script>

<style>
</style>
