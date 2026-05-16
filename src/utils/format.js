/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式 (默认 YYYY-MM-DD)
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化价格
 * @param {number} price - 价格
 * @param {string} currency - 货币符号
 */
export function formatPrice(price, currency = '¥') {
  if (price === null || price === undefined) return ''
  return `${currency}${Number(price).toFixed(2)}`
}

/**
 * 截取文本
 * @param {string} text - 文本
 * @param {number} length - 最大长度
 */
export function truncateText(text, length = 100) {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * 格式化数字（添加千位分隔符）
 */
export function formatNumber(num) {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
