/**
 * 地理编码 — 按国家获取标志性旅游目的地（最多 5 个）
 */
import { identifyCountry } from '@/utils/countryBounds.js'
import { getGlobeLandmarks, resolveGlobeCountry } from '@/api/globe'

const MAX_ATTRACTIONS = 5

function mapCountryResponse(data, longitude, latitude) {
  const attractions = (data.attractions || []).slice(0, MAX_ATTRACTIONS).map((item) => ({
    id: item.id,
    name: item.name,
    nameEn: item.nameEn,
    location: item.location,
    description: item.description,
    image: item.image,
    images: item.images || (item.image ? [item.image] : []),
    type: item.type || 'landmark',
    guideTopic: item.guideTopic || `${item.name}旅游攻略`,
    guideCategory: item.guideCategory || 'city',
    isGlobe: true,
  }))

  return {
    success: true,
    country: {
      key: data.key,
      name: data.name,
      nameEn: data.nameEn,
      flag: data.flag,
      attractions,
      source: data.source || 'local',
    },
    longitude,
    latitude,
  }
}

export async function reverseGeocode(longitude, latitude) {
  const countryKey = identifyCountry(longitude, latitude)

  try {
    let res
    if (countryKey) {
      res = await getGlobeLandmarks(countryKey)
    } else {
      res = await resolveGlobeCountry(longitude, latitude)
    }

    if (res.code !== 200 || !res.data?.attractions?.length) {
      return {
        success: false,
        message: res.message || '该国家/地区暂未收录标志性目的地，请尝试其他区域',
        longitude,
        latitude,
      }
    }

    return mapCountryResponse(res.data, longitude, latitude)
  } catch (error) {
    console.error('获取全球目的地失败:', error)
    return {
      success: false,
      message: '获取目的地数据失败，请确认后端服务已启动',
      longitude,
      latitude,
      error: error.message,
    }
  }
}

export async function getNearbyAttractions(longitude, latitude, limit = 5) {
  const result = await reverseGeocode(longitude, latitude)
  if (!result.success) return []
  return result.country.attractions.slice(0, limit)
}
