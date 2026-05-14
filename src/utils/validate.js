/**
 * 表单验证工具
 */

/**
 * 验证邮箱
 */
export function validateEmail(rule, value, callback) {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!value) {
    callback(new Error('请输入邮箱地址'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入有效的邮箱地址'))
  } else {
    callback()
  }
}

/**
 * 验证手机号
 */
export function validatePhone(rule, value, callback) {
  const reg = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!reg.test(value)) {
    callback(new Error('请输入有效的手机号'))
  } else {
    callback()
  }
}

/**
 * 验证密码强度
 */
export function validatePassword(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    callback()
  }
}

/**
 * 验证非空
 */
export function validateRequired(message = '此项为必填项') {
  return { required: true, message, trigger: 'blur' }
}
