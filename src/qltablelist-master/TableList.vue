<template>
  <div>

    <el-row type="flex" class="row-bg" justify="end" style="margin-bottom: 20px;">

      <BatchDoFrame
        :value="{}"
        :json="jsonList"
        :table-list="tableList"
        :model-name="modelName"
        :get-data="getData"
        :relation-list="relationList"
        :multiple-selection="multipleSelection"
      />
    </el-row>

    <!-- <date-picker @getData="getData" :start_date="start_date" :end_date="end_date" style="margin-bottom: 20px;"></date-picker> -->
    <el-table class="t1" :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
      <div v-if="tableList">
        <el-table-column

          type="selection"
          width="55"
        />
      </div>
      <div v-for="(item, key) in tableList" v-if="item.hiden!=true&&item.type!='password'">

        <el-table-column :prop="key" width="180" :label="item.description||key">

          <el-table-column>
            <template slot-scope="scope">
              <span v-if="item.format">
                <span v-if="item.type=='Date'">
                  {{ $moment(scope.row[key]).format("YYYY年MM月DD日 HH:mm:ss") }}
                </span>
                <span v-else-if="item.format.bsonType=='switch'||item.format.bsonType=='inputList'">
                  {{ item.format.list[scope.row[key]] }}
                </span>
                <span v-else-if="item.format.bsonType=='object'">
                  <span v-if="scope.row[key]">
                    {{ scope.row[key][ item.format.key] }}
                  </span>

                </span>
                <span v-else-if="item.format.bsonType=='array'">
                  <span v-if="scope.row[key]">
                    <span v-for="one in scope.row[key]">
                      {{ one[item.format.key] }}
                    </span>
                  </span>

                </span>
                <span v-else-if="item.format.bsonType=='enum'">
                  {{ item.format.list[scope.row[key]] }}
                </span>
                <span v-else-if="item.format.bsonType=='relation'&&scope.row[key]">
                  <span v-if="item.type=='hasMany'">

                    <span v-for="h in scope.row[key]">{{ h[item.format.nameKey] }}</span>
                  </span>
                  <span v-else>
                    <span
                      v-if="item.format.nameKey"
                    >{{ scope.row[key][item.format.nameKey] }}</span>
                    <span v-else>{{ scope.row[key].name }}</span>
                  </span>

                </span>

                <span v-else-if="item.format.bsonType=='picture'">
                  <el-image :src="scope.row[key]" style="height: 100px;width: 100px;" fit="contain" />
                </span>
                <span v-else-if="item.format.bsonType=='imageUpload'">
                  <el-image v-if="scope.row[key]"
                    :src="$VUE_APP_PIC_API+scope.row[key]+'?x-oss-process=image/auto-orient,1/resize,m_lfit,w_300/quality,q_90'"
                  />
                </span>
                <!-- <span v-else-if="item.format.bsonType=='checkboxArray2'">
                    <CheckboxGroup :index="key" :relation-list="relationList" :value="scope.row" :model="item" :model-name="modelName" />

                  </span> -->
                <span v-else-if="item.format.bsonType=='richText'">

                  <el-button
                    size="mini"
                    type="primary"
                    @click="openWindows(scope.row[key],item.description||key)"
                  >查看</el-button>
                </span>
                <span v-else>

                  <component
                    :is="component.name"
                    v-for="component in jsonList.componentsList"
                    v-if="item.format.bsonType==component.name"
                    :key="scope.row[key].id"
                    :index="key"
                    :relation-list="relationList"
                    :value="scope.row"
                    :model="item"
                    :model-name="modelName"
                    :get-data="getData"
                  >
                    <!-- 组件在 vm.currentview 变化时改变！ -->
                  </component>
                </span>

              </span>
              <span v-else-if="item.type=='Date'">
                {{ $moment(scope.row[key]).format("YYYY年MM月DD日 HH:mm:ss") }}
              </span>
              <span v-else-if="scope.row[key]">
                {{ scope.row[key].toString() }}
                <!-- {{ item }} -->
              </span>
              <span v-else>
                {{ scope.row[key]||"" }}
                <!-- {{ item }} -->
              </span>

              <!-- <span v-if="(typeof item.description!='object')||item.description.length==1">

                </span>

                <span v-else-if="item.description[1].type=='inputArray'">
                  <el-tag v-for="tag in scope.row[key]">{{ tag.name }}</el-tag>
                </span>

                <span v-else-if="item.description[1].type=='choiceArray'">
                  <p v-for="(p) in scope.row[key]">
                    <span>{{ p.name+':' }}</span>
                    <el-tag v-for="(tag) in p.children">{{ tag }}</el-tag>
                  </p>
                </span>

                <span v-else-if="scope.row[key]">
                  {{ scope.row[key].toString() }}
                  {{ item }}
                </span> -->
            </template>

            <template slot="header" slot-scope="{}">
