// 升级版闪卡数据 - 问题→答案格式，面试导向
// 不再是简单定义，而是真正有用的面试问题

const FlashcardData = [
  // === 权衡类问题 (Trade-offs) ===
  {
    id: 1,
    category: "权衡决策",
    question: "什么时候选 SQL，什么时候选 NoSQL？",
    answer: "SQL: 需要 ACID、复杂 JOIN、数据一致性要求高（银行、订单）\nNoSQL: 需要水平扩展、schema 灵活、最终一致性可接受（社交、日志）\n\n面试关键：说清楚你的场景需要什么，不是背定义",
    followUp: "如果面试官追问：你们公司用的是什么？为什么？"
  },
  {
    id: 2,
    category: "权衡决策",
    question: "News Feed 用 Push 还是 Pull？",
    answer: "Push（写扩散）: 发帖时写入所有粉丝 feed，读快写慢，适合粉丝少的普通用户\nPull（读扩散）: 读取时拉取关注者帖子，写快读慢，适合大 V\n\n实际方案：混合！粉丝 <1000 用 Push，大 V 用 Pull",
    followUp: "Twitter/Instagram 都是混合模式"
  },
  {
    id: 3,
    category: "权衡决策",
    question: "一致性 vs 可用性，你选哪个？",
    answer: "这是 CAP 定理的核心。网络分区时必须二选一：\n\nCP（一致性）: 银行转账、库存扣减 - 宁可报错也不能数据错\nAP（可用性）: 社交点赞、评论 - 宁可短暂不一致也要能用\n\n面试关键：根据业务场景选择，不是技术偏好",
    followUp: "追问：那你怎么处理最终一致性？答：消息队列 + 补偿机制"
  },
  {
    id: 4,
    category: "权衡决策",
    question: "同步调用 vs 异步消息队列？",
    answer: "同步: 用户等待结果、需要立即响应（登录验证、支付确认）\n异步: 可以后台处理、允许延迟（发邮件、生成报告、视频转码）\n\n判断标准：用户是否需要立即看到结果？",
    followUp: "异步的问题：如何保证消息不丢？答：ACK 机制 + 死信队列"
  },

  // === 数字估算类 (Back-of-Envelope) ===
  {
    id: 5,
    category: "数字估算",
    question: "Twitter 的 QPS 大概是多少？怎么算？",
    answer: "DAU: 500M\n每用户每天请求: ~10 次（刷 feed + 发推）\nQPS = 500M × 10 / 86400 ≈ 58,000\n峰值 = 平均 × 3~5 ≈ 200,000 QPS\n\n记住：1 天 ≈ 10^5 秒",
    followUp: "写请求远少于读（100:1），分别估算"
  },
  {
    id: 6,
    category: "数字估算",
    question: "存储 10 亿用户的 profile 需要多少空间？",
    answer: "假设每用户 profile 1KB（名字、头像URL、bio等）\n1B × 1KB = 1TB\n\n加上索引、备份、增长：预留 3-5TB\n\n面试技巧：先说假设，再算数字",
    followUp: "如果要存头像图片呢？那是 Object Storage（S3），另算"
  },
  {
    id: 7,
    category: "数字估算",
    question: "一台机器能处理多少 QPS？",
    answer: "经验值：\n- 简单 CRUD：10,000-50,000 QPS\n- 复杂业务逻辑：1,000-5,000 QPS\n- 数据库写入：1,000-10,000 QPS（取决于索引）\n\n所以 200K QPS 的 Twitter 需要 20-200 台应用服务器",
    followUp: "Redis 单机可达 100K+ QPS，MySQL 单机约 5-10K QPS"
  },

  // === 场景判断类 (Scenario) ===
  {
    id: 8,
    category: "场景判断",
    question: "用户说 '网站很慢'，你怎么定位问题？",
    answer: "分层排查：\n1. 前端：Chrome DevTools 看网络瀑布图\n2. CDN：检查 cache hit rate\n3. 负载均衡：看各服务器负载\n4. 应用层：APM 工具看慢请求\n5. 数据库：慢查询日志\n6. 缓存：cache miss rate\n\n从用户最近的地方开始查",
    followUp: "如果是特定用户慢：检查地理位置、网络、账号数据量"
  },
  {
    id: 9,
    category: "场景判断",
    question: "秒杀系统怎么防止超卖？",
    answer: "核心：Redis 原子扣库存\n\n```\nif (DECR stock >= 0) {\n  创建订单（异步）\n} else {\n  INCR stock  // 回滚\n  return 售罄\n}\n```\n\n配套：限流（令牌桶）+ 验证码防刷 + 队列削峰",
    followUp: "为什么不用数据库？答：太慢，QPS 撑不住"
  },
  {
    id: 10,
    category: "场景判断",
    question: "数据库主从延迟导致用户刚发的帖子看不到，怎么办？",
    answer: "三种方案：\n1. 写后读主库（简单粗暴，但主库压力大）\n2. 客户端缓存刚写的数据（乐观更新）\n3. 读请求带版本号，从库版本不够就读主库\n\n最常用：方案 2，用户体验最好",
    followUp: "这就是 'Read Your Own Writes' 一致性"
  },

  // === 组件选型类 (Component Selection) ===
  {
    id: 11,
    category: "组件选型",
    question: "什么时候用 Redis，什么时候用 Memcached？",
    answer: "Redis: 需要数据结构（List/Set/ZSet）、持久化、Pub/Sub\nMemcached: 纯 KV 缓存、多线程（单机性能略高）\n\n实际：99% 场景选 Redis，功能更全，运维更方便",
    followUp: "Redis 6.0 也支持多线程了"
  },
  {
    id: 12,
    category: "组件选型",
    question: "消息队列选 Kafka 还是 RabbitMQ？",
    answer: "Kafka: 高吞吐、日志收集、流处理、消息可重放\nRabbitMQ: 复杂路由、低延迟、传统消息队列语义\n\n简单判断：数据量大 + 要重放 → Kafka；否则 RabbitMQ",
    followUp: "Kafka 不保证消息顺序（跨 partition），RabbitMQ 单队列保证"
  },
  {
    id: 13,
    category: "组件选型",
    question: "搜索功能用 MySQL LIKE 还是 Elasticsearch？",
    answer: "MySQL LIKE: 小数据量、简单前缀匹配\nElasticsearch: 全文搜索、分词、高亮、聚合分析\n\n判断点：\n- 数据量 >100 万？\n- 需要分词搜索？\n- 需要相关性排序？\n\n有一个 Yes 就上 ES",
    followUp: "ES 的坑：写入有延迟（近实时，不是实时）"
  },

  // === API 设计类 ===
  {
    id: 14,
    category: "API设计",
    question: "REST vs GraphQL vs gRPC 怎么选？",
    answer: "REST: 公开 API、简单 CRUD、缓存友好\nGraphQL: 前端灵活查询、减少 over-fetching\ngRPC: 内部微服务、高性能、强类型\n\n实际：外部用 REST，内部用 gRPC，复杂前端用 GraphQL",
    followUp: "gRPC 基于 HTTP/2，支持双向流"
  },
  {
    id: 15,
    category: "API设计",
    question: "分页用 offset 还是 cursor？",
    answer: "Offset: 简单、支持跳页，但大 offset 性能差\nCursor: 性能稳定、适合无限滚动，但不能跳页\n\n判断：数据量大 + 只需要下一页 → Cursor\n需要跳到第 N 页 → Offset（加上 limit）",
    followUp: "Cursor 实现：用上一页最后一条的 ID 或时间戳"
  },

  // === 经典设计题 ===
  {
    id: 16,
    category: "设计题",
    question: "设计 URL 短链服务，核心是什么？",
    answer: "核心：长 URL → 短码 → 302 重定向\n\n短码生成：\n1. 自增 ID + Base62 编码\n2. MD5 哈希取前 7 位\n\n存储：<short_code, long_url, user_id, created_at>\n\n优化：热门短链缓存（99% 命中率）",
    followUp: "7 位 Base62 = 62^7 ≈ 3.5 万亿，够用"
  },
  {
    id: 17,
    category: "设计题",
    question: "设计 Rate Limiter，用什么算法？",
    answer: "四种算法：\n1. Token Bucket（令牌桶）: 允许突发，最常用\n2. Leaky Bucket（漏桶）: 平滑流量\n3. Fixed Window: 简单但有边界问题\n4. Sliding Window: 最精确但复杂\n\n分布式：Redis + Lua 保证原子性",
    followUp: "令牌桶参数：桶容量（允许的突发）+ 填充速率（QPS 限制）"
  },
  {
    id: 18,
    category: "设计题",
    question: "设计聊天系统，消息怎么实时推送？",
    answer: "WebSocket 长连接保持实时通信\n\n消息流：\n发送 → 服务器 → 查收件人在线状态\n→ 在线：WebSocket 推送\n→ 离线：存储离线消息，上线后拉取\n\n大规模：连接层（Gateway）和业务层分离",
    followUp: "单台服务器可管理 100 万 WebSocket 连接（C10M 问题）"
  },

  // === 数据库深入 ===
  {
    id: 19,
    category: "数据库",
    question: "数据库索引的 B+ 树和 Hash 索引有什么区别？",
    answer: "B+ 树: 支持范围查询、排序，大多数场景的默认选择\nHash: 只支持等值查询，但 O(1) 查找，适合精确匹配\n\nMySQL InnoDB 只支持 B+ 树\nRedis/Memcached 用 Hash",
    followUp: "B+ 树叶子节点有链表，所以范围扫描快"
  },
  {
    id: 20,
    category: "数据库",
    question: "什么时候分库分表？分片键怎么选？",
    answer: "信号：单表 >5000 万行 或 单库 >1TB\n\n分片键原则：\n1. 均匀分布（避免热点）\n2. 常用查询条件（避免跨分片）\n3. 不可变（用户 ID 好，状态不好）\n\n常见：按 user_id 哈希分片",
    followUp: "分片后最大问题：跨分片 JOIN 和事务"
  },

  // === 缓存相关 ===
  {
    id: 21,
    category: "缓存",
    question: "缓存穿透、击穿、雪崩分别是什么？怎么解决？",
    answer: "穿透：查不存在的数据，每次都打 DB\n→ 解决：缓存空值 或 布隆过滤器\n\n击穿：热点 key 过期，大量请求打 DB\n→ 解决：互斥锁 或 永不过期 + 异步更新\n\n雪崩：大量 key 同时过期\n→ 解决：过期时间加随机值",
    followUp: "三个问题的共同点：都是 DB 被打爆"
  },
  {
    id: 22,
    category: "缓存",
    question: "缓存和数据库不一致怎么办？",
    answer: "常见策略：Cache-Aside（旁路缓存）\n\n读：先查缓存，miss 则查 DB 并写缓存\n写：先写 DB，再删缓存（不是更新！）\n\n为什么删不是更新？避免并发写导致脏数据",
    followUp: "极端情况还是可能不一致，加个短 TTL 兜底"
  },

  // === 分布式系统 ===
  {
    id: 23,
    category: "分布式",
    question: "分布式锁怎么实现？有什么坑？",
    answer: "Redis 实现：SET key value NX EX 10\n\n坑：\n1. 锁过期但任务没完成 → 续期（Redisson 看门狗）\n2. Redis 主从切换丢锁 → RedLock（多数派）\n3. 客户端 GC 导致锁过期 → Fencing Token",
    followUp: "Fencing Token：每次加锁返回递增 token，资源端拒绝旧 token"
  },
  {
    id: 24,
    category: "分布式",
    question: "分布式事务怎么做？",
    answer: "几种方案（可靠性递增，性能递减）：\n1. 最终一致性：消息队列 + 补偿\n2. TCC：Try-Confirm-Cancel 三阶段\n3. Saga：长事务拆分 + 补偿链\n4. 2PC：强一致但阻塞，很少用\n\n大部分场景用方案 1 就够了",
    followUp: "电商下单：订单服务发消息 → 库存服务消费 → 失败则补偿"
  },

  // === 面试技巧 ===
  {
    id: 25,
    category: "面试技巧",
    question: "系统设计面试的前 5 分钟该做什么？",
    answer: "需求澄清！问清楚再动笔：\n\n1. 功能需求：核心功能是什么？MVP 范围？\n2. 非功能需求：DAU？QPS？延迟要求？\n3. 约束：现有系统？技术栈限制？\n\n这 5 分钟决定了后面 40 分钟的方向",
    followUp: "不问需求直接画图是大忌，显得没有产品思维"
  },
  {
    id: 26,
    category: "面试技巧",
    question: "面试官问 '还有什么要优化的吗'，怎么答？",
    answer: "展示深度的好机会：\n\n1. 监控告警：Metrics/Logging/Tracing\n2. 容灾：多 AZ 部署、故障转移\n3. 安全：DDoS 防护、数据加密\n4. 成本优化：冷热分离、预留实例\n5. 国际化：多地域部署、CDN\n\n挑一两个深入讲",
    followUp: "说 '可以加缓存' 太浅，要说清楚缓存什么、怎么更新"
  },
  {
    id: 27,
    category: "面试技巧",
    question: "Behavioral 问 '说一个你和同事有冲突的经历'，怎么答？",
    answer: "STAR 格式：\nS（情境）：简短背景\nT（任务）：你的职责\nA（行动）：具体做了什么\nR（结果）：量化成果 + 学到什么\n\n关键：展示你如何通过沟通/数据解决分歧，不是赢了争论",
    followUp: "准备 5-7 个故事覆盖：冲突、失败、影响他人、技术决策"
  },

  // === 高级话题 ===
  {
    id: 28,
    category: "高级",
    question: "什么是 CQRS？什么时候用？",
    answer: "Command Query Responsibility Segregation\n读写分离到极致：读模型和写模型完全独立\n\n适用：读写比例悬殊（100:1）、读写需求差异大\n\n例：写入用 MySQL（事务），读取用 ES（搜索）+ Redis（缓存）",
    followUp: "CQRS 常配合 Event Sourcing 使用"
  },
  {
    id: 29,
    category: "高级",
    question: "什么是 Event Sourcing？",
    answer: "不存状态，存事件。当前状态 = 所有事件的累加。\n\n优点：完整审计日志、可回溯、支持时间旅行\n缺点：查询需要重放、存储成本高\n\n例：银行账户不存余额，存每笔交易，余额实时计算",
    followUp: "Event Sourcing + CQRS 是复杂系统的终极形态"
  },
  {
    id: 30,
    category: "高级",
    question: "微服务拆分的原则是什么？",
    answer: "核心原则：\n1. 单一职责：一个服务做一件事\n2. 独立部署：改一个不影响其他\n3. 数据独立：每个服务有自己的 DB\n\n拆分信号：团队边界、发布频率差异、扩展需求不同\n\n不要过早拆分！先单体，痛了再拆",
    followUp: "拆分后最大挑战：分布式事务和数据一致性"
  }
];

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FlashcardData };
}
