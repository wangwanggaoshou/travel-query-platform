/**
 * 景点相关 API
 */
import request from '@/utils/request'

// 获取景点列表
export function getScenicList(params) {
  return request.get('/scenic/list', { params })
}

// 获取景点详情
export function getScenicDetail(id) {
  return request.get(`/scenic/detail/${id}`)
}

// 搜索景点
export function searchScenic(params) {
  return request.get('/scenic/search', { params })
}

// 获取景点分类
export function getScenicCategories() {
  return request.get('/scenic/categories')
}

// 获取热门景点
export function getHotScenic(params) {
  return request.get('/scenic/hot', { params })
}

// 获取推荐景点（基于用户偏好）
export function getRecommendScenic() {
  return request.get('/scenic/recommend')
}

// 收藏景点
export function favoriteScenic(id) {
  return request.post(`/scenic/favorite/${id}`)
}

// 取消收藏
export function unfavoriteScenic(id) {
  return request.delete(`/scenic/favorite/${id}`)
}

// 获取收藏列表
export function getFavoriteList(params) {
  return request.get('/scenic/favorites', { params })
}
