<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.username" placeholder="Reset Username"/>
    </el-form-item>
    <el-form-item label="Introduction">
      <el-input v-model.trim="user.introduction" placeholder="Reset Introduction"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          password:'',
          introduction: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
