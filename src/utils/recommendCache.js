/**
 * 推荐结果本地缓存 — 暂存 AI 推荐的景点，下次访问时恢复，新搜索自动覆盖。
 * 使用 localStorage，7 天无操作自动清除。
 */
const CACHE_KEY = 'travel_recommend_cache'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

/** 保存推荐结果到本地缓存 */
export function saveRecommendCache(data) {
  try {
    const payload = {
      ...data,
      _ts: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage 满或隐私模式下静默失败
  }
}

/** 读取缓存的推荐结果，过期返回 null */
export function loadRecommendCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || !data._ts) return null
    // 7 天过期自动清除
    if (Date.now() - data._ts > TTL_MS) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    // 至少有一条推荐才有效
    if (!data.recommendations || !data.recommendations.length) return null
    return data
  } catch {
    return null
  }
}

/** 清除推荐缓存 */
export function clearRecommendCache() {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // 静默
  }
}
