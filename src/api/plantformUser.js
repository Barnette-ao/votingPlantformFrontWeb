import request from '@/utils/request'

export function createPlantformUser(data) {
  return request({
    url: '/PlantformUsers',
    method: 'post',
    data
  })
}

export function updatePlantformUser(data) {
  return request({
    url: '/PlantformUsers',
    method: 'put',
    data
  })
}

export function getPlantformUserList(query) {
  return request({
    url: '/PlantformUsers',
    method: 'get',
    params: query
  })
}

export function getPlantformUserListCount(query) {
  return request({
    url: '/PlantformUsers/count',
    method: 'get',
    params: query
  })
}

export function getOnePlantformUser(id,query) {
  return request({
    url: '/PlantformUsers/'+ id,
    method: 'get',
    params: query
  })
}

