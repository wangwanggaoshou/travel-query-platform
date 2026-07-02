/** 分类标签由后端 /scenic/categories 接口统一提供，此处仅做兼容回退 */

const FALLBACK_LABELS = {
  nature: '自然风光',
  history: '历史古迹',
  theme_park: '主题乐园',
  beach: '海滨度假',
  mountain: '山岳景观',
  city: '城市观光',
  none: '暂无分类',
}

export const SCENIC_CATEGORY_LABELS = FALLBACK_LABELS

export function getCategoryLabel(value) {
  return FALLBACK_LABELS[value] || value || ''
}

export function formatScenicItem(item) {
  if (!item) return item
  return {
    ...item,
    categoryLabel: item.categoryLabel || getCategoryLabel(item.category),
  }
}

export function formatScenicList(list) {
  return (list || []).map(formatScenicItem)
}
