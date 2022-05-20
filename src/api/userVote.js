import request from '@/utils/request'

export function saveUserVoteRelation(data) {
  return request({
    url: '/Uservotes',
    method: 'post',
    data
  })
}

export function searchUserVoting(data) {
  return request({
    url: '/Uservotes',
    method: 'get',
    data
  })
}

export function getUserVotingRules(query) {
  return request({
    url: '/Uservotes',
    method: 'get',
    params: query
  })
}

export function updateUserVotingRule(id,state,data) {
  return request({
    url: '/Uservotes/'+ id,
    method: 'patch',
    params: { access_token:state.token },
    data
  })
}