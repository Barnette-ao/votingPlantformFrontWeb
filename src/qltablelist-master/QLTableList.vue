<template>
  <div>

    <div class="filter-container">
      <List
        :json-list="jsonList"
        :model-name="modelName"
        :page-list="pageList"
        :get-data="getData"
        :get-list-info="getListInfo"
        :table-list="tableList"
        :table-data="tableData"
        :relation-list="relationList"
      />
    </div>

  </div>
</template>

<script>
import {
  generalGet,
  generalCount,
  generalOwnGet,
  generalOwnCount

} from './components/general'

import List from './TableList'
import {
  reloationListInit
} from './components/unit.js'
export default {
  components: {

    List
  },
  props: {
    'jsonList': Object,
    'modelName': String
    // whereObj: {
    //   type: Object,
    //   default: () => { return { state: 1 } }
    // }

  },
  data() {
    return {
      pageList: {
        currentPage: 1,
        pageSizes: [10, 50, 100, 200],
        pageSize: 10,
        pageCount: 0,
        total: 0
      },
      tableData: null,
      // pictureUrl: [],
      // curImgArr: [],
      relationList: {},
      tableList: {},
      includeObj: []

    }
  },
  computed: {

  },
  created() {
	  // this.whereObj = this.whereObj || { state: 1 }
    if (this.jsonList.byUser) {
      this.Get = generalOwnGet
      this.Count = generalOwnCount
    } else {
      this.Get = generalGet
      this.Count = generalCount
    }
	  // console.log(this.jsonList.whereObj)
    this.newWhereObj = Object.assign(this.jsonList.whereObj || {}, { state: 1 })
    // console.log(this.newWhereObj)
    // 去除的字段
    this.fields = {}
    for (var i in this.jsonList.deleteFields) {
      var fieldName = this.jsonList.deleteFields[i]
      delete this.jsonList.properties[fieldName]
      this.fields[fieldName] = false
    }
    this.tableList = reloationListInit(this)
    // sortObj(this.tableList)

    this.getData()
  },
  methods: {
    getData() {
      console.log((this.whereObj))
      // this.pageList.currentPage = 1
      this.newWhereObj = Object.assign(this.jsonList.whereObj || {}, { state: 1 })
      console.log(this.newWhereObj)
      for (var i in this.tableList) {
        if (this.tableList[i].search !== undefined && this.tableList[i].search !== '') {
          if (this.tableList[i].description && this.tableList[i].description.indexOf('ID') != -1) {
            this.newWhereObj[i] = this.tableList[i].search
          } else if (this.tableList[i].type == 'belongsTo') {
            this.newWhereObj[this.tableList[i].foreignKey] = this.tableList[i].search
          } else if (this.tableList[i].type == 'Number') {
            this.newWhereObj[i] = this.tableList[i].search
          } else {
			  if (this.jsonList.options.mysql) {
				  this.newWhereObj[i] = {

				    'like': '%' + this.tableList[i].search + '%'
				  }
			  } else {
				  this.newWhereObj[i] = {

				    'like': this.tableList[i].search
				  }
			  }
          }
        }
      }

      this.getListCount()
    },
    getListCount() {
      this.Count(this.modelName, {
        where: this.newWhereObj

      }).then(response => {
        this.pageList.total = response.count || 0
        console.log(this.pageList.total)
        this.pageList.pageCount = Math.ceil(this.pageList.total / this.pageList.pageSize)
        this.getListInfo(this.pageList.currentPage, this.pageList.pageSize)
      }).catch(error => {
        this.$message({
          message: Error,
          type: 'Error'
        })
      })
    },
    getListInfo(currentPage, pageSize) {
      this.Get(this.modelName, {
        filter: {
          fields: this.fields,
          where: this.newWhereObj,
          limit: pageSize,
          skip: (currentPage - 1) * pageSize,
          order: this.jsonList.order || 'date_created DESC',
          include: this.includeObj
        }
      }).then(response => {
        console.log(response)
        this.tableData = response
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
	/* .pager-box{
		text-align: center;
	} */
</style>
