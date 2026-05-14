/**
 * 旅游攻略相关 API
 */
import request from '@/utils/request'

// 获取攻略列表
export function getGuideList(params) {
  return request.get('/guide/list', { params })
}

// 获取攻略详情
export function getGuideDetail(id) {
  return request.get(`/guide/detail/${id}`)
}

// 搜索攻略
export function searchGuide(params) {
  return request.get('/guide/search', { params })
}

// 获取攻略分类
export function getGuideCategories() {
  return request.get('/guide/categories')
}

// 获取热门攻略
export function getHotGuides(params) {
  return request.get('/guide/hot', { params })
}

// 获取推荐攻略
export function getRecommendGuides() {
  return request.get('/guide/recommend')
}
