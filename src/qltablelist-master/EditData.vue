<template>
  <span>

    <el-button
      v-if="type=='edit'&&!(jsonList.hideList&&jsonList.hideList.edit)"
      size="mini"
      type="primary"
      style="margin: 2px;"
      @click="editButton(data)"
    >编辑
    </el-button>
    <el-button
      v-if="type=='create'&&!(jsonList.hideList&&jsonList.hideList.create)"
      size="mini"
      type="primary"
      @click="editButton()"
    >新建</el-button>

    <!-- <el-button
        size="mini"
        type="primary"
        style="margin: 2px;"
        @click="editButton(data)"
      >新增
      </el-button> -->

    <!-- 编辑框 -->
    <el-dialog
      v-if="dialogVisible"
      title="请输入内容"
      :visible.sync="dialogVisible"
      width="90%"
      :before-close="handleClose"
    >
      <!-- <span></span> -->
      <el-form v-if="dialogVisible" label-width="120px">
        <el-form-item v-for="(i,key) in updateData" v-if="i.obj.hiden!=true" :label="i.description||key">

          <span v-if="i.obj.format">
            <span v-if="i.obj.format.bsonType=='switch'">
              {{ i.obj.format.list[0] }}
              <el-switch
                v-model="i.value"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              >
                >
              </el-switch>
              {{ i.obj.format.list[1] }}

            </span>
            <span v-else-if="i.obj.format.bsonType=='imageUpload'">

              <el-upload
                class="avatar-uploader"
                :action="$VUE_APP_PIC_API"
                :data="ossInfo"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="onSuccessAva.bind(null, i)"
                :on-error="onErrorAva"
                accept=".jpg,.jpeg,.png"
              >
                <img
                  v-if="i.value"
                  :src="$VUE_APP_PIC_API+i.value+'?x-oss-process=image/auto-orient,1/resize,m_lfit,w_300/quality,q_90'"
                  class="avatar"
                  style="width: 270px;height: 270px;"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </span>
            <span v-else-if="i.obj.format.bsonType=='picture'">
              <el-input v-model="i.value" :type="'string'" />
            </span>
            <span v-else-if="i.obj.format.bsonType=='datePicker'">
              <el-date-picker v-model="i.value" type="datetime" :placeholder="'选择'+i.description||key" />
            </span>
            <span v-else-if="i.obj.format.bsonType=='enum'">
              <el-select v-model="i.value" :placeholder="'请选择'+i.description||key">
                <el-option
                  v-for="(item,index) in i.obj.format.list"
                  :key="index"
                  :label="item"
                  :value="index"
                />
              </el-select>
            </span>

            <span v-else-if="i.obj.format.bsonType=='richText'">

              <tinymce v-model="i.value" :height="600" />
            </span>
            <span
              v-else-if="i.type=='belongsTo'&&i.obj.format.bsonType=='relation'&&!i.obj.format.doNotGetList"
            >

              <el-select v-model="updateData[i.obj.foreignKey].value" placeholder="请选择" clearable>

                <el-option v-for="j in relationList[key]" :key="j.id" :label="j[i.obj.format.nameKey]" :value="j.id" />

              </el-select>
            </span>
            <span v-else-if="i.obj.format.bsonType=='object'||i.obj.format.bsonType=='array'">
              <el-input v-model="i.value" :type="i.type" />
            </span>
            <span v-else>

              <span>在列表中操作</span>
            </span>
          </span>
          <span v-else-if="i.type=='Number'">
            <el-input v-model="i.value" :type="i.type" />
          </span>
          <span v-else-if="i.type=='Date'">
            <el-date-picker v-model="i.value" type="datetime" :placeholder="'选择'+i.description||key" />
          </span>
          <span v-else>
            <el-input v-model="i.value" :type="i.type" />

          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="isSaving" @click="saveData()">确 定</el-button>
      </span>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import {
  generalPost,
  generalPatchOne,
  generalOwnPost,
  generalOwnPatchOne

} from './components/general'
import {
  getSSOtoken
} from './components/commons'
import Tinymce from './components/Tinymce'

export default {
  name: '',
  components: {
    Tinymce
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
      data: {
        id: null
      },
      type: 'edit',
      dialogVisible: false,
      updateData: {},
      ossInfo: null,
      isSaving: false
    }
  },
  watch: {
    value(newV, oldV) {
      // do something
      this.data = newV
      if (!this.data.id) {
        this.type = 'create'
      } else {
        this.type = 'edit'
      }
      console.log(this.data)
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
    this.data = this.value

    // if (!this.value.id) {
    //   this.type = 'create'
    // } else {
    //   this.type = 'edit'
    // }
    this.jsonList = this.json
    if (this.jsonList.byUser) {
      this.Post = generalOwnPost
      this.PatchOne = generalOwnPatchOne
    } else {
      this.Post = generalPost
      this.PatchOne = generalPatchOne
    }
  },
  methods: {

    editButton(row) {
      console.log(row)
      if (row) {
        this.updateObj = JSON.parse(JSON.stringify(row))
      } else {
        this.updateObj = null
      }
      this.updateData = {}
      console.log(this.tableList)
      for (var i in this.tableList) {
        var temp = this.tableList[i]
        if (i != 'id' && i != 'date_created') {
          var _value = null
          if (this.updateObj) { // 更新
            console.log(row[i])
            if (row[i]) {
              _value = JSON.parse(JSON.stringify(row[i]))
            } else {
              _value = row[i]
            }
            // 选择数组
          } else { // 新增
            _value = temp.default || ''
            console.log(temp)
            if (temp.type == 'array') {
              _value = []
            }
            if (temp.type == 'object') {
              _value = {}
            }
          }
          this.$set(this.updateData, i, {
            description: temp.description,
            value: _value,
            type: temp.type,
            obj: temp
          })
        }
      }
      console.log(this.updateData)
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    saveData() {
      this.isSaving = true
      var postData = {}
      for (var i in this.updateData) {
        var temp = this.updateData[i]

        if (temp.value === 0 || temp.value) {
          postData[i] = temp.value
          if (temp.type == 'array') {
            postData[i] = (postData[i])
          }
        }
      }
      if (!(this.updateObj && this.updateObj.id)) {
        this.Post(this.modelName, postData).then(response => {
          console.log(response)
          if (response.id) {
            this.dialogVisible = false
            this.getData()
            this.isSaving = false
          }
        }).catch(error => {
          this.$message.error(error)
          this.isSaving = false
        })
      } else {
        this.PatchOne(this.modelName, this.updateObj.id, postData).then(response => {
          console.log(response)
          if (response.id) {
            this.dialogVisible = false
            this.getData()
            this.isSaving = false
          }
        }).catch(error => {
          this.$message.error(error)
          this.isSaving = false
        })
      }
    },
    onSuccessAva(obj, response, file, fileList) {
      // this.temp.img = file.raw.info
      this.$set(obj, 'value', file.raw.info)
    },
    onErrorAva(error) {
      console.log(error)
    },
    async beforeAvatarUpload(file) {
      console.log('asdfasdss')
      await getSSOtoken().then(res => {
        console.log(1)
        const self = this
        const suffix = file.name.split('.')[file.name.split('.').length - 1]
        console.log(2)
        const fileName = this.$moment().format('YYYY/MM/DD/') + this.$randomCharacter(20) +
                        '.' +
                        suffix
        console.log(3)
        const key = 'images/' + fileName
        file.info = key
        console.log(4)
        res.key = key
        this.ossInfo = res
        console.log(5)
      })
    }

  }
}
</script>

<style>
</style>
