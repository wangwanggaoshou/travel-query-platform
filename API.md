# 旅途智览 API 文档

> **Wanderlust Editorial** — 旅游查询与建议系统接口规范  
> 最后更新: 2026-05-14

---

## 目录

1. [概述](#概述)
2. [通用规范](#通用规范)
3. [用户模块 (User)](#用户模块)
4. [景点模块 (Scenic)](#景点模块)
5. [攻略模块 (Guide)](#攻略模块)
6. [评论模块 (Review)](#评论模块)
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
| 超时时间 | 15000ms |

### 接口统计

| 模块 | 接口数 | 说明 |
|------|--------|------|
| 用户 (User) | 6 | 登录、注册、信息管理、偏好、签证、所在地 |
| 景点 (Scenic) | 9 | 列表、详情、搜索、分类、热门、推荐、收藏 |
| 攻略 (Guide) | 6 | 列表、详情、搜索、分类、热门、推荐 |
| 评论 (Review) | 6 | 景点评论、来源站点、筛选、统计 |
| **合计** | **27** | |

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
| pageSize | int | 否 | 每页条数，默认 10 |
| category | string | 否 | 分类筛选 |
| region | string | 否 | 地区筛选 |
| rating | string | 否 | 最低评分筛选 (如 "4.0") |
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
        "reviewCount": 1256,
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
    "tags": ["世界遗产", "5A景区"],
    "reviewCount": 1256,
    "reviewStats": {
      "average": 4.8,
      "distribution": { "5": 800, "4": 350, "3": 80, "2": 20, "1": 6 }
    }
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
| pageSize | int | 否 | 每页条数，默认 10 |
| category | string | 否 | 分类筛选 |
| region | string | 否 | 地区筛选 |

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
| limit | int | 否 | 返回数量，默认 6 |

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
        "description": "简短描述...",
        "reviewCount": 1256
      }
    ]
  }
}
```

---

### 13. 获取推荐景点 🔒

基于用户偏好和签证信息生成个性化推荐。

```http
GET /api/scenic/recommend
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 5,
        "name": "黄山风景区",
        "category": "山岳景观",
        "location": "安徽省黄山市",
        "rating": 4.9,
        "price": 190,
        "image": "https://example.com/huangshan.jpg",
        "description": "...",
        "reviewCount": 2300,
        "matchReason": "匹配您的「山岳景观」偏好",
        "matchScore": 0.95
      }
    ]
  }
}
```

**说明:** 未登录用户调用此接口将返回通用热门推荐。

---

### 14. 收藏景点 🔒

```http
POST /api/scenic/favorite/:id
```

**路径参数:** `id` — 景点 ID

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "收藏成功"
}
```

**错误码:** 404（景点不存在）、409（已收藏）

---

### 15. 取消收藏 🔒

```http
DELETE /api/scenic/favorite/:id
```

**路径参数:** `id` — 景点 ID

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "取消收藏成功"
}
```

---

### 16. 获取收藏列表 🔒

```http
GET /api/scenic/favorites
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ... ],
    "total": 15,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 攻略模块

### 17. 获取攻略列表 🔓

```http
GET /api/guide/list
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |
| category | string | 否 | 分类筛选 |
| scenicId | int | 否 | 关联景点 ID |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "张家界三日深度游攻略",
        "cover": "https://example.com/guide-cover.jpg",
        "summary": "带你领略阿凡达取景地的震撼美景...",
        "author": "旅行达人小王",
        "tags": ["自然风光", "徒步", "摄影"],
        "date": "2026-04-20",
        "viewCount": 5600,
        "likeCount": 328
      }
    ],
    "total": 150,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 18. 获取攻略详情 🔓

```http
GET /api/guide/detail/:id
```

**路径参数:** `id` — 攻略 ID

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "张家界三日深度游攻略",
    "cover": "https://example.com/guide-cover.jpg",
    "author": "旅行达人小王",
    "authorAvatar": "https://example.com/author.jpg",
    "date": "2026-04-20",
    "tags": ["自然风光", "徒步", "摄影"],
    "content": "<p>详细的攻略内容 (HTML)...</p>",
    "scenic": {
      "id": 1,
      "name": "张家界国家森林公园"
    },
    "viewCount": 5600,
    "likeCount": 328,
    "relatedGuides": [
      { "id": 2, "title": "...", "cover": "..." }
    ]
  }
}
```

**错误码:** 404（攻略不存在）

---

### 19. 搜索攻略 🔓

```http
GET /api/guide/search
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**成功响应 (200):** 结构同攻略列表

---

### 20. 获取攻略分类 🔓

```http
GET /api/guide/categories
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "categories": [
      { "label": "自然风光", "value": "nature", "count": 45 },
      { "label": "城市漫步", "value": "city", "count": 38 },
      { "label": "美食之旅", "value": "food", "count": 30 },
      { "label": "自驾攻略", "value": "roadtrip", "count": 22 },
      { "label": "预算旅行", "value": "budget", "count": 15 }
    ]
  }
}
```

---

### 21. 获取热门攻略 🔓

```http
GET /api/guide/hot
```

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 6 |

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

### 22. 获取推荐攻略 🔒

```http
GET /api/guide/recommend
```

基于用户浏览记录和偏好生成推荐攻略。

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 返回数量，默认 10 |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "张家界三日深度游攻略",
        "cover": "https://example.com/guide-cover.jpg",
        "summary": "...",
        "author": "旅行达人小王",
        "tags": ["自然风光", "徒步"],
        "date": "2026-04-20",
        "matchReason": "基于您对「自然风光」的偏好"
      }
    ]
  }
}
```

