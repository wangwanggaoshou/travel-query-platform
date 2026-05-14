/**
 * 爬虫评论相关 API
 * 评论数据全部来自网页爬虫，附带来源网站信息
 */
import request from '@/utils/request'

// 获取景点的爬虫评论列表
export function getScenicReviews(scenicId, params) {
  return request.get(`/review/scenic/${scenicId}`, { params })
}

// 获取评论来源站点列表
export function getReviewSources() {
  return request.get('/review/sources')
}

// 按来源筛选评论
export function getReviewsBySource(scenicId, source, params) {
  return request.get(`/review/scenic/${scenicId}/source/${source}`, { params })
}

// 获取评论统计（好评率、各星级占比等）
export function getReviewStats(scenicId) {
  return request.get(`/review/scenic/${scenicId}/stats`)
}
