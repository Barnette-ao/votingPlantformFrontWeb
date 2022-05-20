import request from '@/utils/request'

export function createVotingRule(data) {
  return request({
    url: '/votingRules',
    method: 'post',
    data
  })
}

export function createFile(data) {
  return request({
    url: '/votingRules/createFile',
    method: 'post',
    data
  })
}

export function updateVotingRule(state,data) {
  return request({
    url: '/votingRules/',
    method: 'patch',
    params: { access_token:state.token },
    data
  })
}

export function getOneVotingRule(id,query) {
  return request({
    url: '/votingRules/'+ id,
    method: 'get',
    params: query
  })
}

export function computeVotingRule(data) {
  return request({
    url: '/votingRules/computeVotingRule',
    method: 'post',
    data
  })
}

export function orderComputeTime(data) {
  return request({
    url: '/votingRules/orderComputeTime',
    method: 'post',
    data
  })
}
