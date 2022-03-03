import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admins/login',
    method: 'post',
    data
  })
}

export function getInfo(state) {
  return request({
    url: '/admins/'+ state.id,
    method: 'get',
    params: { access_token:state.token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function createPlantformUser(data) {
  return request({
    url: '/admins',
    method: 'post',
    data
  })
}

export function updatePlantformUser(data) {
  return request({
    url: '/admins',
    method: 'put',
    data
  })
}

export function getPlantformUserList(query) {
  return request({
    url: '/admins',
    method: 'get',
    params: query
  })
}

export function getPlantformUserListCount(query) {
  return request({
    url: '/admins/count',
    method: 'get',
    params: query
  })
}

export function getOnePlantformUser(id,query) {
  return request({
    url: '/admins/'+ id,
    method: 'get',
    params: query
  })
}

export function editUserInfo(state,data) {
  return request({
    url: '/admins/',
    method: 'patch',
    params: { access_token:state.token },
    data
  })
}
