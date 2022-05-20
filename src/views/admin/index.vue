<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
				@click="addPlantformUser">
				添加用户
			</el-button>
			<el-dialog :title="thisType == 'add'?'添加用户':'编辑用户'" :visible.sync="dialogFormVisible"
				:fullscreen="fullscreen">
				<el-form ref="dataForm" :model="form" :label-position="labelPosition">
					<el-form-item label="用户名" :label-width="formLabelWidth">
						<el-input v-model="form.username" autocomplete="off" ></el-input>
					</el-form-item>
          <el-form-item label="用户密码" v-model="isShow" v-if="isShow==true" :label-width="formLabelWidth">
          	<el-input v-model="form.password" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="用户角色" :label-width="formLabelWidth">
          	<el-select v-model="form.roles" placeholder="请选择用户角色">
          		<el-option label="普通用户" value="user"></el-option>
          		<el-option label="管理员" value="admin"></el-option>
          	</el-select>
          </el-form-item>
					<el-form-item label="添加时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.createdTime" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="用户介绍" :label-width="formLabelWidth">
						<tinymce refs="introduction" v-model="form.introduction" :height="300" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="clickOK()">确 定</el-button>
				</div>
			</el-dialog>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="username" label="用户名称" width="180">
				</el-table-column>
        <el-table-column prop="roles" label="用户角色" width="180">
        </el-table-column>
				<el-table-column prop="createdTime" label="添加时间" width="240">
					<template slot-scope="scope">
						<i class="el-icon-time"></i>
						<span
							style="margin-left: 10px">{{ scope.row.createdTime | dateFilter('YYYY-MM-DD HH:MM:SS') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="editPlantformUser(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deletePlantformUser( scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
				layout="prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>


<script>
	import Tinymce from '@/components/Tinymce'
  import { getToken } from '@/utils/auth'
	import {
		createPlantformUser,
		getPlantformUserList,
		getPlantformUserListCount,
		getOnePlantformUser,
		editUserInfo
	} from '@/api/user'
	export default {
		components: {
			Tinymce
		},
		data() {
			return {
        isShow:false,
				thisType: "add",
				labelPosition: "right",
				dialogFormVisible: false,
				formLabelWidth: "120px",
				fullscreen: true,
				form: {
					username: "",
          password:"",
          roles:"",
					isAdmin:"",
					createdTime: "",
					introduction: ""
				},
				total: 0,
				pageSize: 10,
				pageCount: 0,
				currentPage: 1,
				tableData: []
			}
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.getPlantformUserListCount(),
				this.getPlantformUserList()
			},
			resetTemp() {
				this.form = {
					username: "",
          password:"",
          roles:"",
          isAdmin: false,
					createdTime: new Date(),
					introduction: ""
				}
				this.$nextTick(() => {
					this.$refs.introduction.setContent("");
				})
			},
			getPlantformUserListCount() {
				getPlantformUserListCount({
					where: {
						state: 0
					}
				}).then(response => {
					// console.log(response)
					this.total = response.count;
					this.pageCount = Math.ceil(this.total / this.pageSize);
					this.getPlantformUserList(this.currentPage, this.pageSize)
				}).catch(error => {
					reject(error)
				})
			},
			getPlantformUserList(currentPage, pageSize) {
				getPlantformUserList({
					filter: {
						where: {
							state: 0
						},
						fields: {
							username: true,
							roles:true,
              isAdmin:true,
							createdTime: true,
							introduction: true,
							state: true,
              id: true
						},
						order: 'createdTime DESC',
						limit: pageSize,
						skip: (currentPage - 1) * pageSize
					}
				}).then(response => {
					// console.log("这是所有的数据",response)
					this.tableData = response

				}).catch(error => {
					reject(error)
				})
				// console.log(this.form)
			},
			addPlantformUser() {
        this.isShow = true
				this.thisType = "add"
				// this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.resetTemp()
					this.$refs['dataForm'].clearValidate()
				})
			},
			editPlantformUser(plantformUser) {
				// console.log("被选中的点击编辑的用户",plantformUser)
				// console.log("被选中的点击编辑的用户ID",plantformUser.id)
        this.isShow = false
				this.thisType = "edit"
				getOnePlantformUser(plantformUser.id, {}).then(response => {
					console.log("这是选中编辑的用户",response)
					this.dialogFormVisible = true
					this.form = response
					this.$nextTick(() => {
						// console.log("这是程序编辑器代码", this.$refs.editor.code)
						this.$refs.introduction.setContent("");
					})

				})
			},
			deletePlantformUser(plantformUser) {
				this.$confirm('此操作将删除该投票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
          console.log("@@@@选择被删除用户的实例",plantformUser)
					var _plantformUser = plantformUser
					_plantformUser.state = 1
          var _tocken =  getToken();
					editUserInfo(_tocken,_plantformUser).then(response => {
						console.log(response),
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
						this.initData()
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				})
			},
			clickOK() {
				if (this.thisType == "add")
					this.createPlantformUser()
				else
					this.editUserInfo()
			},
			editUserInfo() {
        console.log("编辑用户信息，点击确定，重新编辑之后的表单",this.form)
        var _tocken =  getToken();
				editUserInfo(_tocken,this.form).then(response => {
          console.log("@@@编辑选中用户之后的表单",this.form)
					console.log(response),
					this.dialogFormVisible = false
					this.$message({
						message: '编辑用户信息成功',
						type: 'success'
					});
					this.initData()

				}).catch(error => {
					this.$message({
						message: '编辑用户信息失败',
						type: 'error'
					});
				})
				// console.log(this.form)
			},
			createPlantformUser() {
        console.log("添加的用户表单",this.form)
				createPlantformUser(this.form).then(response => {
					console.log("创建用户实例时传输的表单", this.form)
					console.log("创建之后的返回值", response),
					this.dialogFormVisible = false
					this.$message({
						message: '添加用户实例成功',
						type: 'success'
					});
					this.initData()

				}).catch(error => {
					this.$message({
						message: '添加用户实例失败',
						type: 'error'
					});
				})
			},
			handleCurrentChange(currentPage) {
				console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getPlantformUserList(this.currentPage, this.pageSize)
			}



		}

	}
</script>
