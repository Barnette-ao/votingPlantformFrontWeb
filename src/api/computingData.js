import request from '@/utils/request'

export function createComputingData(data) {
  return request({
    url: '/computingData',
    method: 'post',
    data
  })
}

export function updateComputingData(data) {
  return request({
    url: '/computingData',
    method: 'put',
    data
  })
}

export function getComputingDataList(query) {
  return request({
    url: '/computingData',
    method: 'get',
    params: query
  })
}

export function getComputingDataListCount(query) {
  return request({
    url: '/computingData/count',
    method: 'get',
    params: query
  })
}

export function getOneComputingData(id,query) {
  return request({
    url: '/computingData/'+ id,
    method: 'get',
    params: query
  })
}

