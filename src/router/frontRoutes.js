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
    path: '/guide',
    name: 'GuideList',
    component: () => import('@/views/front/GuideListView.vue'),
    meta: { title: '旅游攻略' },
  },
  {
    path: '/guide/:id',
    name: 'GuideDetail',
    component: () => import('@/views/front/GuideDetailView.vue'),
    meta: { title: '攻略详情' },
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('@/views/front/RecommendView.vue'),
    meta: { title: '智能推荐' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/front/LoginView.vue'),
    meta: { title: '登录', layout: 'blank' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/front/RegisterView.vue'),
    meta: { title: '注册', layout: 'blank' },
  },
  {
    path: '/user',
    name: 'UserCenter',
    redirect: '/user/profile',
    meta: { title: '用户中心', requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/front/user/ProfileView.vue'),
        meta: { title: '个人信息' },
      },
      {
        path: 'preferences',
        name: 'UserPreferences',
        component: () => import('@/views/front/user/PreferencesView.vue'),
        meta: { title: '旅游偏好' },
      },
      {
        path: 'visa',
        name: 'UserVisa',
        component: () => import('@/views/front/user/VisaView.vue'),
        meta: { title: '签证信息' },
      },
      {
        path: 'favorites',
        name: 'UserFavorites',
        component: () => import('@/views/front/user/FavoriteView.vue'),
        meta: { title: '我的收藏' },
      },
    ],
  },
]