---

## 评论模块

> **说明:** 评论数据全部来源于网页爬虫，每条评论附带来源网站信息。系统不提供用户直接发表评论的功能。

### 23. 获取景点评论列表 🔓

```http
GET /api/review/scenic/:scenicId
```

**路径参数:** `scenicId` — 景点 ID

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |
| sortBy | string | 否 | 排序: newest/rating |

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "scenicId": 1,
        "content": "非常震撼的自然景观，强烈推荐！",
        "rating": 5,
        "source": "携程旅行",
        "sourceUrl": "https://ctrip.com/review/123",
        "reviewer": "匿名用户",
        "date": "2026-04-15",
        "usefulCount": 42
      }
    ],
    "total": 1256,
    "page": 1,
    "pageSize": 10
  }
}
```

---

### 24. 获取评论来源站点列表 🔓

```http
GET /api/review/sources
```

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "sources": [
      { "name": "携程旅行", "code": "ctrip", "icon": "https://example.com/ctrip.png" },
      { "name": "马蜂窝", "code": "mafengwo", "icon": "https://example.com/mafengwo.png" },
      { "name": "去哪儿", "code": "qunar", "icon": "https://example.com/qunar.png" },
      { "name": "穷游网", "code": "qyer", "icon": "https://example.com/qyer.png" },
      { "name": "TripAdvisor", "code": "tripadvisor", "icon": "https://example.com/tripadvisor.png" }
    ]
  }
}
```

---

### 25. 按来源筛选评论 🔓

```http
GET /api/review/scenic/:scenicId/source/:source
```

**路径参数:**

| 参数 | 说明 |
|------|------|
| scenicId | 景点 ID |
| source | 来源站点代码 (如 "ctrip") |

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页条数，默认 10 |

**成功响应 (200):** 结构同评论列表

---

### 26. 获取评论统计 🔓

```http
GET /api/review/scenic/:scenicId/stats
```

**路径参数:** `scenicId` — 景点 ID

**成功响应 (200):**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "scenicId": 1,
    "average": 4.8,
    "total": 1256,
    "distribution": {
      "5": 800,
      "4": 350,
      "3": 80,
      "2": 20,
      "1": 6
    },
    "sourceDistribution": {
      "ctrip": 450,
      "mafengwo": 320,
      "qunar": 210,
      "qyer": 156,
      "tripadvisor": 120
    },
    "sentimentBreakdown": {
      "positive": 0.85,
      "neutral": 0.10,
      "negative": 0.05
    }
  }
}
```

---

### 27. 查看 Markdown 视图 🔓

虽然系统前端不直接调用此端点，但 API 支持返回 Markdown 格式的评论视图，方便集成。

```http
GET /api/review/scenic/:scenicId/markdown
```

**Accept:** `text/markdown`

**成功响应:** Markdown 格式的评论文本。

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
| 409 | 资源冲突（如重复收藏、用户名已存在） |
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
| 2002 | 已收藏该景点 | 重复收藏 |
| 2003 | 未收藏该景点 | 取消收藏时未找到记录 |
| 3001 | 攻略不存在 | 攻略 ID 无效 |
| 4001 | 评论数据获取失败 | 爬虫数据异常 |
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
| 13 | GET | `/scenic/recommend` | 推荐景点 | 🔒 |
| 14 | POST | `/scenic/favorite/:id` | 收藏景点 | 🔒 |
| 15 | DELETE | `/scenic/favorite/:id` | 取消收藏 | 🔒 |
| 16 | GET | `/scenic/favorites` | 收藏列表 | 🔒 |
| 17 | GET | `/guide/list` | 攻略列表 | 🔓 |
| 18 | GET | `/guide/detail/:id` | 攻略详情 | 🔓 |
| 19 | GET | `/guide/search` | 搜索攻略 | 🔓 |
| 20 | GET | `/guide/categories` | 攻略分类 | 🔓 |
| 21 | GET | `/guide/hot` | 热门攻略 | 🔓 |
| 22 | GET | `/guide/recommend` | 推荐攻略 | 🔒 |
| 23 | GET | `/review/scenic/:scenicId` | 景点评论 | 🔓 |
| 24 | GET | `/review/sources` | 评论来源 | 🔓 |
| 25 | GET | `/review/scenic/:scenicId/source/:source` | 按来源筛选 | 🔓 |
| 26 | GET | `/review/scenic/:scenicId/stats` | 评论统计 | 🔓 |
| 27 | GET | `/review/scenic/:scenicId/markdown` | Markdown 视图 | 🔓 |

### B. 前端请求工具

前端使用 Axios 封装的请求工具，位于 `src/utils/request.js`:

- **Base URL:** `VITE_API_BASE_URL` 环境变量或 `/api`
- **超时:** 15000ms
- **请求拦截:** 自动附加 `Authorization: Bearer <token>`
- **响应拦截:** 统一错误消息提示 (401/403/404/500)
- **Token 管理:** 通过 `src/utils/auth.js` 中的 `getToken()` 获取

### C. 前端 API 模块结构

```
src/api/
├── index.js      — 统一导出
├── user.js       — 用户模块 (7 接口)
├── scenic.js     — 景点模块 (9 接口)
├── guide.js      — 攻略模块 (6 接口)
└── review.js     — 评论模块 (5 接口)
```
