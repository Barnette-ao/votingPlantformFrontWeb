<template>
  <span>

    <span v-for="j in checkList" v-if="j.value">

      <span v-for="(child,index) in j.list">

        <el-tag v-if="child.value" :type="child.value?'':'info'" style="margin: 2px;">{{ child.name }}</el-tag>
        <!-- <el-checkbox :checked="child.value" style="margin-right:20px;" @change="checkChange(child)">{{ child.name }}</el-checkbox> -->
      </span>

    </span>

    <el-dialog :title="'请选择'+model.description" :visible.sync="dialogVisible" width="50%">
      <!-- <span></span> -->
      <el-form>
        <el-form-item v-for="j in checkList" :label="j.name+':'" style="text-align: left;">

          <span v-for="(child,index) in j.list">

            <el-tag :type="child.value?'':'info'" style="margin-right: 10px;" @click="checkChange(child,index,j)">{{ child.name }}</el-tag>
            <!-- <el-checkbox :checked="child.value" style="margin-right:20px;" @change="checkChange(child)">{{ child.name }}</el-checkbox> -->
          </span>

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
      checkList: [],
      dialogVisible: false,
      updateData: {}
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.checkList = this.buildCheckboxList(this.model, this.value[this.index], false)
    }
  },
  created() {
    console.log(this.model)
    console.log(this.index)
    console.log(this.value)
    this.checkList = this.buildCheckboxList(this.model, this.value[this.index], false)
  },
  methods: {
    editButton(row) {
      this.checkList = this.buildCheckboxList(this.model, this.value[this.index], true)

      this.dialogVisible = true
    },
    checkChange(i, index, list) {
      if (i.value) {
        deleteHasAndBelongsToMany(this.modelName, this.value.id, this.model.model, i.id).then(response => {
				  console.log(response)

          i.value = false
          list.value -= 1
          this.$set(list.list, index, i)
          var valueList = this.value[this.model.model]
          for (var j in valueList) {
            if (valueList[0].id == i.id) {
              valueList.splice(j, 1)
            }
          }
        }).catch(error => {
				  this.$message({
				    message: Error,
				    type: 'Error'
				  })
        })
      } else {
        putHasAndBelongsToMany(this.modelName, this.value.id, this.model.model, i.id).then(response => {
				  console.log(response)
          i.value = true
          list.value -= 1
          this.value[this.model.model].push(i)
          this.$set(list.list, index, i)
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

		  var reloationName = model.format.model

		  var response = this.relationList[this.index]

		  for (var i in response) {
		    if (!newList[response[i][reloationName].id]) {
		      newList[response[i][reloationName].id] = {
		        name: response[i][reloationName].name,
		        list: [],
		        value: 0
		      }
					 }

					 function getValue() {
						 for (var j in value) {
						 			if (value[j].id == response[i].id) {
										 newList[response[i][reloationName].id].value += 1
              return true
            }
						 }
						 return false
					 }
					 response[i].value = getValue()
		    newList[response[i][reloationName].id].list.push(response[i])
		    // this.$set(value, response[i].id, {
		    //   name: response[i].name,
		    //   children: []
		    // })
		  }

		  console.log(newList)

		  return newList
    }
  }
}
</script>

<style>
</style>
