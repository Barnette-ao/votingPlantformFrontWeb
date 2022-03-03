import request from '@/utils/request'

export function createVotingRule(data) {
  return request({
    url: '/votingRules',
    method: 'post',
    data
  })
}

export function updateVotingRule(data) {
  return request({
    url: '/votingRules',
    method: 'put',
    data
  })
}

export function getVotingRuleList(query) {
  return request({
    url: '/votingRules',
    method: 'get',
    params: query
  })
}

export function getVotingRuleListCount(query) {
  return request({
    url: '/votingRules/count',
    method: 'get',
    params: query
  })
}

export function getOneVotingRule(id,query) {
  return request({
    url: '/votingRules/'+ id,
    method: 'get',
    params: query
  })
}

