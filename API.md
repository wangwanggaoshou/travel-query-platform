# 旅途智览 API 文档

> **Wanderlust Editorial** — 旅游查询与建议系统接口规范  
> 最后更新: 2026-05-27

---

## 目录

1. [概述](#概述)
2. [通用规范](#通用规范)
3. [用户模块 (User)](#用户模块)
4. [景点模块 (Scenic)](#景点模块)
5. [攻略模块 (Guide)](#攻略模块)
6. [3D地球模块 (Globe)](#3d地球模块)
7. [错误码参考](#错误码参考)

---

## 概述

### 技术栈

| 项目 | 说明 |
|------|------|
| 协议 | HTTP/1.1 |
| 数据格式 | JSON (application/json) |
| 认证方式 | Bearer Token (JWT) |
| 基础路径 | `/api` |
| 超时时间 | 15000ms (AI 接口 120000ms) |

### 接口统计

| 模块 | 接口数 | 说明 |
|------|--------|------|
| 用户 (User) | 7 | 登录、注册、信息管理、偏好、签证、所在地 |
| 景点 (Scenic) | 8 | 列表、详情、搜索、分类、热门、推荐、AI Agent 推荐 |
| 攻略 (Guide) | 2 | AI Agent 状态、AI 生成攻略 |
| 3D地球 (Globe) | 4 | 国家列表、坐标解析、地标列表、地标图片 |
| **合计** | **21** | |

---

## 通用规范

### 请求头

```http
Content-Type: application/json
Authorization: Bearer <token>  (需要认证的接口)
```

### 统一响应格式

所有接口返回以下 JSON 结构:

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 分页响应格式

列表类接口使用统一分页结构:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 认证说明

| 标记 | 含义 |
|------|------|
| 🔓 公开 | 无需认证 |
| 🔒 需登录 | 需要携带有效 JWT Token |
| 🔑 需权限 | 需要特定角色权限 |

---

## 用户模块

### 1. 用户登录 🔓

```http
POST /api/user/login
```

**请求体:**

```json
{
  "username": "string (必填) - 用户名",
  "password": "string (必填) - 密码"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "traveler_moon",
      "email": "moon@example.com",
      "avatar": "https://example.com/avatar.png"
    }
  }
}
```

**错误码:** 401（用户名或密码错误）、423（账号被锁定）

---

### 2. 用户注册 🔓

```http
POST /api/user/register
```

**请求体:**

```json
{
  "username": "string (必填) - 用户名，3-20字符",
  "password": "string (必填) - 密码，最少6位",
  "email": "string (必填) - 有效邮箱地址"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": 2,
    "username": "new_user"
  }
}
```

**错误码:** 409（用户名或邮箱已存在）、422（参数校验失败）

---

### 3. 获取用户信息 🔒

```http
GET /api/user/info
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "traveler_moon",
    "email": "moon@example.com",
    "avatar": "https://example.com/avatar.png",
    "location": "北京",
    "preferences": {
      "budget": "medium",
      "travelStyle": ["自然风光", "历史古迹"],
      "seasonPreference": "春秋"
    },
    "visaInfo": {
      "hasVisa": ["日本", "泰国"],
      "passportType": "普通"
    },
    "createdAt": "2026-01-15T08:00:00Z"
  }
}
```

---

### 4. 更新用户信息 🔒

```http
PUT /api/user/info
```

**请求体:**

```json
{
  "avatar": "string (可选) - 头像 URL",
  "nickname": "string (可选) - 昵称"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "avatar": "https://example.com/new-avatar.png",
    "nickname": "月亮旅行家"
  }
}
```

---

### 5. 更新旅游偏好 🔒

```http
PUT /api/user/preferences
```

**请求体:**

```json
{
  "budget": "string (可选) - low/medium/high",
  "travelStyle": ["string (可选) - 旅游风格列表"],
  "seasonPreference": "string (可选) - 季节偏好",
  "interests": ["string (可选) - 兴趣标签"]
}
```

**旅游风格可选值:** `自然风光` | `历史古迹` | `主题乐园` | `海滨度假` | `山岳景观` | `城市观光`

**预算可选值:** `low` | `medium` | `high`

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "偏好更新成功",
  "data": {
    "preferences": {
      "budget": "high",
      "travelStyle": ["自然风光", "山岳景观"],
      "seasonPreference": "秋季",
      "interests": ["徒步", "摄影"]
    }
  }
}
```

---

### 6. 更新签证信息 🔒

```http
PUT /api/user/visa
```

**请求体:**

```json
{
  "hasVisa": ["string (必填) - 已持有签证的国家列表"],
  "passportType": "string (可选) - 护照类型"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "签证信息更新成功",
  "data": {
    "visaInfo": {
      "hasVisa": ["日本", "韩国", "泰国"],
      "passportType": "普通"
    }
  }
}
```

---

### 7. 更新所在地 🔒

```http
PUT /api/user/location
```

**请求体:**

```json
{
  "location": "string (必填) - 所在地城市"
}
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "所在地更新成功",
  "data": {
    "location": "上海"
  }
}
```

---

## 景点模块

### 8. 获取景点列表 🔓

```http
GET /api/scenic/list
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10，最大 50 |
| category | string | 否 | 分类筛选 |
| region | string | 否 | 地区筛选 (domestic/overseas) |
| sortBy | string | 否 | 排序字段: rating/price/createdAt |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "张家界国家森林公园",
        "category": "自然风光",
        "region": "domestic",
        "location": "湖南省张家界市",
        "rating": 4.8,
        "price": 228,
        "image": "https://example.com/zhangjiajie.jpg",
        "description": "以独特的石英砂岩峰林地貌闻名于世...",
        "tags": ["世界遗产", "5A景区", "自然奇观"]
      }
    ],
    "total": 200,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 9. 获取景点详情 🔓

```http
GET /api/scenic/detail/:id
```

**路径参数:** `id` — 景点 ID

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张家界国家森林公园",
    "category": "自然风光",
    "region": "domestic",
    "location": "湖南省张家界市",
    "rating": 4.8,
    "price": 228,
    "images": [
      "https://example.com/zjj1.jpg",
      "https://example.com/zjj2.jpg"
    ],
    "description": "详细描述...",
    "openingHours": "07:00-18:00",
    "bestSeason": "春秋",
    "tips": "游览建议...",
    "coordinates": {
      "lat": 29.3272,
      "lng": 110.4127
    },
    "tags": ["世界遗产", "5A景区"]
  }
}
```

**错误码:** 404（景点不存在）

---

### 10. 搜索景点 🔓

```http
GET /api/scenic/search
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10，最大 50 |
| category | string | 否 | 分类筛选 |
| region | string | 否 | 地区筛选 |
| discover | bool | 否 | 无结果时尝试爬虫聚合，默认 false |
| city | string | 否 | 高德搜索限定城市，如「杭州市」 |

**成功响应 (200):** 结构同景点列表

---

### 11. 获取景点分类 🔓

```http
GET /api/scenic/categories
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "categories": [
      { "label": "自然风光", "value": "nature", "count": 85 },
      { "label": "历史古迹", "value": "history", "count": 62 },
      { "label": "主题乐园", "value": "theme_park", "count": 34 },
      { "label": "海滨度假", "value": "beach", "count": 48 },
      { "label": "山岳景观", "value": "mountain", "count": 55 },
      { "label": "城市观光", "value": "city", "count": 71 }
    ]
  }
}
```

---

### 12. 获取热门景点 🔓

```http
GET /api/scenic/hot
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 6，最大 20 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "张家界国家森林公园",
        "category": "自然风光",
        "location": "湖南省张家界市",
        "rating": 4.8,
        "price": 228,
        "image": "https://example.com/zjj.jpg",
        "description": "简短描述..."
      }
    ]
  }
}
```

---

### 13. 获取推荐景点 🔓

```http
GET /api/scenic/recommend
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10，最大 50 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ... ]
  }
}
```

---

### 14. AI Agent 推荐状态 🔓

```http
GET /api/scenic/recommend/agent/status
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "available": true,
    "model": "deepseek-chat",
    "provider": "deepseek"
  }
}
```

---

### 15. AI Agent 智能推荐 🔓

基于出发城市、旅行风格、预算、天数等条件，通过 AI Agent 生成个性化推荐。

```http
POST /api/scenic/recommend/agent
```

**请求体:**

```json
{
  "departureCity": "string (必填) - 出发城市，2-50字符",
  "travelStyles": ["string - 旅行风格标签列表"],
  "budgetMin": 0,
  "budgetMax": 10000,
  "days": 5,
  "customPrompt": "string (可选) - 自定义需求描述，最多500字",
  "limit": 3
}
```

**成功响应 (200):** 超时 120000ms

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "destinations": [
      {
        "name": "黄山风景区",
        "location": "安徽省黄山市",
        "category": "山岳景观",
        "reason": "适合「自然风光」偏好，预算范围内",
        "highlights": ["日出云海", "奇松怪石"],
        "estimatedCost": 1500
      }
    ],
    "summary": "根据您的需求推荐了3个目的地..."
  }
}
```

---

## 攻略模块

### 16. AI Agent 状态 🔓

```http
GET /api/guide/agent/status
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "available": true,
    "llm": {
      "model": "deepseek-chat",
      "provider": "deepseek"
    },
    "webSearch": {
      "provider": "tavily",
      "available": true
    }
  }
}
```

---

### 17. AI 生成攻略 🔓

通过 AI Agent 自动生成旅游攻略，支持联网搜索获取实时信息。

```http
POST /api/guide/generate
```

**请求体:**

```json
{
  "topic": "string (必填) - 攻略主题",
  "scenicId": "int (可选) - 关联景点 ID",
  "scenicName": "string (可选) - 关联景点名称",
  "location": "string (可选) - 地点",
  "category": "string (可选) - 分类"
}
```

**成功响应 (200):** 超时 120000ms

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "张家界三日深度游攻略",
    "cover": "https://example.com/guide-cover.jpg",
    "summary": "带你领略阿凡达取景地的震撼美景...",
    "author": "AI Agent",
    "tags": ["自然风光", "徒步", "摄影"],
    "date": "2026-05-27",
    "content": "<p>详细的攻略内容 (HTML)...</p>",
    "scenic": {
      "id": 1,
      "name": "张家界国家森林公园"
    },
    "source": "ai_generated"
  }
}
```

