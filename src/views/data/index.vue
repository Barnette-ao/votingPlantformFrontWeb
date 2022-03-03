<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
				@click="addComputingData">
				添加计算数据
			</el-button>
			<el-dialog :title="thisType == 'add'?'添加计算数据':'编辑计算数据'" :visible.sync="dialogFormVisible"
				:fullscreen="fullscreen">
				<el-form ref="dataForm" :model="form" :label-position="labelPosition">
					<el-form-item label="数据所属用户" :label-width="formLabelWidth">
						<el-input v-model="form.dataUser" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="规则表示语言" :label-width="formLabelWidth">
						<el-select v-model="form.language" placeholder="请选择活动区域">
							<el-option label="Picat" value="picat"></el-option>
							<el-option label="ASP" value="ASP"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="添加时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.createdTime" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="计算数据" :label-width="formLabelWidth">
						<codemirror ref="dataContent" v-model="form.dataContent" :options="cmOptions" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="clickOK()">确 定</el-button>
				</div>
			</el-dialog>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="dataUser" label="数据所属用户" width="180">
				</el-table-column>
				<el-table-column prop="language" label="规则表示语言" width="180">
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
						<el-button size="mini" @click="editComputingData(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteComputingData( scope.row)">删除</el-button>
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
	// import Codemirror from '@/components/Codemirror'
	import { codemirror } from 'vue-codemirror'
	
	import "codemirror/theme/ambiance.css"
	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript"); 
	
	import Tinymce from '@/components/Tinymce'
	import {
		createComputingData,
		getComputingDataList,
		getComputingDataListCount,
		getOneComputingData,
		updateComputingData
	} from '@/api/computingData'
	export default {
		components: {
			codemirror,
			Tinymce
		},
		data() {
			return {
				cmOptions:{
					mode:"text/javascript",
					theme: "ambiance",
					indentUnit: 2,
					smartIndent:true,
					tabSize:4,
					readOnly: false,
					showCurorWhereSelecting: true,
					lineNumbers: true,
					firstLineNumber: 1
				},
				thisType: "add",
				labelPosition: "right",
				dialogFormVisible: false,
				formLabelWidth: "120px",
				fullscreen: true,
				form: {
					language: "",
					createdTime: "",
					dataUser:"",
					dataContent: ""
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
				this.getComputingDataListCount(),
					this.getComputingDataList()
			},
			resetTemp() {
				this.form = {
					language: "",
					createdTime: "",
					dataUser:"",
					dataContent: ""
				}
				// this.$nextTick(() => {
				// 	console.log("我希望这是编辑之后保留的输入的计算数据",this.$refs.computingData)
				// 	this.$refs.computingData.code = ""
				// })
			},
			getComputingDataListCount() {
				getComputingDataListCount({
					where: {
						state: 0
					}
				}).then(response => {
					// console.log(response)
					this.total = response.count;
					this.pageCount = Math.ceil(this.total / this.pageSize);
					this.getComputingDataList(this.currentPage, this.pageSize)

				}).catch(error => {
					reject(error)
				})
			},
			getComputingDataList(currentPage, pageSize) {
				getComputingDataList({
					filter: {
						where: {
							state: 0
						},
						fields: {
							dataUser:true,
							dataContent: true,
							language: true,
							createdTime: true,
							id: true,
							state: true
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
			addComputingData() {
				this.thisType = "add"
				// this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.resetTemp()
					this.$refs['dataForm'].clearValidate()
				})
			},
			editComputingData(computingData) {
				// console.log(computingData)
				// console.log(computingData.id)
				this.thisType = "edit"
				getOneComputingData(computingData.id, {}).then(response => {
					// console.log("这是选中编辑的投票规则",response)
					this.dialogFormVisible = true
					this.form = response
					this.$nextTick(() => {
						// console.log("这是程序编辑器代码", this.$refs.editor.code)
						computingData.dataContent = this.$refs.dataContent.code
					})

				})
			},
			deleteComputingData(computingData) {
				this.$confirm('此操作将删除该投票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var _computingData = computingData
					_computingData.state = 1
					updateComputingData(_computingData).then(response => {
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
					this.createComputingDatas()
				else
					this.updateComputingDatas()
			},
			updateComputingDatas() {
				updateComputingData(this.form).then(response => {
					console.log(response),
						this.dialogFormVisible = false
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
					this.initData()

				}).catch(error => {
					this.$message({
						message: '编辑投票规则失败',
						type: 'error'
					});
				})
				// console.log(this.form)
			},
			createComputingDatas() {
				createComputingData(this.form).then(response => {
					console.log("创建投票规则实例时传输的表单", this.form)
					console.log("创建之后的返回值", response),
					this.dialogFormVisible = false
					this.$message({
						message: '添加投票规则成功',
						type: 'success'
					});
					this.initData()

				}).catch(error => {
					this.$message({
						message: '添加投票规则失败',
						type: 'error'
					});
				})
				// console.log(this.form)
			},
			handleCurrentChange(currentPage) {
				console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getComputingDataList(this.currentPage, this.pageSize)
			}
		}

	}
</script>
