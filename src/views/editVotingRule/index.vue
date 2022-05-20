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
      			<el-button @click="updateVotingRule()">保存</el-button>
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
				thisType: "update",
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
				formLabelWidth: "100px",
        votingRule:{},
			};
		},
    mounted(){
    	// console.log("路由参数",this.$route.params)
    	this.editrules = this.$route.params.votingRule
      this.editrules.ruleCreator = sessionStorage.getItem('userName')
      console.log("this.editrules.ruleCreator:",this.editrules.ruleCreator)
    },
		methods: {
      quit() {
        var votingRuleId = this.$route.params.votingRule.id
        getOneVotingRule(votingRuleId, {}).then(response => {
        	// console.log("这是选中编辑的投票规则",response)
        	this.editrules = response
          this.$message({
          	message: '放弃编辑投票规则成功',
          	type: 'success'
          });
          this.$router.push({
          	path: "/frontPage/index"
          });
        }).catch(error => {
					this.$message({
						message: '放弃编辑投票规则失败',
						type: 'error'
					});
					console.log(error)
				})
      },
			updateVotingRule() {
				console.log("编辑用户信息，点击确定，重新编辑之后的表单", this.editrules)
				var _tocken = getToken();
				updateVotingRule(_tocken, this.editrules).then(response => {
          response.ruleCreator = sessionStorage.getItem('userName')
          this.editrules = response
          console.log("updateVotingRule保存之后的投票规则", this.editrules)
					this.$message({
						message: '编辑投票规则成功',
						type: 'success'
					});
				}).catch(error => {
					this.$message({
						message: '编辑投票规则失败',
						type: 'error'
					});
					console.log(error)
				})
			},
			computeVotingRule() {
				console.log("computeVotingRule输入的投票规则", this.editrules)
				computeVotingRule({
					votingRule: this.editrules
				}).then(response => {
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
