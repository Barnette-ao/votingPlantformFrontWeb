import request from '@/utils/request'

export function createVotingCPUTime(data) {
  return request({
    url: '/votingCPUTimes',
    method: 'post',
    data
  })
}

export function getVotingCPUTimeList(query) {
  return request({
    url: '/votingCPUTimes',
    method: 'get',
    params: query
  })
}

export function getVotingCPUTimeListCount(query) {
  return request({
    url: '/votingCPUTimes/count',
    method: 'get',
    params: query
  })
}

export function updateVotingCPUTime(data) {
  return request({
    url: '/votingCPUTimes',
    method: 'put',
    data
  })
}


