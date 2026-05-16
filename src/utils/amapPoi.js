/** 统一为 [lng, lat]，供路径规划等 API 使用 */
export function toLngLat(point) {
  if (!point) return null
  if (Array.isArray(point) && point.length >= 2) {
    return [Number(point[0]), Number(point[1])]
  }
  if (typeof point === 'object') {
    if (typeof point.lng === 'number' && typeof point.lat === 'number') {
      return [point.lng, point.lat]
    }
    if (typeof point.getLng === 'function' && typeof point.getLat === 'function') {
      return [point.getLng(), point.getLat()]
    }
  }
  return null
}

/** 去掉高德 POI 名称前的序号，如 "9.店名" → "店名" */
export function stripPoiIndexPrefix(name) {  return (name || '').replace(/^\d+\.\s*/, '').trim()
}

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildPoiInfoContent({ name, address, tel, showRouteButton = false }) {
  const title = escapeHtml(stripPoiIndexPrefix(name))
  const addressLine = address
    ? `<p class="poi-line">地址：${escapeHtml(address)}</p>`
    : ''
  const telLine = tel ? `<p class="poi-line">电话：${escapeHtml(tel)}</p>` : ''
  const routeBtn = showRouteButton
    ? `<button type="button" class="poi-route-btn" data-amap-action="plan-route" onclick="window.__travelPlanRoute &amp;&amp; window.__travelPlanRoute(event); return false;">规划路径</button>`
    : ''

  return `<div class="map-poi-info">
    <h4 class="poi-title">${title}</h4>
    ${addressLine}
    ${telLine}
    ${routeBtn}
  </div>`
}
