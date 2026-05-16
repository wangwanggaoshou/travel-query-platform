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
