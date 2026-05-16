/**
 * AI 攻略相关 API
 */
import request from '@/utils/request'

export function getGuideAgentStatus() {
  return request.get('/guide/agent/status')
}

export function generateGuide(data) {
  return request.post('/guide/generate', data, { timeout: 120000 })
}
