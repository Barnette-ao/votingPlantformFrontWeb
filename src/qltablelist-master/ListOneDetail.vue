<template>
  <div>
    <el-divider>{{ title }}</el-divider>

    <el-descriptions :border="true">

      <el-descriptions-item v-for="(item,key) in tableList" :key="key" :label="item.description">

        <span v-if="item.format">

          <span v-if="item.type=='Date'"> {{ $moment(dataList[key]).format("YYYY年MM月DD日 HH:mm:ss") }}</span>
          <span v-else-if="item.format.bsonType=='switch'||item.format.bsonType=='inputList'">
            {{ item.format.list[dataList[key]] }}
          </span>
          <span v-else-if="item.format.bsonType=='relation'&&dataList[key]">

            <span v-if="dataList[key].length">
              <span v-for="i in dataList[key]">
                <span v-if="item.format.nameKey">
                  {{ i[item.format.nameKey] }}
                </span>
                <span v-else>
                  {{ i.name }}
                </span>
              </span>
            </span>
            <span v-else-if="item.format.nameKey">
              {{ dataList[key][item.format.nameKey] }}
            </span>
            <span v-else>
              {{ dataList[key].name }}
            </span>

          </span>
        </span>
        <span v-else-if="item.type=='Date'"> {{ $moment(dataList[key]).format("YYYY年MM月DD日 HH:mm:ss") }}</span>

        <span v-else-if="key in dataList">{{ dataList[key] }}</span>

      </el-descriptions-item>

    </el-descriptions>
    <el-row type="flex" class="row-bg" justify="end">
      <EditData
        v-if="!(jsonList.hideList&&jsonList.hideList.edit)"
        style="margin-top: 20px;"
        :value="value"
        :json="jsonList"
        :table-list="tableList"
        :model-name="modelName"
        :get-data="getData"
        :relation-list="relationList"
      />
    </el-row>
  </div>
</template>

<script>

import EditData from './EditData'
import { reloationListInit } from './components/unit.js'

export default {
  name: 'ListOneDetail',
  components: {
    EditData
  },
  props: {
    'value': Object,
    'json': Object,
    title: String,
    modelName: String,
    getData: { type: Function }
  },
  data() {
    return {
      dataList: {},
      dialogVisible: false,
      updateData: {},
	  tableList: {},
	  relationList: {},
	  jsonList: {}
    }
  },
  watch: {
    value(newV, oldV) {
			     // do something
			    this.dataList = newV
      this.value = newV
			   }

  },
  created() {
    this.dataList = this.value

    this.jsonList = this.json

    this.tableList = reloationListInit(this)

    // sortObj(tempList)
  },
  methods: {

  }
}
</script>

<style>
</style>
