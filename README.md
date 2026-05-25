# 🌏 旅途智览 - 旅游查询与建议系统

> 基于 Vue 3 + Element Plus + Python FastAPI 的旅游信息查询与智能推荐平台

## 📋 项目简介

旅途智览是一个**纯查询与建议工具**，旨在为用户提供全面的景点信息查询、旅游攻略浏览和个性化旅行推荐服务。景点数据来自高德地图 POI 与维基媒体等公开来源。

### 核心特色

- 🔍 **智能搜索** - 多维度景点搜索与筛选（分类、地区、评分）
- 🗺️ **地图探索** - 高德地图集成，查看景点坐标与周边设施
- 🌍 **3D地球探索** - 基于 Cesium 和天地图的全景 3D 地球漫游
- 🤖 **AI 攻略生成** - 通过 AI Agent 自动生成旅游攻略
- 💡 **智能推荐** - 根据出发地、预算与天数推荐合适目的地

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | ^3.5.x | 前端框架，使用 Composition API |
| [Element Plus](https://element-plus.org/) | ^2.14.x | UI 组件库 |
| [Vue Router 4](https://router.vuejs.org/) | ^4.6.x | 客户端路由 |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.x | 状态管理 |
| [Axios](https://axios-http.com/) | ^1.16.x | HTTP 客户端 |
| [Cesium](https://cesium.com/platform/cesiumjs/) | ^1.141.x | 3D 地球可视化引擎 |
| [@amap/amap-jsapi-loader](https://lbs.amap.com/) | ^1.0.1 | 高德地图 JS API 加载器 |
| [Vite](https://vite.dev/) | ^8.0.x | 构建工具 |

### 后端技术栈

详见 [back-end/README.md](../back-end/README.md)

---

## 📁 项目结构

```
D:\gcsj_4\
│
├── 📂 front-end/                       # ===== 前端项目 =====
│   ├── 📄 README.md                    # 前端说明文档（本文件）
│   ├── 📄 index.html                   # 入口 HTML
│   ├── 📄 package.json                 # 依赖配置
│   ├── 📄 vite.config.js               # Vite 构建配置
│   ├── 📄 .gitignore                   # Git 忽略配置
│   │
│   └──── 📂 src/                       # 源码目录
│       ├── main.js                     # 应用入口
│       ├── App.vue                     # 根组件
│       │
│       ├── 📂 api/                     # API 接口层
│       │   ├── index.js                # 统一导出
│       │   ├── scenic.js               # 景点接口（列表/详情/搜索/推荐）
│       │   ├── guide.js                # 攻略接口（AI Agent 生成）
│       │   └── globe.js                # 3D地球接口（地标/地理解析）
│       │
│       ├── 📂 assets/                  # 静态资源
│       │   ├── hero.png                # 首页横幅图片
│       │   ├── vite.svg                # Vite Logo
│       │   ├── vue.svg                 # Vue Logo
│       │   └── 📂 styles/              # 全局样式
│       │       ├── index.css           # 样式入口
│       │       ├── variables.css       # CSS 设计变量
│       │       ├── reset.css           # 浏览器样式重置
│       │       ├── element.css         # Element Plus 主题覆盖
│       │       └── amap.css            # 高德地图样式覆盖
│       │
│       ├── 📂 components/              # 公共组件
│       │   ├── 📂 common/              # 通用组件
│       │   │   ├── AppHeader.vue       # 顶部导航栏
│       │   │   ├── AppBreadcrumb.vue   # 面包屑导航
│       │   │   └── SearchBar.vue       # 搜索栏
│       │   ├── 📂 home/                # 首页组件
│       │   │   ├── HeroBanner.vue      # 首页横幅
│       │   │   ├── HotScenic.vue       # 热门景点展示
│       │   │   └── FeaturedCarousel.vue # 精选轮播
│       │   ├── 📂 scenic/              # 景点组件
│       │   │   ├── ScenicCard.vue      # 景点卡片
│       │   │   ├── ScenicFilter.vue    # 筛选器
│       │   │   └ ScenicGallery.vue     # 图片画廊
│       │   ├── 📂 globe/               # 3D地球组件
│       │   │   ├── GlobeViewer.vue     # 地球查看器（Cesium）
│       │   │   ├── AttractionCard.vue  # 景点卡片
│       │   │   ├── GlobeAttractionDetail.vue # 景点详情面板
│       │   │   └── LoadingSpinner.vue  # 加载动画
│       │   └── 📂 guide/               # 攻略组件
│       │       └── GuideCard.vue       # 攻略卡片
│       │
│       ├── 📂 composables/             # 组合式函数
│       │   ├── useSearch.js            # 搜索逻辑（含防抖）
│       │   └── usePagination.js        # 分页逻辑
│       │
│       ├── 📂 config/                  # 配置文件
│       │   ├── amap.config.js          # 高德地图配置
│       │   └── cesium.config.js        # Cesium/天地图配置
│       │
│       ├── 📂 constants/               # 常量定义
│       │   └ departureCities.js       # 出发城市列表
│       │
│       ├── 📂 layouts/                 # 页面布局
│       │   └── FrontLayout.vue         # 前台布局
│       │
│       ├── 📂 router/                  # 路由配置
│       │   ├── index.js                # 路由主文件
│       │   └── frontRoutes.js          # 前台路由定义
│       │
│       ├── 📂 stores/                  # Pinia 状态管理
│       │   ├── index.js                # Store 导出
│       │   ├── scenic.js               # 景点状态
│       │   └── app.js                  # 全局状态
│       │
│       ├── 📂 utils/                   # 工具函数
│       │   ├── request.js              # Axios 实例封装
│       │   ├── format.js               # 格式化工具
│       │   ├── validate.js             # 表单验证规则
│       │   ├── categoryLabels.js       # 分类标签映射
│       │   ├── scenicImage.js          # 景点图片处理
│       │   ├── amapPoi.js              # 高德 POI 工具
│       │   ├── recentGuides.js         # 最近攻略缓存
│       │   ├── countryBounds.js        # 国家边界数据
│       │   └── geocoder.js              # 地理编码工具
│       │
│       └── 📂 views/                   # 页面视图
│           ├── NotFound.vue            # 404 页面
│           └── 📂 front/               # 前台页面
│               ├── HomeView.vue        # 首页
│               ├── ScenicListView.vue  # 景点列表
│               ├── MapExploreView.vue  # 地图探索
│               ├── GlobeExploreView.vue # 3D地球探索
│               ├── GuideListView.vue   # 攻略列表
│               ├── GuideDetailView.vue # 攻略详情
│               └ RecommendView.vue    # 智能推荐
│
└── 📂 back-end/                        # ===== 后端项目 =====
    └── 📄 README.md                    # 后端说明文档
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x
- **npm** 或 **pnpm**

### 前端启动

```bash
# 1. 进入前端目录
cd D:\gcsj_4\front-end

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:3000
```

### 后端启动

详见 [back-end/README.md](../back-end/README.md)

### 环境变量配置

在 `front-end/` 目录下创建 `.env` 文件：

```env
# 高德地图 JS API Key（Web 端）
VITE_AMAP_KEY=你的高德JS_API_Key

# 高德地图安全密钥（可选）
VITE_AMAP_SECURITY_CODE=你的安全密钥

# API 基础地址（默认通过 Vite proxy 到后端）
VITE_API_BASE_URL=/api
```

**注意**：高德 JS API Key 与后端 Web 服务 Key 不能混用，否则会报 `USERKEY_PLAT_NOMATCH` 错误。

### 生产构建

```bash
npm run build
# 产出目录: dist/
```

---

## 📄 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 搜索、热门景点、探索方式、使用指引 |
| `/scenic` | 景点查询 | 景点列表、搜索、筛选、分类浏览 |
| `/map` | 地图探索 | 高德地图、周边设施、景点定位 |
| `/globe` | 3D地球 | Cesium 地球漫游、全球地标发现 |
| `/guide` | AI 攻略 | 攻略列表、AI Agent 生成 |
| `/guide/:id` | 攻略详情 | 文章阅读、相关景点 |
| `/recommend` | 智能推荐 | 根据出发地、预算、天数推荐 |

---

## 🔑 API 密钥配置

### 高德地图 (2D 地图探索)

- 配置文件：`src/config/amap.config.js`
- 获取方式：[高德开放平台](https://console.amap.com/dev/key/app)
- 平台类型：选择 **Web端(JS API)**

### Cesium & 天地图 (3D 地球探索)

- 配置文件：`src/config/cesium.config.js`
- 天地图 Token 已内置（`91cc78d5c861104952a1fb36c31936eb`）
- 可替换为自己的天地图开发者密钥

---

## 🎨 设计规范

### 主色调

| 颜色 | 色值 | 用途 |
|------|------|------|
| 🟡 Gold | `#c8a951` | 主色调 - 金色奢华感 |
| 🟡 Gold Light | `#e5d4a1` | 金色高亮 |
| 🔵 Teal | `#0d9488` | 辅助色 - 青色 |
| 🌑 Deep | `#0a0f1a` | 深色背景 |

### 设计特色

- **杂志编辑风格** - Playfair Display + Source Sans 3 字体组合
- **深色玻璃态 (Glassmorphism)** - 深色背景配合模糊效果
- **纹理叠加** - SVG noise 纹理增加质感
- **金色渐变** - 装饰线条与文字渐变
- **微动画** - 卡片悬浮、页面渐入、交错动画

---

## 📌 功能边界说明

本系统是**纯查询与建议工具**，以下功能**不在范围内**：

- ❌ 用户登录/注册系统
- ❌ 酒店预订
- ❌ 订单管理
- ❌ 后台管理界面
- ❌ 在线支付

---

## 🔧 开发指南

### 代码规范

- 使用 Vue 3 **Composition API** (`<script setup>`)
- 组件命名采用 **PascalCase**
- CSS 使用 **CSS 变量** 维护设计系统一致性
- API 请求统一通过 `src/utils/request.js` 发送

### 新增页面流程

1. 在 `src/views/front/` 下创建 `.vue` 页面文件
2. 在 `src/router/frontRoutes.js` 中注册路由
3. 如需 API 交互，在 `src/api/` 下添加接口函数
4. 如需共享状态，在 `src/stores/` 下创建 Pinia Store

---

## 📝 许可证

本项目为毕业设计/课程设计项目，仅供学习交流使用。