---

## 3D地球模块

### 18. 获取国家列表 🔓

```http
GET /api/globe/countries
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "countries": [
      { "key": "china", "name": "中国", "count": 85 },
      { "key": "japan", "name": "日本", "count": 42 },
      { "key": "france", "name": "法国", "count": 38 }
    ]
  }
}
```

---

### 19. 坐标解析国家 🔓

根据经纬度坐标解析所属国家，并返回该国家的地标景点。

```http
GET /api/globe/resolve
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| lon | float | 是 | 经度，-180 到 180 |
| lat | float | 是 | 纬度，-90 到 90 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "country": "china",
    "landmarks": [ ... ]
  }
}
```

**错误码:** 404（暂未收录该国家/地区的标志性目的地）

---

### 20. 获取国家地标 🔓

```http
GET /api/globe/landmarks/:country_key
```

**路径参数:** `country_key` — 国家标识，如 `china`、`japan`

**成功响应 (200):** 超时 60000ms

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "country": "中国",
    "landmarks": [
      {
        "name": "长城",
        "nameEn": "Great Wall",
        "location": "北京",
        "coordinates": { "lat": 40.4319, "lng": 116.5704 },
        "description": "世界文化遗产...",
        "images": [ "https://..." ]
      }
    ]
  }
}
```

---

### 21. 获取地标图片 🔓

通过关键词搜索地标相关图片，支持多语言名称和地点限定。

```http
GET /api/globe/landmarks/images
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词，最少2字符 |
| max | int | 否 | 最大图片数，默认 6，最大 12 |
| nameEn | string | 否 | 英文名称（用于多语言搜索） |
| location | string | 否 | 地点限定 |

