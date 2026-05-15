/**
 * 景点数据 - Mock 数据
 * 后续可替换为 API 调用
 */

export const attractionsData = {
  // 中国
  'China': {
    name: '中国',
    nameEn: 'China',
    flag: '🇨🇳',
    attractions: [
      {
        id: 'cn-001',
        name: '长城',
        location: '北京市',
        description: '世界七大奇迹之一，中国古代伟大的防御工程，全长超过2万公里，是人类历史上最宏伟的建筑工程之一。',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400'
      },
      {
        id: 'cn-002',
        name: '故宫',
        location: '北京市',
        description: '明清两代皇宫，世界上现存规模最大、保存最完整的木质结构古建筑群，收藏文物超过180万件。',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400'
      },
      {
        id: 'cn-003',
        name: '兵马俑',
        location: '陕西省西安市',
        description: '秦始皇陵陪葬坑，世界第八大奇迹，展现了秦代军队的威武气势和精湛的陶塑艺术。',
        image: 'https://images.unsplash.com/photo-1518182170546-0766abbbfd6c?w=400'
      },
      {
        id: 'cn-004',
        name: '桂林山水',
        location: '广西桂林市',
        description: '以其奇特的喀斯特地貌闻名天下，"桂林山水甲天下"的美誉流传千古。',
        image: 'https://images.unsplash.com/photo-1530878955558-a6c31b9c97db?w=400'
      },
      {
        id: 'cn-005',
        name: '西湖',
        location: '浙江省杭州市',
        description: '人间天堂杭州的代表，秀丽的湖光山色与众多历史遗迹交相辉映。',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400'
      }
    ]
  },

  // 日本
  'Japan': {
    name: '日本',
    nameEn: 'Japan',
    flag: '🇯🇵',
    attractions: [
      {
        id: 'jp-001',
        name: '富士山',
        location: '静冈县/山梨县',
        description: '日本的象征，海拔3776米，是日本最高峰，以其完美的圆锥形火山形态闻名世界。',
        image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400'
      },
      {
        id: 'jp-002',
        name: '京都金阁寺',
        location: '京都府',
        description: '正式名称为鹿苑寺，因内外贴满金箔的三层楼阁而闻名��是室町时代最具代表性的建筑。',
        image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400'
      },
      {
        id: 'jp-003',
        name: '浅草寺',
        location: '东京都',
        description: '东京最古老的寺庙，著名的雷门大灯笼是游客必到的打卡景点。',
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400'
      },
      {
        id: 'jp-004',
        name: '伏见稻荷大社',
        location: '京都府',
        description: '以千本鸟居闻名，成千上万的朱红色鸟居构成通往稻荷山的隧道，景象壮观。',
        image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400'
      }
    ]
  },

  // 法国
  'France': {
    name: '法国',
    nameEn: 'France',
    flag: '🇫🇷',
    attractions: [
      {
        id: 'fr-001',
        name: '埃菲尔铁塔',
        location: '巴黎',
        description: '巴黎的标志性建筑，高324米，世界上最受欢迎的付费景点之一，浪漫之都的象征。',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce7859?w=400'
      },
      {
        id: 'fr-002',
        name: '卢浮宫',
        location: '巴黎',
        description: '世界四大博物馆之首，收藏《蒙娜丽莎》等无数艺术珍品，贝聿铭设计的玻璃金字塔入口闻名遐迩。',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400'
      },
      {
        id: 'fr-003',
        name: '凡尔赛宫',
        location: '凡尔赛',
        description: '世界五大宫殿之一，路易十四至路易十六的王宫，镜厅的奢华令人叹为观止。',
        image: 'https://images.unsplash.com/photo-1539650116455-251d9a063595?w=400'
      },
      {
        id: 'fr-004',
        name: '圣米歇尔山',
        location: '诺曼底',
        description: '天主教朝圣地，坐落在潮汐岛屿上的中世纪修道院，堪称建筑奇迹。',
        image: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?w=400'
      }
    ]
  },

  // 美国
  'United States': {
    name: '美国',
    nameEn: 'United States',
    flag: '🇺🇸',
    attractions: [
      {
        id: 'us-001',
        name: '自由女神像',
        location: '纽约',
        description: '法国赠送给美国的礼物，自由民主的象征，纽约港的守护者，世界文化遗产。',
        image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400'
      },
      {
        id: 'us-002',
        name: '大峡谷',
        location: '亚利桑那州',
        description: '科罗拉多大峡谷，地球上最壮观的自然奇观之一，揭示了20亿年的地质历史。',
        image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=400'
      },
      {
        id: 'us-003',
        name: '黄石公园',
        location: '怀俄明州/蒙大拿州/爱达荷州',
        description: '世界上第一个国家公园，拥有间歇泉、温泉、野生动物等丰富的地热景观。',
        image: 'https://images.unsplash.com/photo-1558267832-a42f6e23d73d?w=400'
      },
      {
        id: 'us-004',
        name: '金门大桥',
        location: '旧金山',
        description: '旧金山的标志，橙色悬索桥横跨金门海峡，是世界上最上镜的桥梁之一。',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400'
      }
    ]
  },

  // 意大利
  'Italy': {
    name: '意大利',
    nameEn: 'Italy',
    flag: '🇮🇹',
    attractions: [
      {
        id: 'it-001',
        name: '斗兽场',
        location: '罗马',
        description: '古罗马文明的象征，世界最大的圆形剧场，曾是角斗士生死搏杀的场所。',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400'
      },
      {
        id: 'it-002',
        name: '威尼斯',
        location: '威尼托大区',
        description: '水上之城，由118个小岛组成，纵横交错的运河和贡多拉构成独特的城市风情。',
        image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400'
      },
      {
        id: 'it-003',
        name: '比萨斜塔',
        location: '比萨',
        description: '因地基不均匀而倾斜的钟楼，虽然倾斜却屹立不倒，成为世界建筑奇观。',
        image: 'https://images.unsplash.com/photo-1542315505-128de72b6ae0?w=400'
      }
    ]
  },

  // 埃及
  'Egypt': {
    name: '埃及',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    attractions: [
      {
        id: 'eg-001',
        name: '金字塔',
        location: '吉萨',
        description: '古埃及法老的陵墓，世界七大奇迹中唯一保存至今的建筑，展现了古埃及人惊人的智慧。',
        image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400'
      },
      {
        id: 'eg-002',
        name: '狮身人面像',
        location: '吉萨',
        description: '守卫金字塔的神秘雕像，狮身人面守护着法老的秘密，充满未解之谜。',
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=400'
      },
      {
        id: 'eg-003',
        name: '尼罗河',
        location: '埃及全境',
        description: '世界最长的河流，埃及文明的摇篮，河上的三角帆船巡游是不可错过的体验。',
        image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=400'
      }
    ]
  },

  // 澳大利亚
  'Australia': {
    name: '澳大利亚',
    nameEn: 'Australia',
    flag: '🇦🇺',
    attractions: [
      {
        id: 'au-001',
        name: '悉尼歌剧院',
        location: '悉尼',
        description: '20世纪最具特色的建筑之一，贝壳状屋顶设计独特，是悉尼乃至澳大利亚的标志。',
        image: 'https://images.unsplash.com/photo-1624138784181-dc7f5b75e52e?w=400'
      },
      {
        id: 'au-002',
        name: '大堡礁',
        location: '昆士兰州',
        description: '世界最大的珊瑚礁系统，绵延2300公里，潜水爱好者的天堂。',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400'
      },
      {
        id: 'au-003',
        name: '乌鲁鲁巨石',
        location: '北领地',
        description: '世界最大的单体岩石，澳大利亚原住民的圣地，日落时分的色彩变幻令人震撼。',
        image: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=400'
      }
    ]
  },

  // 印度
  'India': {
    name: '印度',
    nameEn: 'India',
    flag: '🇮🇳',
    attractions: [
      {
        id: 'in-001',
        name: '泰姬陵',
        location: '阿格拉',
        description: '莫卧儿皇帝沙贾汗为爱妃修建的陵墓，白色大理石建筑完美对称，被誉为"永恒面颊上的一滴眼泪"。',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400'
      },
      {
        id: 'in-002',
        name: '琥珀堡',
        location: '斋浦尔',
        description: '拉贾斯坦邦的壮观堡垒，白色大理石和红色砂岩构建，内部镶嵌艺术精美绝伦。',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400'
      },
      {
        id: 'in-003',
        name: '恒河',
        location: '瓦拉纳西',
        description: '印度教的圣河，瓦拉纳西的恒河祭典是印度最壮观的宗教仪式之一。',
        image: 'https://images.unsplash.com/photo-1561361058-4e7b5d28a59c?w=400'
      }
    ]
  }
}

