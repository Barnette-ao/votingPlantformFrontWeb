<template>
  <div class="app-container">
  	<div class="filter-container">
      <el-table :data="tableData" border style="width: 100%">
      	<el-table-column prop="ruleName" label="投票规则名称" width="180">
      	</el-table-column>
      	<el-table-column prop="language" label="规则表示语言" width="180">
      	</el-table-column>
      	<el-table-column label="操作">
      		<template slot-scope="scope">
      			<el-button size="mini" @click="computeVoting(scope.row)">投票计算</el-button>
      			<el-button size="mini" @click="editVotingRule(scope.row)">编辑</el-button>
      			<el-button size="mini" type="danger" @click="deleteVotingRule( scope.row)">删除
      			</el-button>
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
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	import {
		codemirror
	} from 'vue-codemirror'
	import {
		createVotingRule,
		getOneVotingRule,
		updateVotingRule,
		computeVotingRule
	} from '@/api/votingRule'
	import {
		saveUserVoteRelation,
		getUserVotingRules,
		updateUserVotingRule
	} from '@/api/userVote'
	import {
		editUserInfo,
		getOnePlantformUser,
		getUserVotingRulesListCount
	} from '@/api/user'
	import {
		saveData
	} from '@/api/computingData'
	import FileSaver from "file-saver"
	import {
		getToken
	} from '@/utils/auth'

	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript");

	export default {
		name: "Home",
		components: {
			codemirror
		},
		data() {
			return {
				thisType: "add",
				user: {
					username: "",
					roles: "",
					introduction: ""
				},
				editrules: {
					ruleName: "",
					ruleCreator: "",
					language: "",
					program: "",
					dataExample: "",
					isOpen: true,
					computeResult: ""
				},
				languages: [{
						value: "picat",
						label: "picat"
					},
					{
						value: "ASP",
						label: "ASP"
					}
				],
				Showinformation: false,
				Showeditrules: false,
				tableData: [],
				currentRow: null,
				cmOptions: {
					mode: "text/javascript",
					theme: "ambiance",
					indentUnit: 2,
					smartIndent: true,
					tabSize: 4,
					readOnly: false,
					showCurorWhereSelecting: true,
					lineNumbers: true,
					firstLineNumber: 1,
				},
				fullscreen: true,
				formLabelWidth: "100px",
				currentUser: "",
				total: 0,
				pageSize: 10,
				pageCount: 0,
				currentPage: 1
			};
		},
		created() {
			this.initData()
		},
		mounted() {
			this.user.username = sessionStorage.getItem('userName')
			this.editrules.ruleCreator = sessionStorage.getItem('userName')
			this.initData()
			// console.log("@@@当前用户名",this.user.username)
			// console.log("@@@当前用户名",this.editrules.ruleCreator)
		},
		methods: {
			initData() {
				// console.log("初始化数据")
				this.getUserVotingRulesListCount()
				this.getUserVotingRulesList()
			},
			getUserVotingRulesListCount() {
				var _userInfo = this.$store.state.user
				var userId = _userInfo.id
        console.log("userId:",userId)
				getUserVotingRulesListCount(userId,{
					where: {
						and: [{
								or: [{
									isOpen: true
								}, {
									adminId: userId
								}]
							},
							{
								isDelete: 0
							}
						]
					}
				}).then(response => {
					// console.log("response:",response)
					this.total = response.count;
					this.pageCount = Math.ceil(this.total / this.pageSize);
					this.getUserVotingRulesList()
				}).catch(error => {
					console.log(error)
				})
			},
			getUserVotingRulesList() {
				var _userInfo = this.$store.state.user
				var userId = _userInfo.id
				getUserVotingRules({
					filter: {
						include: ["votingRules"],
						where: {
							and: [{
									or: [{
										isOpen: true
									}, {
										adminId: userId
									}]
								},
								{
									isDelete: 0
								}
							]
						},
						limit: this.pageSize,
						skip: (this.currentPage - 1) * this.pageSize
					}
				}).then(response => {
					// console.log("这是关联的投票规则的数据", response)
					var votingRuleArray = new Array()
					for (var i = 0; i < response.length; i++) {
						votingRuleArray[i] = response[i].votingRules
						votingRuleArray[i].userVotingId= response[i].id
					}
					this.tableData = votingRuleArray
				}).catch(error => {
					console.log(error)
				})
			},
			quit() {
				this.$router.push({
					path: "/"
				});
			},
			orderTime() {
				this.$router.push({
					path: "/orderTime"
				});
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			backHome() {
				this.$router.push({
					path: "/home"
				});
			},
			information() {
				var _userInfo = this.$store.state.user
				// console.log("当前的用户实例对象", _userInfo)
				getOnePlantformUser(_userInfo.id, {
					filter: {
						where: {
							state: 0
						}
					}
				}).then(response => {
					// console.log("这是选中编辑的用户", response)
					this.user = response
				})
				this.Showinformation = true;
			},
			result() {
				this.$router.push({
					path: "/result"
				});
			},
			saveinformation() {
				var _userInfo = this.$store.state.user
				editUserInfo(_userInfo.token, this.user).then(response => {
					// console.log("@@@编辑选中用户之后的表单", this.user)
					console.log("@@@编辑返回的表单", response),
					this.Showinformation = false
					this.$message({
						message: '编辑用户信息成功',
						type: 'success'
					});
				}).catch(error => {
					this.$message({
						message: '编辑用户信息失败',
						type: 'error'
					});
					console.log(error)
				})
			},
			editRules() {
				this.editrules = {
					ruleName: "",
					language: "",
					ruleCreator: "",
					program: "",
					dataExample: "",
					computeResult: ""
				};
				this.Showeditrules = true;
			},
			addVotingRule() {
				this.editRules()
			},
			clickOK() {
				if (this.thisType == "add")
					this.createVotingRule()
				else
					this.updateVotingRule()
			},
			createVotingRule() {
				this.editrules.ruleCreator = this.user.username
				createVotingRule(this.editrules).then(response => {
					console.log("投票创造者", this.editrules.ruleCreator)
					// console.log("编辑之后的返回值", response)
					var savedVotingRule = response
					console.log("@@@保存的投票规则", savedVotingRule)
					this.createUserVote(savedVotingRule)
					this.Showeditrules = false
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
					this.initData()
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '编辑投票规则失败',
						type: 'error'
					});
				});
				this.createVotingData()
			},
			createVotingData() {
				var _data = {
					language: "",
					createdTime: "",
					dataUser: "",
					dataContent: ""
				}
				_data.language = this.editrules.language
				_data.createdTime = new Date()
				_data.dataUser = this.user.username
				_data.dataContent = this.editrules.dataExample
				saveData(_data).then(response => {
					console.log("保存的数据", response),
						this.$message({
							message: '保存数据成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存数据失败',
						type: 'error'
					});
				});
			},
			createUserVote(savedVotingRule) {
				var _userVoteData = {
					adminId: "",
					votingRuleId: "",
					isOpen: "",
					state: 0
				}
				var _userInfo = this.$store.state.user
				_userVoteData.adminId = _userInfo.id
				_userVoteData.votingRuleId = savedVotingRule.id
				_userVoteData.isOpen = savedVotingRule.isOpen
				saveUserVoteRelation(_userVoteData).then(response => {
					console.log("返回的需要保存的用户-投票规则关系", response),
						this.$message({
							message: '保存用户-投票规则关系成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存用户-投票规则关系失败',
						type: 'error'
					});
				});
			},
			editVotingRule(votingRule) {
        this.$router.push({
        	name: "EditVotingRule",
        	params: {
        		votingRule:votingRule
        	}
        });
			},
			updateVotingRule() {
				console.log("编辑用户信息，点击确定，重新编辑之后的表单", this.editrules)
				var _tocken = getToken();
				updateVotingRule(_tocken, this.editrules).then(response => {
					console.log("@@@编辑选中用户之后的表单", this.editrules)
					console.log(response),
					this.Showeditrules = false
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
					console.log(error)
				})

			},
			deleteVotingRule(votingRule) {
				this.$confirm('此操作将删除该投票规则, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// console.log("@@@@选择被删除投票规则的实例",votingRule)
					var _votingRule = votingRule
					var deletedVotingRuleUserVoteId = _votingRule.userVotingId
					var updataIsDelete ={isDelete:1}
					var _tocken =  getToken();
					updateUserVotingRule(deletedVotingRuleUserVoteId,_tocken,updataIsDelete).then(response => {
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
			computeVotingRule() {
				console.log("点击运行按钮之后传输的数据", this.editrules)
				computeVotingRule({
					votingRule: this.editrules
				}).then(response => {
					console.log("点击运行按钮之后传输的数据", this.editrules)
					console.log("点击运行按钮之后的返回值", response),
					this.editrules.computeResult = response.computeResult
					this.$message({
						message: '计算成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '计算失败',
						type: 'error'
					});
				})
			},
			exportProgramAndDataform() {
				console.log(this.editrules.program)
				var blobProgram = new Blob([this.editrules.program], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blobProgram, this.editrules.ruleName + "_program.pi");

				var blobDataExample = new Blob([this.editrules.dataExample], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blobDataExample, this.editrules.ruleName +"_data.txt");
			},
			handleCurrentChange(currentPage) {
				// console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getUserVotingRulesList()
			},
			computeVoting(votingRule) {
				// console.log("@@@投票规则表示程序",votingRule.dataExample)
				this.$router.push({
					name: "VotingCompute",
					params: {
						votingRule:votingRule,
						votingRuleProgram: votingRule.program,
						computeData: votingRule.dataExample
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
