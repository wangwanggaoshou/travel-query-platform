const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect fill="#111827" width="400" height="300"/>
  <text x="200" y="150" text-anchor="middle" fill="#c8a951" font-size="15" font-family="system-ui,sans-serif">暂无图片</text>
</svg>`

export const SCENIC_IMAGE_PLACEHOLDER =
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLACEHOLDER_SVG)}`

/** 景点封面：优先 image，其次 images[0] */
export function resolveScenicCover(scenic) {
  if (!scenic) return SCENIC_IMAGE_PLACEHOLDER
  const url = scenic.image || scenic.images?.[0]
  if (!url || typeof url !== 'string' || !url.trim()) {
    return SCENIC_IMAGE_PLACEHOLDER
  }
  return url.trim()
}

export function onScenicImageError(event) {
  const img = event?.target
  if (!img || img.dataset.fallbackApplied) return
  img.dataset.fallbackApplied = '1'
  img.src = SCENIC_IMAGE_PLACEHOLDER
}

/** 图片加载失败时尝试后端搜图回退（按 scenic name + location 重新搜索） */
const _enriching = new Set()

export async function tryEnrichScenicImage(scenic, imgEl) {
  if (!scenic?.name || !imgEl) return
  const key = `${scenic.name}|${scenic.location || ''}`
  if (_enriching.has(key)) return
  _enriching.add(key)
  try {
    const { enrichScenicImages } = await import('@/api/scenic')
    const res = await enrichScenicImages(scenic.name, scenic.location)
    if (res.code === 200 && res.data?.image) {
      if (imgEl.src === SCENIC_IMAGE_PLACEHOLDER || imgEl.dataset.fallbackApplied) {
        imgEl.src = res.data.image
        imgEl.dataset.fallbackApplied = '0'
      }
      // 回写 scenic 对象，后续使用
      scenic.image = scenic.image || res.data.image
      if (!scenic.images?.length) scenic.images = [res.data.image]
    }
  } catch {
    // 静默失败，保留 placeholder
  } finally {
    _enriching.delete(key)
  }
}
