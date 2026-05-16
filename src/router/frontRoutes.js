/**
 * 前台路由配置
 */
export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/front/HomeView.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/scenic',
    name: 'ScenicList',
    component: () => import('@/views/front/ScenicListView.vue'),
    meta: { title: '景点查询' },
  },
  {
    path: '/map',
    name: 'MapExplore',
    component: () => import('@/views/front/MapExploreView.vue'),
    meta: { title: '地图探索' },
  },
  {
    path: '/globe',
    name: 'GlobeExplore',
    component: () => import('@/views/front/GlobeExploreView.vue'),
    meta: { title: '3D地球探索' },
  },
  {
    path: '/guide',
    name: 'GuideList',
    component: () => import('@/views/front/GuideListView.vue'),
    meta: { title: 'AI 攻略' },
  },
  {
    path: '/guide/:id',
    name: 'GuideDetail',
    component: () => import('@/views/front/GuideDetailView.vue'),
    meta: { title: 'AI 攻略详情' },
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('@/views/front/RecommendView.vue'),
    meta: { title: '智能推荐' },
  },
]
