/**
 * 景点相关 API
 */
import request from '@/utils/request'

export function getScenicList(params) {
  return request.get('/scenic/list', { params })
}

export function getScenicDetail(id) {
  return request.get(`/scenic/detail/${id}`)
}

export function searchScenic(params) {
  return request.get('/scenic/search', { params })
}

export function getScenicCategories() {
  return request.get('/scenic/categories')
}

export function getHotScenic(params) {
  return request.get('/scenic/hot', { params })
}

export function getRecommendScenic(params) {
  return request.get('/scenic/recommend', { params })
}

export function getRecommendAgentStatus() {
  return request.get('/scenic/recommend/agent/status')
}

export function postRecommendAgent(data) {
  return request.post('/scenic/recommend/agent', data, { timeout: 120000 })
}

export function postRecommendAgentMore(data) {
  return request.post('/scenic/recommend/agent/more', data, { timeout: 120000 })
}

export function enrichScenicImages(name, location) {
  return request.get('/scenic/enrich-images', { params: { name, location }, timeout: 30000 })
}
