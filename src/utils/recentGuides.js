/**
 * 最近生成的攻略（仅浏览器本地 sessionStorage）
 */
const STORAGE_KEY = 'travel_recent_guides'
const MAX_RECENT = 15

export function createLocalGuideId() {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function getRecentGuides() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function persist(list) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)))
}

export function saveRecentGuide(guide) {
  const list = getRecentGuides().filter((g) => g.id !== guide.id)
  list.unshift({
    ...guide,
    date: guide.date || new Date().toISOString().slice(0, 10),
    viewCount: guide.viewCount ?? 0,
  })
  persist(list)
  return guide
}

export function getRecentGuideById(id) {
  return getRecentGuides().find((g) => String(g.id) === String(id)) || null
}

export function getRelatedRecentGuides(scenicId, excludeId, limit = 3) {
  if (!scenicId) return []
  return getRecentGuides()
    .filter((g) => g.scenic?.id === scenicId && String(g.id) !== String(excludeId))
    .slice(0, limit)
}

export function buildGuideFromApi(data, { topic, scenicId, scenicName } = {}) {
  const id = createLocalGuideId()
  return {
    id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    cover: data.cover,
    author: data.author || 'AI攻略助手',
    authorAvatar: data.authorAvatar,
    tags: data.tags || ['AI生成'],
    topic: topic || data.topic,
    scenicId: scenicId ?? data.scenic?.id,
    scenic: data.scenic || (scenicId ? { id: scenicId, name: scenicName } : null),
    date: new Date().toISOString().slice(0, 10),
    viewCount: 0,
    likeCount: 0,
  }
}
