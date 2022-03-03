import request from '@/utils/request'

export function getSSOtoken() {
  return request({
    url: '/commons/getOSStoken',
    method: 'get'
  })
}
