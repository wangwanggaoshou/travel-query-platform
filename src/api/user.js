/**
 * 用户相关 API
 */
import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request.post('/user/login', data)
}

// 用户注册
export function register(data) {
  return request.post('/user/register', data)
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/user/info')
}

// 更新用户信息（偏好、所在地、签证信息）
export function updateUserInfo(data) {
  return request.put('/user/info', data)
}

// 更新旅游偏好
export function updatePreferences(data) {
  return request.put('/user/preferences', data)
}

// 更新签证信息
export function updateVisaInfo(data) {
  return request.put('/user/visa', data)
}

// 更新所在地
export function updateLocation(data) {
  return request.put('/user/location', data)
}
