/** 高德地图 JS API（Web 端）— 在 .env 中配置 */
export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || ''
export const AMAP_SECURITY_CODE = import.meta.env.VITE_AMAP_SECURITY_CODE || ''

export function applyAmapSecurityConfig() {
  if (!AMAP_SECURITY_CODE) return false
  window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
  return true
}
