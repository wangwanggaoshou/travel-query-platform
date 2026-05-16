/**
 * 3D 地球 — 全球标志性目的地 API
 */
import request from '@/utils/request'

export function getGlobeLandmarks(countryKey) {
  return request.get(`/globe/landmarks/${encodeURIComponent(countryKey)}`, {
    timeout: 60000,
  })
}

export function resolveGlobeCountry(lon, lat) {
  return request.get('/globe/resolve', { params: { lon, lat }, timeout: 60000 })
}

export function fetchLandmarkImages(keyword, { max = 6, nameEn, location } = {}) {
  return request.get('/globe/landmarks/images', {
    params: { keyword, max, nameEn, location },
    timeout: 45000,
  })
}