<!-- //搜索区域 -->
              <span v-if="item.format">
                <span v-if="item.format.bsonType=='switch'||item.format.bsonType=='enum'">
                  <el-select v-model="item.search" placeholder="请选择" clearable>
                    <el-option
                      v-for="(j,index) in item.format.list"
                      :key="index"
                      :label="j"
                      :value="index"
                    />

                  </el-select>

                </span>

                <span
                  v-else-if="item.type=='belongsTo'&&item.format.bsonType=='relation'&&(!item.format.doNotGetList)"
                >

                  <el-select v-model="item.search" placeholder="请选择" clearable>
                      
                    <el-option
                      v-for="j in relationList[key]" 
                      :key="j.id"
                      :label="j[item.format.nameKey]"
                      :value="j.id"
                    />
                  </el-select>
                </span>
              </span>
              </span>
              <span v-else-if="item.search!=null">

                <el-input
                  v-model="item.search"
                  size="mini"
                  :placeholder="item.description||key+'搜索'"
                  clearable
                />
              </span>
            </template>
          </el-table-column>

        </el-table-column>

      </div>

      <el-table-column label="操作" align="center">
        <template slot="header">
          操作
        </template>
        <el-table-column label="操作">
          <template slot="header">
            <el-button size="mini" type="primary" @click="getData()">搜索</el-button>

          </template>
          <template slot-scope="{row}">

            <DoFrame
              :value="row"
              :json="jsonList"
              :table-list="tableList"
              :model-name="modelName"
              :get-data="getData"
              :relation-list="relationList"
            />

          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="pager-box">
      <el-pagination
        background
        :current-page.sync="pageList.currentPage"
        :page-size="pageList.pageSize"
        :page-sizes="pageList.pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageList.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 富文本 -->
    <el-dialog :title="richTextTitle" :visible.sync="dialogVisibleRichText" width="50%" :before-close="handleClose">
      <span v-html="richTextValue" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisibleRichText = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisibleRichText = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>


import Tinymce from './components/Tinymce'
import DoFrame from './DoFrame'
import BatchDoFrame from './BatchDoFrame'
export default {
  components: {
    DoFrame,
    BatchDoFrame,
    Tinymce
  },
  props: {
    'jsonList': Object,
    'modelName': String,

    // whereObj: {
    //   type: Object,
    //   default: () => {}
    // },
    pageList: Object,
    getData: {
      type: Function
    },
    tableData: Array,
    getListInfo: {
      type: Function
    },
    tableList: Object,
    relationList: Object
  },
  data() {
    return {

      // pictureUrl: [],
      // curImgArr: [],
      dialogVisible: false,

      choiceArray: {},
      dialogVisibleRichText: false,
      richTextTitle: '',
      richTextValue: '',
      multipleSelection: []

    }
  },
  computed: {

  },
  watch: {
    pageList(newV, oldV) {
      this.pageList = newV
    },
    tableData(newV, oldV) {
      console.log(newV)
      this.tableData = newV
    }
  },
  created() {
    // this.newWhereObj = Object.create(this.whereObj)

    // 列表中的动态插件
    if (this.jsonList.componentsList) {
      for (var i in this.jsonList.componentsList) {
        console.log(this.jsonList.componentsList[i])
        this.$options.components[this.jsonList.componentsList[i].name] = this.jsonList.componentsList[i].component
      }
    } else {
      this.jsonList.componentsList = []
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      // this.pageSize = val
      this.pageList.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.pageList.currentPage = val
      this.getListInfo(this.pageList.currentPage, this.pageList.pageSize)
      console.log(`当前页: ${val}`)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },

    openWindows(html, title) {
      console.log(html)
      this.richTextTitle = title
      this.richTextValue = html
      this.dialogVisibleRichText = true
    }

  }
}

</script>
<style>
	/* .pager-box{
		text-align: center;
	} */
</style>
