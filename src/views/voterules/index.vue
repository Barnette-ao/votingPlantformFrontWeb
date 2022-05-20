<template>
	<div class="app-container">
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
				@click="addVotingRule">
				添加投票规则
			</el-button>
			<el-dialog :title="thisType == 'add'?'添加投票规则':'编辑投票规则'" :visible.sync="dialogFormVisible"
				:fullscreen="fullscreen">
				<el-form ref="dataForm" :model="form" :label-position="labelPosition">
					<el-form-item label="投票规则名称" :label-width="formLabelWidth">
						<el-input v-model="form.ruleName" autocomplete="off" ></el-input>
					</el-form-item>
					<el-form-item label="规则表示语言" :label-width="formLabelWidth">
						<el-select v-model="form.language" placeholder="请选择规则表示语言">
							<el-option label="Picat" value="picat"></el-option>
							<el-option label="ASP" value="ASP"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="添加时间" :label-width="formLabelWidth">
						<el-date-picker v-model="form.createdTime" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="投票规则程序" :label-width="formLabelWidth">
						<codemirror ref="editor" v-model="form.program" :options="cmOptions" />
					</el-form-item>
					<el-form-item label="输入数据范例" :label-width="formLabelWidth">
						<codemirror ref="inputDataForm" v-model="form.dataExample" :options="cmOptions" />
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="clickOK()">确 定</el-button>
				</div>
			</el-dialog>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="ruleName" label="投票规则名称" width="180">
				</el-table-column>
				<el-table-column prop="ruleCreator" label="投票规则创造者" width="180">
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
				<el-table-column prop="isOpen" label="是否开放">
					<template slot-scope="scope">
						<span>{{scope.row.isOpen === true ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="editVotingRule(scope.row)">编辑</el-button>
						<el-button size="mini" type="danger" @click="deleteVotingRule( scope.row)">删除</el-button>
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

	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript");

	import Tinymce from '@/components/Tinymce'
	import {
		createVotingRule,
		getVotingRuleList,
		getVotingRuleListCount,
		getOneVotingRule,
		updateVotingRule
	} from '@/api/votingRule'
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
					ruleName: "",
					ruleCreator:"",
					language: "",
					createdTime: "",
					dataExample: "",
					program: ""
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
				this.getVotingRuleListCount(),
					this.getVotingRuleList()
			},
			resetTemp() {
				this.form = {
					ruleName: "",
					ruleCreator:"",
					language: "",
					createdTime: "",
					isOpen: "",
					dataExample: "",
					program: ""
				}
				this.$nextTick(() => {
					console.log("我希望这是编辑之后保留的文字",this.$refs.editor)
					this.$refs.editor.code = ""
					this.$refs.inputDataForm.code = ""
				})
			},
			getVotingRuleListCount() {
				getVotingRuleListCount({
					where: {
						state: 0
					}
				}).then(response => {
					// console.log(response)
					this.total = response.count;
					this.pageCount = Math.ceil(this.total / this.pageSize);
					this.getVotingRuleList(this.currentPage, this.pageSize)

				}).catch(error => {
					reject(error)
				})
			},
			getVotingRuleList(currentPage, pageSize) {
				getVotingRuleList({
					filter: {
						where: {
							state: 0
						},
						fields: {
							ruleName: true,
							language: true,
							createdTime: true,
							isOpen: true,
							id: true,
							dataExample: true,
							program: true,
							state: true,
							ruleCreator:true
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
			addVotingRule() {
				this.thisType = "add"
				// this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.resetTemp()
					this.$refs['dataForm'].clearValidate()
				})
			},
			editVotingRule(votingRule) {
				console.log("@@@被选中的点击编辑按钮的投票规则",votingRule)
				console.log("@@@被选中的点击编辑按钮的投票规则的id",votingRule.id)
				this.thisType = "edit"
				getOneVotingRule(votingRule.id, {}).then(response => {
					// console.log("这是选中编辑的投票规则",response)
					this.dialogFormVisible = true
					this.form = response
					this.$nextTick(() => {
						// console.log("这是程序编辑器代码", this.$refs.editor.code)
						votingRule.program = this.$refs.editor.code
						votingRule.dataExample = this.$refs.inputDataForm.code
					})

				})
			},
			deleteVotingRule(votingRule) {
				this.$confirm('此操作将删除该投票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var _votingRule = votingRule
					_votingRule.state = 1
					updateVotingRule(_votingRule).then(response => {
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
					this.createVotingRules()
				else
					this.updateVotingRules()
			},
			updateVotingRules() {
        console.log("编辑投票规则信息，点击确定，重新编辑之后的表单",this.form)
				updateVotingRule(this.form).then(response => {
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
			createVotingRules() {
				createVotingRule(this.form).then(response => {
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
				this.getVotingRuleList(this.currentPage, this.pageSize)
			}



		}

	}
</script>
