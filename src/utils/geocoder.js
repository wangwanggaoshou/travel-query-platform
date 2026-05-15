/**
 * 地理编码工具
 * 提供逆地理编码功能（根据坐标获取国家信息）
 */

import { GEOCODER_CONFIG } from '@/config/cesium.config.js'
import { identifyCountry as mockIdentify, getCountryAttractions as mockGetAttractions } from '@/data/attractions.js'

/**
 * 逆地理编码 - 根据坐标获取位置信息
 */
export async function reverseGeocode(longitude, latitude) {
  if (GEOCODER_CONFIG.provider === 'api') {
    return await reverseGeocodeAPI(longitude, latitude)
  }
  return reverseGeocodeMock(longitude, latitude)
}

/**
 * Mock 逆地理编码
 */
function reverseGeocodeMock(longitude, latitude) {
  const countryName = mockIdentify(longitude, latitude)

  if (!countryName) {
    return {
      success: false,
      message: '该位置暂不支持，目前仅支持热门旅游国家',
      longitude,
      latitude
    }
  }

  const countryData = mockGetAttractions(countryName)

  return {
    success: true,
    country: countryData,
    longitude,
    latitude
  }
}

/**
 * API 逆地理编码（预留接口）
 */
async function reverseGeocodeAPI(longitude, latitude) {
  try {
    console.warn('API 模式未配置，降级使用 mock 数据')
    return reverseGeocodeMock(longitude, latitude)
  } catch (error) {
    console.error('逆地理编码 API 调用失败:', error)
    return {
      success: false,
      message: '获取位置信息失败',
      longitude,
      latitude,
      error: error.message
    }
  }
}

/**
 * 获取最近的热门景点
 */
export async function getNearbyAttractions(longitude, latitude, limit = 5) {
  const result = await reverseGeocode(longitude, latitude)

  if (!result.success) {
    return []
  }

  return result.country.attractions.slice(0, limit)
}