**成功响应 (200):** 超时 45000ms

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "images": [
      {
        "url": "https://example.com/img1.jpg",
        "source": "wikipedia",
        "title": "长城远景"
      }
    ]
  }
}
```

---

## 错误码参考

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数有误 |
| 401 | 未登录或 Token 过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在） |
| 422 | 参数校验失败 |
| 423 | 账号被锁定 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### 业务错误码

| code | message | 说明 |
|------|---------|------|
| 200 | success | 操作成功 |
| 1001 | 用户名或密码错误 | 登录失败 |
| 1002 | 账号已被锁定 | 多次登录失败后锁定 |
| 1003 | 用户名已存在 | 注册时用户名冲突 |
| 1004 | 邮箱已被注册 | 注册时邮箱冲突 |
| 1005 | Token 已过期 | 需要重新登录 |
| 1006 | Token 无效 | Token 格式错误或伪造 |
| 2001 | 景点不存在 | 景点 ID 无效 |
| 3001 | 攻略不存在 | 攻略 ID 无效 |
| 5001 | 服务器内部错误 | 未预期的错误 |

### 错误响应示例

```json
{
  "code": 1001,
  "message": "用户名或密码错误",
  "data": null
}
```

---

## 附录

### A. 接口速查表

| # | 方法 | 路径 | 说明 | 认证 |
|---|------|------|------|------|
| 1 | POST | `/user/login` | 用户登录 | 🔓 |
| 2 | POST | `/user/register` | 用户注册 | 🔓 |
| 3 | GET | `/user/info` | 获取用户信息 | 🔒 |
| 4 | PUT | `/user/info` | 更新用户信息 | 🔒 |
| 5 | PUT | `/user/preferences` | 更新旅游偏好 | 🔒 |
| 6 | PUT | `/user/visa` | 更新签证信息 | 🔒 |
| 7 | PUT | `/user/location` | 更新所在地 | 🔒 |
| 8 | GET | `/scenic/list` | 景点列表 | 🔓 |
| 9 | GET | `/scenic/detail/:id` | 景点详情 | 🔓 |
| 10 | GET | `/scenic/search` | 搜索景点 | 🔓 |
| 11 | GET | `/scenic/categories` | 景点分类 | 🔓 |
| 12 | GET | `/scenic/hot` | 热门景点 | 🔓 |
| 13 | GET | `/scenic/recommend` | 推荐景点 | 🔓 |
| 14 | GET | `/scenic/recommend/agent/status` | AI Agent 状态 | 🔓 |
| 15 | POST | `/scenic/recommend/agent` | AI 智能推荐 | 🔓 |
| 16 | GET | `/guide/agent/status` | AI Agent 状态 | 🔓 |
| 17 | POST | `/guide/generate` | AI 生成攻略 | 🔓 |
| 18 | GET | `/globe/countries` | 国家列表 | 🔓 |
| 19 | GET | `/globe/resolve` | 坐标解析国家 | 🔓 |
| 20 | GET | `/globe/landmarks/:country_key` | 国家地标 | 🔓 |
| 21 | GET | `/globe/landmarks/images` | 地标图片 | 🔓 |

### B. 前端请求工具

前端使用 Axios 封装的请求工具，位于 `src/utils/request.js`:

- **Base URL:** `VITE_API_BASE_URL` 环境变量或 `/api`
- **超时:** 15000ms（AI 接口 120000ms）
- **请求拦截:** 自动附加 `Authorization: Bearer <token>`
- **响应拦截:** 统一错误消息提示 (401/403/404/500)
- **Token 管理:** 通过 `src/utils/auth.js` 中的 `getToken()` 获取

### C. 前端 API 模块结构

```
src/api/
├── index.js      — 统一导出
├── scenic.js     — 景点模块（列表/详情/搜索/推荐/AI Agent）
├── guide.js      — 攻略模块（AI Agent 状态/生成）
└── globe.js      — 3D地球模块（国家/地标/坐标解析/图片）
```
