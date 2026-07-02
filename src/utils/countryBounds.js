/** 国家经纬度范围（用于地球点击快速识别，非精确国界）
 *  小范围/高纬度国家排前面，避免被大框（中国）吞掉 */
export const countryBounds = {
  Iceland: { minLon: -25, maxLon: -13, minLat: 63, maxLat: 67 },
  Nepal: { minLon: 80, maxLon: 89, minLat: 26, maxLat: 31 },
  'South Korea': { minLon: 125, maxLon: 132, minLat: 33, maxLat: 39 },
  Japan: { minLon: 129, maxLon: 146, minLat: 31, maxLat: 46 },
  Mongolia: { minLon: 87, maxLon: 120, minLat: 41, maxLat: 52 },
  France: { minLon: -5, maxLon: 8, minLat: 42, maxLat: 51 },
  'United Kingdom': { minLon: -8, maxLon: 2, minLat: 50, maxLat: 59 },
  Italy: { minLon: 7, maxLon: 19, minLat: 37, maxLat: 47 },
  Spain: { minLon: -10, maxLon: 4, minLat: 36, maxLat: 44 },
  Greece: { minLon: 20, maxLon: 28, minLat: 35, maxLat: 42 },
  Egypt: { minLon: 25, maxLon: 35, minLat: 22, maxLat: 32 },
  Thailand: { minLon: 97, maxLon: 106, minLat: 5, maxLat: 21 },
  India: { minLon: 68, maxLon: 97, minLat: 8, maxLat: 37 },
  Kenya: { minLon: 34, maxLon: 42, minLat: -5, maxLat: 5 },
  Tanzania: { minLon: 29, maxLon: 41, minLat: -12, maxLat: -1 },
  Bolivia: { minLon: -70, maxLon: -57, minLat: -23, maxLat: -9 },
  Peru: { minLon: -81, maxLon: -68, minLat: -19, maxLat: -1 },
  Brazil: { minLon: -74, maxLon: -34, minLat: -34, maxLat: 5 },
  Australia: { minLon: 113, maxLon: 154, minLat: -44, maxLat: -10 },
  // 大国放最后，收窄纬度避免吞掉邻国
  China: { minLon: 73, maxLon: 135, minLat: 18, maxLat: 42 },
  'United States': { minLon: -125, maxLon: -66, minLat: 25, maxLat: 49 },
}

export function identifyCountry(longitude, latitude) {
  for (const [country, bounds] of Object.entries(countryBounds)) {
    if (
      longitude >= bounds.minLon &&
      longitude <= bounds.maxLon &&
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat
    ) {
      return country
    }
  }
  return null
}
