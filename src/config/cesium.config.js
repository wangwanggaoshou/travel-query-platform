/**
 * Cesium 及地图配置
 * 所有敏感配置项集中管理，便于后续修改
 */

// Cesium Ion Token
export const CESIUM_CONFIG = {
  // Cesium Ion access token，用于访问 Cesium Ion 的服务
  ionToken: '',

  // 是否启用 Cesium Ion 默认地形
  enableIonTerrain: false,

  // 默认视角（中国中心）
  defaultView: {
    longitude: 104.195397,
    latitude: 35.86166,
    height: 15000000
  }
}

// 天地图配置
export const TIANDITU_CONFIG = {
  // 天地图开发者密钥
  token: '91cc78d5c861104952a1fb36c31936eb',

  // 天地图影像底图 URL
  imageryUrl: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',

  // 天地图注记 URL
  annotationUrl: 'https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',

  // 子域名
  subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],

  // 最大缩放级别
  maximumLevel: 18
}

// 地理编码配置
export const GEOCODER_CONFIG = {
  // 使用哪个地理编码服务：'mock' | 'api'
  provider: 'mock',

  // API 配置（后续替换为真实 API）
  api: {
    url: 'https://api.example.com/geocode',
    apiKey: ''
  }
}
