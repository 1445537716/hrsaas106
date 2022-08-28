import request from '@/utils/request'

// 登入接口封装
export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    // data: data
    data
  })
}

export function getInfo(token) {
}

export function logout() {
}
