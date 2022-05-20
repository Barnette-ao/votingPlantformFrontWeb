import request from '@/utils/request'

export function createVotingResult(data) {
  return request({
    url: '/votingResults',
    method: 'post',
    data
  })
}

export function getVotingResultList(query) {
  return request({
    url: '/votingResults',
    method: 'get',
    params: query
  })
}

export function getVotingResultListCount(query) {
  return request({
    url: '/votingResults/count',
    method: 'get',
    params: query
  })
}

export function updateVotingResult(data) {
  return request({
    url: '/votingResults',
    method: 'put',
    data
  })
}


