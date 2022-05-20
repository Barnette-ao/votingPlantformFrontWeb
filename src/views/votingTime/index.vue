<template>
  <div class="app-container">
  	<div class="filter-container">
      	<el-table :data="tableData" border style="width: 100%">
      		<el-table-column prop="index" label="序号" width="100">
      			<template scope="scope">
      				<span>{{scope.$index + 1}} </span>
      			</template>
      		</el-table-column>
      		<el-table-column prop="ruleName" label="投票规则名称" width="180">
      		</el-table-column>
      		<el-table-column prop="language" label="规则表示语言" width="180">
      		</el-table-column>
      		<el-table-column prop="CPUTime" label="计算时间" width="180">
      		</el-table-column>
      		<el-table-column prop="votingData" label="投票数据" width="180">
      			<template slot-scope="scope">
      				<el-input v-model="tableData[scope.$index].votingData" type="textarea" rows="5"
      					style="margin-top:5px auto" />
      			</template>
      		</el-table-column>
      		<el-table-column label="操作">
      			<template slot-scope="scope">
      				<el-button size="mini" type="danger" @click="deleteVotingCPUTime(scope.row)">删除
      				</el-button>
      			</template>
      		</el-table-column>
      	</el-table>
      	<el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
      		:page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
      	</el-pagination>
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
		getVotingCPUTimeList,
    getVotingCPUTimeListCount,
		updateVotingCPUTime
	} from '@/api/votingCPUTime'
	export default {
		name: "Home",
		components: {},
		data() {
			return {
				user: {
					username: "",
					roles: "",
					introduction: "",
					userId: ""
				},
				Showinformation: false,
				tableData: [],
				currentRow: null,
				total: 0,
				pageSize: 5,
				pageCount: 0,
				currentPage: 1
			};
		},
		created() {
			this.initData()
		},
		mounted() {
			this.user.username = sessionStorage.getItem('userName')
		},
		methods: {
			initData() {
				// console.log("this.user.userId:",this.user.userId)
				this.getVotingCPUTimeListCount();
			},
      getVotingCPUTimeListCount() {
      	getVotingCPUTimeListCount({
      		where: {
      			isDelete: 0
      		}
      	}).then(response => {
      		// console.log("the number:",response)
      		this.total = response.count;
          // console.log("this.total:",this.total)
      		this.pageCount = Math.ceil(this.total / this.pageSize);
          // console.log("this.pageCount:",this.pageCount)
      		this.getVotingCPUTimeList();
      	}).catch(error => {
      		console.log(error)
      	})
      },
			getVotingCPUTimeList() {
				getVotingCPUTimeList({
					filter: {
						where: {
							isDelete: 0
						},
						fields: {
							ruleName: true,
							language: true,
							votingData: true,
							isDelete: true,
							CPUTime: true,
							id: true
						},
						order: 'CPUTime ASC',
						limit: this.pageSize,
						skip: (this.currentPage - 1) * this.pageSize
					}
				}).then(response => {
					this.tableData = response
				}).catch(error => {
					console.log(error)
				})
				// console.log(this.form)
			},
			deleteVotingCPUTime(votingCPUTime) {
				// console.log("被选中的投票结果", votingCPUTime)
				this.$confirm('此操作将删除该投票结果, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var _votingCPUTime = votingCPUTime
					_votingCPUTime.isDelete = 1
					updateVotingCPUTime(_votingCPUTime).then(response => {
						// console.log(response),
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
			setCurrent(row) {
				this.$refs.singleTable.setCurrentRow(row);
				this.$router.push({
					path: "/vote"
				});
			},
			handleCurrentChange(currentPage) {
				console.log(`当前页: ${currentPage}`);
				this.currentPage = currentPage
				this.getVotingResultList(this.currentPage, this.pageSize)
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