/**
 * 国家坐标映射（用于识别点击位置所属国家）
 * 简化版：经纬度范围判断
 */
export const countryBounds = {
  'China': { minLon: 73, maxLon: 135, minLat: 18, maxLat: 54 },
  'Japan': { minLon: 129, maxLon: 146, minLat: 31, maxLat: 46 },
  'France': { minLon: -5, maxLon: 8, minLat: 42, maxLat: 51 },
  'United States': { minLon: -125, maxLon: -66, minLat: 25, maxLat: 49 },
  'Italy': { minLon: 7, maxLon: 19, minLat: 37, maxLat: 47 },
  'Egypt': { minLon: 25, maxLon: 35, minLat: 22, maxLat: 32 },
  'Australia': { minLon: 113, maxLon: 154, minLat: -44, maxLat: -10 },
  'India': { minLon: 68, maxLon: 97, minLat: 8, maxLat: 37 }
}

/**
 * 根据坐标识别国家
 */
export function identifyCountry(longitude, latitude) {
  for (const [country, bounds] of Object.entries(countryBounds)) {
    if (longitude >= bounds.minLon && longitude <= bounds.maxLon &&
        latitude >= bounds.minLat && latitude <= bounds.maxLat) {
      return country
    }
  }
  return null
}

/**
 * 获取国家景点数据
 */
export function getCountryAttractions(countryName) {
  if (attractionsData[countryName]) {
    return attractionsData[countryName]
  }

  for (const data of Object.values(attractionsData)) {
    if (data.name === countryName || data.nameEn === countryName) {
      return data
    }
  }

  return null
}

/**
 * 获取所有支持的国家列表
 */
export function getSupportedCountries() {
  return Object.values(attractionsData).map(country => ({
    name: country.name,
    nameEn: country.nameEn,
    flag: country.flag
  }))
}