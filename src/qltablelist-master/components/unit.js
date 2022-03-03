
const api = require('./general');
module.exports = {
	reloationListInit: function(_this) {
		var tempList = {}
		tempList.id = {
			'type': 'id',
			'description': 'ID',
			'search': ''
		}
		_this.relations = _this.jsonList.relations
		_this.includeObj = []
		for (var i in _this.relations) {
			if ((typeof _this.relations[i]) === 'object' && _this.relations[i].format) {
				console.log(_this.relations[i].type)
				if (_this.relations[i].type == 'belongsTo') {
					var obj={ // include orders for the owner
						relation: i,
						scope: {
							fields: {
								name: true,
								id: true
							}
						}
					}
					if (_this.relations[i].format && _this.relations[i].format.nameKey) {
						obj.scope.fields[_this.relations[i].format.nameKey] = true
					}
					_this.includeObj.push(obj)
					_this.$set(tempList, i, _this.relations[i])
					_this.$set(tempList[i], 'search', '')
					if (!_this.relations[i].format.doNotGetList) {
						
						var filter = {
							where: {
								state: 1
							},
							fields: {
								name: true,
								id: true
							}
						}
						getRelation(i, _this.relations[i],_this.filter, function(list) {})
					}
				} else if (_this.relations[i].type == 'hasAndBelongsToMany' || _this.relations[i].type == 'hasMany') {
					var scope = {}
					scope.order = _this.relations[i].format.order || ''
					scope.include = _this.relations[i].format.include || []
					_this.includeObj.push({ // include orders for the owner
						relation: i,
						scope: scope
					})
					console.log()
					_this.$set(tempList, i, _this.relations[i])
					if (!_this.relations[i].format.doNotGetList) {
					scope.where = {
					  state: 1
					}
					getRelation(i, _this.relations[i], scope, function(list) {
					
					})
}
				}
			}
		}
		console.log(_this.includeObj)
		var properties = _this.jsonList.properties

		for (var i in properties) {
			if ((typeof properties[i]) !== 'object') {
				console.log('delete')
			} else {
				_this.$set(tempList, i, properties[i])
				if (tempList[i].type != 'date' && tempList[i].type != 'array' && tempList[i].type != 'object') {
					_this.$set(tempList[i], 'search', '')
				}
			}
		}
		return tempList
		function getRelation(key, relation, filter, cb) {
			console.log(key)
            var modelName=relation.format.model
			api.generalGet(modelName, {
				filter: filter
			}).then(response => {
				console.log(response)
				// response.push({name:"请选择",id:null})
				// this.tableData = response
				// this.relationList[key]=response
				_this.$set(_this.relationList, key, response)
				cb(_this.relationList[key])
			}).catch(error => {
				_this.$message({
					message: Error,
					type: 'Error'
				})
			})
		}
	}
}
