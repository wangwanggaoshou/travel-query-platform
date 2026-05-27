# 旅途智览 - 旅游查询与建议系统

> 基于 Vue 3 + Element Plus + Python FastAPI 的旅游信息查询与智能推荐平台

## 项目简介

旅途智览是一个**纯查询与建议工具**，旨在为用户提供全面的景点信息查询、旅游攻略浏览和个性化旅行推荐服务。景点数据来自高德地图 POI 与维基媒体等公开来源。

### 核心特色

- **智能搜索** - 多维度景点搜索与筛选（分类、地区、评分），支持爬虫聚合扩展
- **地图探索** - 高德地图集成，查看景点坐标与周边设施
- **3D地球探索** - 基于 Cesium 和天地图的全景 3D 地球漫游，全球地标发现
- **AI 攻略生成** - 通过 AI Agent 自动生成旅游攻略，支持联网搜索
- **智能推荐** - AI Agent 根据出发地、预算、天数、旅行风格推荐合适目的地

---

## 技术架构

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

## 项目结构

```
D:\gcsj_4\
│
├── front-end/                       # 前端项目
│   ├── README.md                    # 前端说明文档（本文件）
│   ├── API.md                       # API 接口文档
│   ├── index.html                   # 入口 HTML
│   ├── package.json                 # 依赖配置
│   ├── vite.config.js               # Vite 构建配置
│   │
│   └── src/                         # 源码目录
│       ├── main.js                  # 应用入口
│       ├── App.vue                  # 根组件
│       │
│       ├── api/                     # API 接口层
│       │   ├── index.js             # 统一导出
│       │   ├── scenic.js            # 景点接口（列表/详情/搜索/推荐/AI Agent）
│       │   ├── guide.js             # 攻略接口（AI Agent 状态/生成）
│       │   └── globe.js             # 3D地球接口（国家/地标/坐标解析/图片）
│       │
│       ├── assets/                  # 静态资源
│       │   ├── hero.png             # 首页横幅图片
│       │   └── styles/              # 全局样式（可选）
│       │
│       ├── components/              # 公共组件
│       │   ├── common/              # AppHeader / AppBreadcrumb / SearchBar
│       │   ├── home/                # HeroBanner / HotScenic / FeaturedCarousel
│       │   ├── scenic/              # ScenicCard / ScenicFilter / ScenicGallery
│       │   ├── globe/               # GlobeViewer / AttractionCard / GlobeAttractionDetail
│       │   └── guide/               # GuideCard
│       │
│       ├── composables/             # useSearch / usePagination
│       │
│       ├── config/                  # amap.config.js / cesium.config.js
│       │
│       ├── constants/               # departureCities.js
│       │
│       ├── layouts/                 # FrontLayout.vue
│       │
│       ├── router/                  # index.js / frontRoutes.js
│       │
│       ├── stores/                  # scenic.js / app.js
│       │
│       ├── utils/                   # request / format / validate / amapPoi / geocoder 等
│       │
│       └── views/                   # 页面视图
│           ├── NotFound.vue         # 404 页面
│           └── front/               # HomeView / ScenicListView / MapExploreView / GlobeExploreView / GuideListView / GuideDetailView / RecommendView
│
└── back-end/                        # 后端项目
    └── README.md                    # 后端说明文档
```

---

## 快速开始

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

## 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 搜索、热门景点、探索方式、使用指引 |
| `/scenic` | 景点查询 | 景点列表、搜索、筛选、分类浏览 |
| `/map` | 地图探索 | 高德地图、周边设施、景点定位 |
| `/globe` | 3D地球 | Cesium 地球漫游、全球地标发现 |
| `/guide` | AI 攻略 | 攻略列表、AI Agent 生成 |
| `/guide/:id` | 攻略详情 | 文章阅读、相关景点 |
| `/recommend` | 智能推荐 | AI Agent 根据出发地、预算、天数推荐 |

---

## API 密钥配置

### 高德地图 (2D 地图探索)

- 配置文件：`src/config/amap.config.js`
- 获取方式：[高德开放平台](https://console.amap.com/dev/key/app)
- 平台类型：选择 **Web端(JS API)**

### Cesium & 天地图 (3D 地球探索)

- 配置文件：`src/config/cesium.config.js`
- 天地图 Token 已内置
- 可替换为自己的天地图开发者密钥

---

## 设计规范

### 主色调

| 颜色 | 色值 | 用途 |
|------|------|------|
| Gold | `#c8a951` | 主色调 - 金色奢华感 |
| Gold Light | `#e5d4a1` | 金色高亮 |
| Teal | `#0d9488` | 辅助色 - 青色 |
| Deep | `#0a0f1a` | 深色背景 |

### 设计特色

- **杂志编辑风格** - Playfair Display + Source Sans 3 字体组合
- **深色玻璃态 (Glassmorphism)** - 深色背景配合模糊效果
- **纹理叠加** - SVG noise 纹理增加质感
- **金色渐变** - 装饰线条与文字渐变
- **微动画** - 卡片悬浮、页面渐入、交错动画

---

## 功能边界说明

本系统是**纯查询与建议工具**，以下功能**不在范围内**：

- 用户登录/注册系统（后端已预留接口，前端未实现）
- 酒店预订
- 订单管理
- 后台管理界面
- 在线支付

---

## 开发指南

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

## 许可证

本项目为毕业设计/课程设计项目，仅供学习交流使用。