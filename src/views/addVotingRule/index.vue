<template>
  <div class="app-container">
  	<div class="filter-container">
      	<el-form ref="editForm" :model="editrules">
      		<el-form-item label="投票规则名称" :label-width="formLabelWidth">
      			<el-input v-model="editrules.ruleName" autocomplete="off"></el-input>
      		</el-form-item>
      		<el-form-item label="使用语言" :label-width="formLabelWidth">
      			<div align="left">
      				<el-select v-model="editrules.language" placeholder="请选择">
      					<el-option v-for="language in languages" :key="language.value"
      						:label="language.label" :value="language.value"></el-option>
      				</el-select>
      			</div>
      		</el-form-item>
      		<el-form-item label="是否开放" :label-width="formLabelWidth">
      			<div align="left" >
      				<el-switch v-model="editrules.isOpen" active-color="#13ce66" inactive-color="#ff4949">
      				</el-switch>
      			</div>
      		</el-form-item>
      		<el-form-item label="投票规则程序" :label-width="formLabelWidth">
      			<div id="code" align="left" >
      				<codemirror ref="editor" v-model="editrules.program" :options="cmOptions" />
      			</div>
      		</el-form-item>
      		<el-form-item label="输入数据范例" :label-width="formLabelWidth">
      			<div id="code" align="left" >
      				<codemirror ref="inputDataForm" v-model="editrules.dataExample" :options="cmOptions" />
      			</div>
      		</el-form-item>
      		<el-row :gutter="20">
      			<el-col :span="1">
      				<el-form-item align="left">
      					<el-button @click="computeVotingRule()">运行</el-button>
      				</el-form-item>
      			</el-col>
      			<el-col :span="1" :offset="1">
      				<el-form-item align="left">
      					<el-button @click="exportProgramAndDataform()">导出程序和数据范例</el-button>
      				</el-form-item>
      			</el-col>
      		</el-row>
      		<el-form-item label="运行结果" :label-width="formLabelWidth">
      			<el-input v-model="editrules.computeResult" type="textarea" rows="5"
      				style="margin-top:5px auto" />
      		</el-form-item>
      		<el-form-item>
      			<el-button @click="createVotingRule()">保存</el-button>
      			<el-button @click="quit()">放弃</el-button>
      		</el-form-item>
      	</el-form>
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
		createComputingData
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
				formLabelWidth: "100px"
			};
		},
		mounted() {
			this.user.username = sessionStorage.getItem('userName')
			this.editrules.ruleCreator = sessionStorage.getItem('userName')
			// console.log("@@@当前用户名",this.user.username)
			// console.log("@@@当前用户名",this.editrules.ruleCreator)
		},
		methods: {
			quit() {
				this.$message({
					message: '放弃添加投票规则成功',
					type: 'success'
				});
				this.$router.push({
					path: "/frontPage/index"
				});
			},
			createVotingRule() {
				this.editrules.ruleCreator = this.user.username
				createVotingRule(this.editrules).then(response => {
					console.log("投票创造者", this.editrules.ruleCreator)
					// console.log("编辑之后的返回值", response)
					var savedVotingRule = response
					console.log("@@@保存的投票规则", savedVotingRule)
					this.createUserVote(savedVotingRule)
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
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
					dataContent: "",
          state:0
				}
				_data.language = this.editrules.language
				_data.createdTime = new Date()
				_data.dataUser = this.user.username
				_data.dataContent = this.editrules.dataExample
				createComputingData(_data).then(response => {
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
			}
		}
	}
</script>

<style>
  #code .CodeMirror{
		height:180px !important;
	}
</style>
