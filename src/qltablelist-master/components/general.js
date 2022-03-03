import request from '@/utils/request'
import store from '@/store'
export function generalGet(model, data) {
	return request({
		url: '/' + model + '',
		method: 'get',
		params: data
	})
}

export function generalGetOne(model, id, data) {
	return request({
		url: '/' + model + '/' + id,
		method: 'get',
		params: data
	})
}

export function generalGetOneSelf(model, id, data, method) {
	return request({
		url: '/' + model + '/' + id + '/' + method,
		method: 'get',
		params: data
	})
}



export function generalCount(model, data) {
	return request({
		url: '/' + model + '/count',
		method: 'get',

		params: data
	})
}

export function generalPost(model, data) {
	return request({
		url: '/' + model + '',
		method: 'post',
		data
	})
}

export function generalOwnDelete(model, id) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + model + '/' + id + '',
		method: 'delete'

	})
}

export function generalOwnPatchOne(model, id, data) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + model + '/' + id,
		method: 'put',
		data
	})
}

export function generalOwnPost(path, data) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + path + '',
		method: 'post',
		data
	})
}

export function generalOwnCount(path, data) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + path + '/count',
		method: 'get',
		params: data
	})
}

export function generalOwnGet(path, data) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + path + '',
		method: 'get',
		params: data
	})
}



export function generalPostOneSelf(model, id, data, method) {
	return request({
		url: '/' + model + '/' + id + '/' + method,
		method: 'post',
		data
	})
}

export function generalReplace(model, id, data) {
	return request({
		url: '/' + model + '/' + id + '',
		method: 'put',
		data
	})
}






export function generalDelete(model, id) {
	return request({
		url: '/' + model + '/' + id + '',
		method: 'delete'

	})
}

export function putHasAndBelongsToMany(model1, id1, model2, id2, data) {
	return request({
		url: '/' + model1 + '/' + id1 + '/' + model2 + '/rel/' + id2,
		method: 'put',
		data
	})
}

export function deleteHasAndBelongsToMany(model1, id1, model2, id2) {
	return request({
		url: '/' + model1 + '/' + id1 + '/' + model2 + '/rel/' + id2,
		method: 'delete'

	})
}

export function generalPatchOne(model, id, data) {
	return request({
		url: '/' + model + '/' + id,
		method: 'patch',
		data
	})
}



export function generalPatch(model, data) {
	return request({
		url: '/' + model,
		method: 'patch',
		data
	})
}

export function generalUpdate(model, where,data) {
	return request({
		url: '/' + model+'/update',
		method: 'post',
        params:{where:where},
		data
	})
}

export function generalOwnPut(model, id, data) {
	return request({
		url: '/users/'+store.getters.token.userId+'/' + model + '/'+id,
		method: 'put',
		data
	})
}

export function equipmentGet(data) {
	return request({
		url: '/equipmentApplications/greet',
		method: 'post',
		data: data
	})
}

export function sendMail(data) {
	return request({
		url: '/users/sendMail',
		method: 'post',
		data: data
	})
}

export function patchTime(id, data) {
	return request({
		url: '/equipmentApplications/' + id,
		method: 'patch',
		data: data
	})
}
