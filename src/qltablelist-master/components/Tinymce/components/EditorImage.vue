<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="$VUE_APP_PIC_API"
        list-type="picture-card"
        :data="ossInfo"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        完成
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import {
  getSSOtoken
} from '../../commons'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      ossInfo: null
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log(file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      console.log(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        console.log(this.listObj[objKeyArr[i]].uid + ':' + uid)
        if (this.listObj[objKeyArr[i]].uid == uid) {
          console.log(this.listObj[objKeyArr[i]])
          this.listObj[objKeyArr[i]].url = this.$VUE_APP_PIC_API + file.raw.info
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
      console.log(this.listObj)
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    async beforeUpload(file) {
      const _self = this
      console.log('+++++++++++++')
      await getSSOtoken().then(res => {
        console.log(res)
        const suffix = file.name.split('.')[file.name.split('.').length - 1]

        const fileName = this.$moment().format('YYYY/MM/DD/') + this.$randomCharacter(20) + '.' + suffix
        const key = 'imagesNews/' + fileName
        console.log(key)
        file.info = key
        file.fileName = fileName
        res.key = key
        console.log(file)
        var uid = file.uid.toString()
        console.log(uid)
        this.ossInfo = res
        _self.listObj[uid] = { hasSuccess: false, uid: uid, width: 200 }
        console.log(_self.listObj)
        // resolve(true)
      })

      // const _self = this
      // const _URL = window.URL || window.webkitURL
      // const fileName = file.uid
      // this.listObj[fileName] = {}
      // return new Promise((resolve, reject) => {
      //   const img = new Image()
      //   img.src = _URL.createObjectURL(file)
      //   img.onload = function() {
      //     _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
      //   }
      //   resolve(true)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
