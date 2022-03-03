<template>
  <span>

    <span v-for="j in checkList" v-if="j.value">

      <el-tag v-if="j.value" :type="j.value?'':'info'" style="margin: 2px;">{{ j.name }}</el-tag>
      <!-- <el-checkbox :checked="child.value" style="margin-right:20px;" @change="checkChange(child)">{{ child.name }}</el-checkbox> -->

    </span>

    <el-dialog :title="'请选择'+model.description" :visible.sync="dialogVisible" width="50%">
      <!-- <span></span> -->

      <el-form>
        <el-form-item v-for="(child,index) in checkList" :key="index" style="text-align: left;">

          <el-tag :type="child.value?'':'info'" style="margin-right: 10px;" @click="checkChange(child,index)">
            {{ child.name }}</el-tag>
          <!-- <el-checkbox :checked="child.value" style="margin-right:20px;" @change="checkChange(child)">{{ child.name }}</el-checkbox> -->

        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>

      </span>
    </el-dialog>
    <el-button size="mini" type="primary" style="margin: 2px;" icon="el-icon-set-up" @click="editButton()">选择
    </el-button>
  </span>

</template>

<script>
import {
  deleteHasAndBelongsToMany,
  putHasAndBelongsToMany
} from './general'
export default {
  name: 'CheckboxGroup',
  props: {
    'relationList': Object,
    'value': Object,
    'model': Object,
    'modelName': String,
    'index': String,

    whereObj: {
      type: Object,
      default: () => {}
    }

  },
  data() {
    return {
      checkList: {},
      dialogVisible: false

    }
  },
  watch: {
    value(newValue, oldValue) {
      console.log('asd')
      this.checkList = this.buildCheckboxList(this.model, this.value[this.index], false)
    }
  },
  created() {
    console.log(JSON.stringify(this.value.roles))

    this.checkList = this.buildCheckboxList(this.model, this.value[this.index], false)
  },
  methods: {
    editButton(row) {
      console.log(JSON.stringify(this.value.roles))
      this.checkList = this.buildCheckboxList(this.model, this.value[this.index], true)
      console.log(JSON.stringify(this.value.roles))
      this.dialogVisible = true
    },
    checkChange(i, index, list) {
      var _this = this
      console.log(index)
      if (i.value) {
        deleteHasAndBelongsToMany(this.modelName, this.value.id, this.index, i.id).then(response => {
          console.log(response)

          i.value = false
          // // list.value -= 1
          _this.$set(_this.checkList, index, {})
          _this.$set(_this.checkList, index, i)
          // _this.$set(i, "value", false)

          var valueList = _this.value[_this.index]
          for (var j in valueList) {
            if (valueList[0].id == i.id) {
              valueList.splice(j, 1)
            }
          }
          console.log(_this.value[_this.index])
        }).catch(error => {
          this.$message({
            message: Error,
            type: 'Error'
          })
        })
      } else {
        console.log(_this.model)
        var data = this.model.format.putObject || {}
        putHasAndBelongsToMany(this.modelName, this.value.id, this.index, i.id, this.model.format.putObject).then(response => {
          console.log(response)
          i.value = true
          _this.$set(_this.checkList, index, {})
          _this.$set(_this.checkList, index, i)
          // _this.$set(i, "value", true)
          // list.value -= 1

          console.log(_this.model.model)

          _this.value[_this.index].push(i)
          console.log(i)
          console.log(_this.value[_this.index])
        }).catch(error => {
          this.$message({
            message: Error,
            type: 'Error'
          })
        })
      }
      console.log(i)
    },
    buildCheckboxList(model, value, update) {
      var newList = {}
      if (value.length == 0 && !update) {
        return newList
      }

      var response = this.relationList[this.index]
      console.log(response)
      for (var i in response) {
        if (!newList[response[i].id]) {
          function getValue() {
            for (var j in value) {
              if (value[j].id == response[i].id) {
                // newList[response[i].id].value += 1
                return true
              }
            }
            return false
          }
          response[i].value = getValue()
          newList[response[i].id] = (response[i])
          // this.$set(value, response[i].id, {
          //   name: response[i].name,
          //   children: []
          // })
        }
      }
      console.log(newList)

      return newList
    }
  }
}
</script>

<style>
</style>
