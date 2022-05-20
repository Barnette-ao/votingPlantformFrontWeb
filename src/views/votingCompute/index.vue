<template>
  <div class="app-container">
  	<div class="filter-container">
      <el-form ref="computeVoting" :model="computeVoting" style="width: auto">
      	<el-row>
      		<el-col :span="12">程序</el-col>
      		<el-col :span="12">数据范例</el-col>
      	</el-row>
      	<el-row>
      		<el-col style="margin-top:5px" :span="11">
      			<el-form-item>
      				<div align="left">
      					<codemirror ref="mycode" v-model="computeVoting.votingRule"
      						:options="cmOptions" />
      				</div>
      			</el-form-item>
      		</el-col>
      		<div class="line" :span="2" />
      		<el-col style="margin-top:5px" :span="11">
      			<el-form-item>
      				<div align="left">
      					<codemirror ref="mydata" v-model="computeVoting.dataExample"
      						:options="cmOptions" />
      				</div>
      			</el-form-item>
      		</el-col>
      	</el-row>
      	<el-form-item align="left">
      		<el-button @click="execute()">运行</el-button>
      	</el-form-item>
      	<el-form-item label="运行结果" >
      		<el-input v-model="computeVoting.computeResult" type="textarea" rows="5"
      			style="margin-top:5px auto" />
      	</el-form-item>
      </el-form>
    </div>
  </div>
</template>



<script>
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'
	import {
		editUserInfo,
		getOnePlantformUser
	} from '@/api/user'
	
	import {
		computeVotingRule,
		orderComputeTime
	} from '@/api/votingRule'
	import {
		createVotingResult
	} from '@/api/votingResult'
	import {
		createVotingCPUTime
	} from '@/api/votingCPUTime'
	import {
		codemirror
	} from 'vue-codemirror'
	import "codemirror/theme/ambiance.css";
	require("codemirror/mode/javascript/javascript");

	export default {
		name: "Home",
		components: {
			codemirror
		},
		data() {
			return {
				user: {
					username: "",
					roles: "",
					introduction: ""
				},
				computeVoting: {
					votingRule: "",
					dataExample: "",
					computeResult:""
				},
				Showinformation: false,
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
					cursorScrollMargin: 0
				},
				votingRule:{},
				votingResult:{
					ruleName:"",
					language:"",
					computeResult:"",
					isDelete:0,
					userId:""
				},
				votingCPUTime:{
					ruleName:"",
					language:"",
					CPUTime:"",
					votingData:"",
					isDelete:0
				}
			};
		},
		mounted(){
			// console.log("路由参数",this.$route.params)
			this.votingRule = this.$route.params.votingRule
			// console.log("votingRule:",this.votingRule)
			this.computeVoting.votingRule = this.$route.params.votingRuleProgram
			this.computeVoting.dataExample = this.$route.params.computeData
			this.user.username = sessionStorage.getItem('userName')
		},
		methods: {
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
			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
				this.$router.push({
					path: "/vote"
				});
			},
			execute(){
				// console.log("点击运行按钮之后传输的数据", this.votingRule)
				computeVotingRule({
					votingRule: this.votingRule
				}).then(response => {
					// console.log("点击运行按钮之后传输的数据", this.votingRule)
					// console.log("点击运行按钮之后的返回值", response),
					this.computeVoting.computeResult = response.computeResult
					// console.log("投票结果：",this.computeVoting.computeResult)
					this.votingResult.computeResult = this.computeVoting.computeResult
					// console.log("this.votingResult.computeResult：",this.votingResult.computeResult)
					this.createVotingResult()
					this.$message({
						message: '计算投票结果成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '计算投票结果失败',
						type: 'error'
					});
				});
				// console.log("排序投票时间", this.votingRule)
				orderComputeTime({
					votingRule: this.votingRule
				}).then(response => {
					console.log("----orderComputeTime", response),
					// console.log("投票结果：",this.computeVoting.computeResult)
					this.votingCPUTime.CPUTime = response.CPUTime //将投票结果是投票结果实例中的一个属性，对其进行赋值
					// console.log("this.votingResult.computeResult：",this.votingResult.computeResult)
					this.createVotingCPUTime()
					this.$message({
						message: '计算投票时间成功',
						type: 'success'
					});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '计算投票时间失败',
						type: 'error'
					});
				})
			},
			createVotingResult(){
				this.votingResult.ruleName = this.votingRule.ruleName
				this.votingResult.language = this.votingRule.language
				this.votingResult.userId = this.$store.state.user.id
				createVotingResult(this.votingResult).then(response => {
					console.log("保存的投票结果", response),
						this.$message({
							message: '保存投票结果成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存投票结果失败',
						type: 'error'
					});
				});
			},
			createVotingCPUTime(){
				this.votingCPUTime.ruleName = this.votingRule.ruleName
				this.votingCPUTime.language = this.votingRule.language
				this.votingCPUTime.votingData = this.computeVoting.dataExample
				createVotingCPUTime(this.votingCPUTime).then(response => {
					console.log("保存的投票CPU时间", response),
						this.$message({
							message: '保存投票CPU时间成功',
							type: 'success'
						});
				}).catch(error => {
					console.log(error)
					this.$message({
						message: '保存投票CPU时间失败',
						type: 'error'
					});
				});
			}
		}
	};
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
