# 🌏 旅途智览 - 旅游查询与建议系统

> 基于 Vue 3 + Element Plus + Python FastAPI 的旅游信息查询与智能推荐平台

## 📋 项目简介

旅途智览是一个**纯查询与建议工具**，旨在为用户提供全面的景点信息查询、旅游攻略浏览和个性化旅行推荐服务。景点数据来自高德地图 POI 与维基媒体等公开来源。

### 核心特色

- 🔍 **智能搜索** - 多维度景点搜索与筛选（分类、地区、评分）
- 🤖 **个性推荐** - 基于用户旅游偏好、所在地和签证信息的智能推荐
- 🌍 **3D地球探索** - 基于 Cesium 和天地图的全景 3D 地球漫游，支持位置反向解析与全球景点发现
- 🛂 **签证管理** - 记录用户签证信息，辅助推荐可直接前往的目的地
- 📖 **旅游攻略** - 精选旅行攻略浏览与分类查询

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue 3](https://vuejs.org/) | ^3.x | 前端框架，使用 Composition API |
| [Element Plus](https://element-plus.org/) | ^2.x | UI 组件库 |
| [Vue Router 4](https://router.vuejs.org/) | ^4.x | 客户端路由 |
| [Pinia](https://pinia.vuejs.org/) | ^2.x | 状态管理 |
| [Axios](https://axios-http.com/) | ^1.x | HTTP 客户端 |
| [Cesium](https://cesium.com/platform/cesiumjs/) | ^1.x | 3D 地球可视化引擎 |
| [Vite](https://vite.dev/) | ^8.x | 构建工具 |

### 后端技术栈

| 技术 | 说明 |
|------|------|
| [Python](https://www.python.org/) 3.11+ | 后端语言 |
| [FastAPI](https://fastapi.tiangolo.com/) | Web 框架 |
| [uv](https://docs.astral.sh/uv/) | Python 包管理器 |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM |
| [SQLite](https://www.sqlite.org/) / MySQL | 数据库 |
| httpx / 高德 Web 服务 | 景点 POI 与坐标 |
| MediaWiki API | 景点介绍与攻略 |

---

## 📁 项目结构

```
d:\gcsj_4\
│
├── 📄 README.md                        # 项目说明文档（本文件）
├── 📄 index.html                       # 前端入口 HTML
├── 📄 package.json                     # 前端依赖配置
├── 📄 vite.config.js                   # Vite 构建配置
├── 📄 .env                             # 环境变量
│
├── 📂 src/                             # ===== 前端源码 =====
│   ├── main.js                         # 应用入口
│   ├── App.vue                         # 根组件
│   │
│   ├── 📂 api/                         # API 接口层
│   │   ├── index.js                    # 统一导出
│   │   ├── user.js                     # 用户接口（登录/注册/偏好/签证）
│   │   ├── scenic.js                   # 景点接口（列表/详情/搜索/收藏）
│   │   ├── guide.js                    # 攻略接口（列表/详情/分类）
│   │
│   ├── 📂 assets/                      # 静态资源
│   │   ├── images/                     # 图片资源
│   │   ├── icons/                      # 图标资源
│   │   └── styles/                     # 全局样式
│   │       ├── index.css               # 样式入口（引入字体和其他样式）
│   │       ├── variables.css           # CSS 设计变量（颜色/间距/字体等）
│   │       ├── reset.css               # 浏览器样式重置
│   │       └── element.css             # Element Plus 主题覆盖
│   │
│   ├── 📂 components/                  # 公共组件
│   │   ├── common/                     # 通用组件
│   │   │   ├── AppHeader.vue           # 顶部导航栏（含滚动透明效果）
│   │   │   ├── AppFooter.vue           # 底部页脚
│   │   │   ├── AppBreadcrumb.vue       # 面包屑导航
│   │   │   └── SearchBar.vue           # 搜索栏（含聚焦放大动画）
│   │   ├── home/                       # 首页专用组件
│   │   │   ├── HeroBanner.vue          # 轮播横幅
│   │   │   ├── HotScenic.vue           # 热门景点展示
│   │   │   └── RecommendGuide.vue      # 推荐攻略展示
│   │   ├── scenic/                     # 景点模块组件
│   │   │   ├── ScenicCard.vue          # 景点卡片（含评分/价格）
│   │   │   ├── ScenicFilter.vue        # 多维筛选器（分类/地区/评分）
│   │   │   └── ScenicGallery.vue       # 图片画廊（含缩略图和查看器）
│   │   ├── globe/                      # 3D地球探索组件
│   │   │   ├── GlobeViewer.vue         # 核心地球查看器（Cesium）
│   │   │   ├── AttractionCard.vue      # 景点发现卡片
│   │   │   └── LoadingSpinner.vue      # 3D场景加载动画
│   │   ├── guide/                      # 攻略模块组件
│   │   │   └── GuideCard.vue           # 攻略卡片
│   │   └── user/                       # 用户组件
│   │       ├── LoginForm.vue           # 登录表单
│   │       └── RegisterForm.vue        # 注册表单
│   │
│   ├── 📂 composables/                 # 组合式函数（可复用逻辑）
│   │   ├── useAuth.js                  # 认证逻辑（登录/登出/权限校验）
│   │   ├── useSearch.js                # 搜索逻辑（含防抖）
│   │   └── usePagination.js            # 分页逻辑
│   │
│   ├── 📂 layouts/                     # 页面布局
│   │   ├── FrontLayout.vue             # 前台布局（Header + Content + Footer）
│   │   └── BlankLayout.vue             # 空白布局（登录/注册页）
│   │
│   ├── 📂 router/                      # 路由配置
│   │   ├── index.js                    # 路由主文件（含导航守卫）
│   │   └── frontRoutes.js              # 前台路由定义
│   │
│   ├── 📂 stores/                      # Pinia 状态管理
│   │   ├── index.js                    # Store 统一导出
│   │   ├── user.js                     # 用户状态（认证/偏好/签证）
│   │   ├── scenic.js                   # 景点状态（列表/搜索/筛选）
│   │   └── app.js                      # 全局状态（主题/加载）
│   │
│   ├── 📂 utils/                       # 工具函数
│   │   ├── request.js                  # Axios 实例封装（拦截器/错误处理）
│   │   ├── auth.js                     # Token 和用户信息管理
│   │   ├── format.js                   # 格式化工具（日期/价格/文本）
│   │   └── validate.js                 # 表单验证规则
│   │
│   └── 📂 views/                       # 页面视图
│       ├── NotFound.vue                # 404 页面
│       │
│       ├── 📂 front/                   # ── 前台页面 ──
│       │   ├── HomeView.vue            # 首页（Banner + 搜索 + 热门 + 攻略）
│       │   ├── ScenicListView.vue      # 景点列表（搜索 + 筛选 + 分页）
│       │   ├── MapExploreView.vue      # 地图探索（高德地图底图 + 景点详情）
│       │   ├── GlobeExploreView.vue    # 3D地球探索（Cesium 漫游 + 景点发现）
│       │   ├── GuideListView.vue       # 攻略列表（分类 + 搜索）
│       │   ├── GuideDetailView.vue     # 攻略详情（文章 + 相关景点）
│       │   ├── RecommendView.vue       # 智能推荐（偏好选择 + 推荐结果）
│       │   ├── LoginView.vue           # 登录页（毛玻璃卡片）
│       │   ├── RegisterView.vue        # 注册页
│       │   └── 📂 user/               # 用户中心
│       │       ├── ProfileView.vue     # 个人信息（用户名/邮箱/所在地）
│       │       ├── PreferencesView.vue # 旅游偏好（类型/气候/预算/饮食/语言）
│       │       ├── VisaView.vue        # 签证信息（增删改查 + 有效期提醒）
│       │       └── FavoriteView.vue    # 我的收藏
│
└── 📂 server/                          # ===== 后端源码 (Python + uv) =====
    ├── pyproject.toml                  # Python 项目配置 & 依赖（uv 管理）
    ├── uv.lock                         # 依赖锁定文件（uv 自动生成）
    ├── .python-version                 # Python 版本锁定
    │
    ├── 📂 app/                         # 应用主目录
    │   ├── __init__.py
    │   ├── main.py                     # FastAPI 入口
    │   ├── config.py                   # 配置管理
    │   ├── database.py                 # 数据库连接
    │   │
    │   ├── 📂 models/                  # 数据模型 (SQLAlchemy)
    │   │   ├── __init__.py
    │   │   ├── user.py                 # 用户模型
    │   │   ├── scenic.py               # 景点模型
    │   │   ├── guide.py                # 攻略模型
│   │   ├── favorite.py             # 收藏模型
    │   │   └── visa.py                 # 签证信息模型
    │   │
    │   ├── 📂 schemas/                 # Pydantic 数据校验
    │   │   ├── __init__.py
    │   │   ├── user.py
    │   │   ├── scenic.py
    │   │   ├── guide.py
    │   │
    │   ├── 📂 api/                     # API 路由
    │   │   ├── __init__.py
    │   │   ├── auth.py                 # 认证接口
    │   │   ├── user.py                 # 用户接口
    │   │   ├── scenic.py               # 景点接口
    │   │   ├── guide.py                # 攻略接口
│   │   └── recommend.py            # 推荐接口
    │   │
    │   ├── 📂 services/                # 业务逻辑层
    │   │   ├── __init__.py
    │   │   ├── auth_service.py
    │   │   ├── scenic_service.py
    │   │   ├── guide_service.py
│   │   └── recommend_service.py    # 推荐算法
    │   │
    │   └── 📂 utils/                   # 工具函数
    │       ├── __init__.py
    │       ├── security.py             # JWT / 密码加密
    │       └── response.py             # 统一响应格式
    │
    ├── 📂 crawler/                     # 数据采集（高德 / 维基）
    │   ├── amap_client.py
    │   └── mediawiki.py
    │
    └── 📂 data/                        # 数据目录
        ├── travel.db                   # SQLite 数据库文件
        └── seeds/                      # 初始数据
            ├── scenic_seed.json
            └── guide_seed.json
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.x
- **Python** >= 3.11
- **uv** >= 0.5.x（Python 包管理器）

### 前端启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:3000
```

### 后端启动

```bash
# 1. 进入后端目录
cd server

# 2. 使用 uv 初始化（首次）
uv init
uv add fastapi uvicorn sqlalchemy pydantic python-jose passlib bcrypt
uv add httpx beautifulsoup4 apscheduler  # 爬虫相关

# 3. 启动开发服务器
### 3. API 密钥配置

本项目依赖多个第三方地图服务，请分别配置：

**高德地图 (2D 地图探索)**
- 文件路径：`src/views/front/MapExploreView.vue`
- Key：`65a5302c2cbd34e599933b9ea6eafa60`
- API 文档：[高德开放平台](https://amap.apifox.cn/)

**Cesium & 天地图 (3D 地球探索)**
- 文件路径：`src/config/cesium.config.js`
- 说明：包含 Cesium Ion Token 以及 天地图开发者 Token 影像服务配置

```bash
# 启动前端
npm run dev

### 生产构建

```bash
# 前端构建
npm run build

# 产出目录: dist/
```

---

## 📄 页面路由

### 前台页面

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 轮播 Banner、搜索、热门景点、推荐攻略 |
| `/map` | 地图探索 | 全屏高德地图、周边设施推荐、景点详情 |
| `/globe` | 3D地球 | 全景 3D 地球漫游、位置反向解析与景点发现 |
| `/guide` | 攻略列表 | 分类浏览、搜索 |
| `/guide/:id` | 攻略详情 | 文章阅读、相关景点 |
| `/recommend` | 智能推荐 | 基于偏好/签证的个性化推荐 |
| `/login` | 登录 | 用户登录 |
| `/register` | 注册 | 用户注册 |
| `/user/profile` | 个人信息 | 基本信息编辑 |
| `/user/preferences` | 旅游偏好 | 类型/气候/预算/饮食/语言 |
| `/user/visa` | 签证信息 | 签证增删改查、有效期管理 |
| `/user/favorites` | 我的收藏 | 收藏的景点列表 |


---

## 🎨 设计规范

### 主色调

| 颜色 | 色值 | 用途 |
|------|------|------|
| 🔵 Primary | `#0ea5e9` | 主色调 - 按钮、链接、高亮 |
| 🟡 Accent | `#f59e0b` | 强调色 - 评分、价格、标注 |
| 🟢 Success | `#10b981` | 成功状态 |
| 🔴 Danger | `#ef4444` | 错误/危险 |

### 设计特色

- **毛玻璃效果 (Glassmorphism)** - 顶部导航栏、登录卡片
- **微动画** - 卡片悬浮上移、搜索框聚焦放大、图片缩放
- **渐变文字** - Logo 和标题的渐变色效果
- **美化滚动条** - 自定义滚动条样式
- **Google Fonts** - Inter + Noto Sans SC 字体

---

## 📌 功能边界说明

本系统是**纯查询与建议工具**，以下功能**不在范围内**：

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

1. 在 `src/views/` 下创建 `.vue` 页面文件
2. 在 `src/router/frontRoutes.js` 中注册路由
3. 如需 API 交互，在 `src/api/` 下添加接口函数
4. 如需共享状态，在 `src/stores/` 下创建 Pinia Store

---

## 📝 许可证

本项目为毕业设计/课程设计项目，仅供学习交流使用。
