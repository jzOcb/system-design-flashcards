// Hello Interview - System Design 面试知识点
// 从 53 个视频中提取的核心概念

const WordRoots = [
  // === 基础概念 (Fundamentals) ===
  {
    id: 1,
    root: "API Design",
    origin: "基础概念",
    meaning: "设计系统间通信的接口规范",
    description: "API 设计是系统设计面试的核心技能。主要包括 REST（资源导向，用 HTTP 动词）、GraphQL（灵活查询，客户端指定字段）、RPC/gRPC（高性能，适合微服务）。面试中要根据场景选择：公开 API 用 REST，复杂查询用 GraphQL，内部服务用 gRPC。",
    examples: [
      "GET /users/{id} - RESTful 资源获取",
      "mutation { createPost(input: {...}) } - GraphQL 变更",
      "service.GetUser(request) - gRPC 调用"
    ],
    videoId: "DQ57zYedMdQ",
    quiz: {
      question: "以下哪种 API 设计风格最适合内部微服务之间的高性能通信？",
      options: ["REST", "GraphQL", "gRPC", "SOAP"],
      correctAnswer: 2
    }
  },
  {
    id: 2,
    root: "Data Modeling",
    origin: "基础概念",
    meaning: "设计数据库结构和关系",
    description: "选择合适的数据库类型：SQL（强一致性、复杂查询、ACID）vs NoSQL（高扩展性、灵活 schema、最终一致性）。关键决策：主键设计、索引策略、范式化程度、读写比例。面试中要画 ER 图，说清楚表结构和查询模式。",
    examples: [
      "用户表：user_id (PK), email (unique index), created_at",
      "帖子表：post_id, user_id (FK), content, created_at",
      "多对多：followers 表 (follower_id, followee_id)"
    ],
    videoId: "TUcPS6dsWx4",
    quiz: {
      question: "以下哪个不是选择 SQL 数据库的主要原因？",
      options: ["需要强一致性", "需要 ACID 事务", "需要灵活的 schema", "需要复杂的关联查询"],
      correctAnswer: 2
    }
  },
  {
    id: 3,
    root: "Caching",
    origin: "基础概念",
    meaning: "用高速存储减少数据库访问",
    description: "Cache 是系统设计的万能药。策略：Cache-Aside（读时写缓存）、Write-Through（同步写）、Write-Behind（异步写）。失效策略：TTL、LRU、LFU。面试要点：什么数据该缓存、缓存穿透/击穿/雪崩、缓存一致性。Redis 是最常用的缓存方案。",
    examples: [
      "用户 profile 缓存 - 读多写少，TTL 5min",
      "热门帖子 - LRU 淘汰，容量限制",
      "Session 存储 - Redis + TTL"
    ],
    videoId: "1NngTUYPdpI",
    quiz: {
      question: "LRU 缓存淘汰策略的含义是什么？",
      options: ["Least Recently Used（最近最少使用）", "Least Required Usage（最少必需使用）", "Latest Request Updated（最新请求更新）", "Low Rate Usage（低频率使用）"],
      correctAnswer: 0
    }
  },
  {
    id: 4,
    root: "Sharding",
    origin: "基础概念",
    meaning: "将数据分散到多个数据库实例",
    description: "当单机数据库撑不住时需要分片。分片键选择关键：要均匀分布、避免热点、支持常用查询。策略：Range（范围分片）、Hash（哈希分片）、Directory（目录分片）。常见问题：跨分片查询、数据迁移、分片再平衡。",
    examples: [
      "按 user_id 哈希分片 - 均匀分布",
      "按时间范围分片 - 冷热数据分离",
      "按地理位置分片 - 就近访问"
    ],
    videoId: "L521gizea4s",
    quiz: {
      question: "选择分片键时，以下哪个不是关键考虑因素？",
      options: ["数据均匀分布", "避免热点", "支持常用查询", "字段名称长度"],
      correctAnswer: 3
    }
  },
  {
    id: 5,
    root: "Object Storage",
    origin: "基础概念",
    meaning: "存储图片、视频等大文件的服务",
    description: "不要把大文件存数据库！Object Storage（如 S3）专为海量非结构化数据设计。特点：无限扩展、高可用、便宜。模式：上传时生成唯一 key，数据库只存 key，访问时生成预签名 URL。CDN 配合加速分发。",
    examples: [
      "用户头像：upload → S3 → 返回 key → 存 DB",
      "视频点播：S3 + CloudFront CDN",
      "预签名 URL：临时授权直接上传/下载"
    ],
    videoId: "RvaMHMxHjp4",
    quiz: {
      question: "使用 Object Storage（如 S3）存储大文件时，数据库应该存储什么？",
      options: ["文件的完整二进制数据", "文件的唯一 key/路径", "文件的 Base64 编码", "文件的 MD5 哈希值"],
      correctAnswer: 1
    }
  },
  {
    id: 6,
    root: "Load Balancer",
    origin: "基础概念",
    meaning: "将请求分发到多个服务器",
    description: "Load Balancer 是水平扩展的关键。算法：Round Robin（轮询）、Least Connections（最少连接）、IP Hash（会话保持）、Weighted（加权）。L4（传输层）vs L7（应用层）：L7 可以基于内容路由。高可用需要多个 LB + 健康检查。",
    examples: [
      "Nginx 做 L7 负载均衡",
      "AWS ALB 自动扩展",
      "健康检查：/health 端点 + 自动摘除"
    ],
    videoId: "Ru54dxzCyD0",
    quiz: {
      question: "L7（应用层）负载均衡相比 L4（传输层）的主要优势是什么？",
      options: ["更快的处理速度", "可以基于内容（URL/Header）路由", "更低的 CPU 使用率", "更简单的配置"],
      correctAnswer: 1
    }
  },
  {
    id: 7,
    root: "Consistent Hashing",
    origin: "基础概念",
    meaning: "最小化数据迁移的分布式哈希",
    description: "普通哈希在节点增减时需要迁移大量数据。一致性哈希将哈希空间组成环，节点变化只影响相邻区域。虚拟节点解决分布不均问题。应用：分布式缓存（Memcached）、分布式存储（Cassandra）、负载均衡。",
    examples: [
      "哈希环：0-2^32 的环形空间",
      "虚拟节点：每个物理节点映射 100+ 虚拟节点",
      "节点加入：只迁移顺时针相邻节点的部分数据"
    ],
    videoId: "Consistent Hashing: Easy Explanation",
    quiz: {
      question: "一致性哈希相比普通哈希的主要优势是什么？",
      options: ["哈希计算更快", "节点增减时只需迁移少量数据", "完全不需要数据迁移", "支持更多的节点数量"],
      correctAnswer: 1
    }
  },
  {
    id: 8,
    root: "CAP Theorem",
    origin: "基础概念",
    meaning: "分布式系统只能三选二",
    description: "Consistency（一致性）、Availability（可用性）、Partition Tolerance（分区容错）只能同时满足两个。网络分区是分布式系统的现实，所以实际是 CP vs AP 的选择。CP：宁可不可用也要一致（银行）；AP：宁可不一致也要可用（社交媒体）。",
    examples: [
      "CP 系统：ZooKeeper, etcd, 强一致性数据库",
      "AP 系统：Cassandra, DynamoDB, DNS",
      "PACELC：正常时 Latency vs Consistency 的权衡"
    ],
    videoId: "CAP Theorem in System Design",
    quiz: {
      question: "在 CAP 定理中，为什么实际选择通常是 CP vs AP？",
      options: ["Consistency 和 Availability 可以同时满足", "Partition Tolerance 在分布式系统中必须保证", "网络永远不会出现分区", "现代硬件足够可靠"],
      correctAnswer: 1
    }
  },

  // === 系统设计题目 (Design Problems) ===
  {
    id: 9,
    root: "Rate Limiter",
    origin: "设计题目",
    meaning: "限制请求频率防止滥用",
    description: "核心算法：Token Bucket（令牌桶，允许突发）、Leaky Bucket（漏桶，平滑流量）、Fixed Window（固定窗口）、Sliding Window（滑动窗口，最精确）。分布式场景用 Redis + Lua 保证原子性。要考虑：限流粒度（用户/IP/API）、响应头（剩余配额）、降级策略。",
    examples: [
      "Token Bucket：每秒补充 10 个令牌，桶容量 100",
      "Sliding Window：Redis ZSET 存时间戳",
      "响应头：X-RateLimit-Remaining: 95"
    ],
    videoId: "MIJFyUPG4Z4",
    quiz: {
      question: "以下哪种限流算法可以允许短时间的突发流量？",
      options: ["Leaky Bucket（漏桶）", "Token Bucket（令牌桶）", "Fixed Window（固定窗口）", "Sliding Window（滑动窗口）"],
      correctAnswer: 1
    }
  },
  {
    id: 10,
    root: "News Feed",
    origin: "设计题目",
    meaning: "设计社交媒体信息流",
    description: "两种模式：Push（发帖时推送给所有粉丝，读快写慢）、Pull（读取时拉取关注者帖子，写快读慢）。大 V 用 Pull，普通用户用 Push（混合模式）。关键组件：Feed Service、Post Service、Fan-out Service。排序算法：时间序 + 个性化推荐。",
    examples: [
      "Push：用户发帖 → 写入所有粉丝的 feed 列表",
      "Pull：读取 feed → 查询关注者最新帖子 → 合并排序",
      "混合：粉丝 < 1000 用 Push，否则 Pull"
    ],
    videoId: "Qj4-GruzyDU",
    quiz: {
      question: "在 News Feed 设计中，为什么大 V（百万粉丝）通常采用 Pull 模式？",
      options: ["Pull 模式速度更快", "避免发帖时写入百万条记录（写放大）", "Pull 模式更省内存", "方便做个性化推荐"],
      correctAnswer: 1
    }
  },
  {
    id: 11,
    root: "URL Shortener",
    origin: "设计题目",
    meaning: "设计短链接服务（如 bit.ly）",
    description: "核心：长 URL → 短码（Base62 编码）→ 302 重定向。生成策略：自增 ID + Base62、哈希截取、预生成 + 分发。存储：<short_code, long_url, user_id, created_at>。扩展：点击统计、自定义短码、过期时间。读写比例极高（100:1），重点优化读取。",
    examples: [
      "Base62：a-z, A-Z, 0-9 → 62 字符",
      "7 位短码：62^7 ≈ 3.5 万亿组合",
      "缓存：热门短链 99% 命中率"
    ],
    videoId: "36Fg5Akhkqw",
    quiz: {
      question: "为什么 URL Shortener 使用 Base62 编码而不是 Base64？",
      options: ["Base62 编码更短", "Base62 避免了 URL 中的特殊字符（+/=）", "Base62 计算速度更快", "Base62 安全性更高"],
      correctAnswer: 1
    }
  },
  {
    id: 12,
    root: "YouTube / Video Streaming",
    origin: "设计题目",
    meaning: "设计视频上传和播放系统",
    description: "上传流程：分片上传 → 转码（多分辨率）→ 存储 S3 → CDN 分发。播放流程：自适应码率（HLS/DASH）+ CDN 边缘节点。关键指标：上传成功率、首帧时间、卡顿率。转码用异步队列，播放用 CDN + 预加载。",
    examples: [
      "分片上传：5MB/chunk，断点续传",
      "转码：1080p, 720p, 480p, 360p",
      "HLS：.m3u8 索引 + .ts 分片"
    ],
    videoId: "Youtube System Design",
    quiz: {
      question: "视频流媒体系统中，HLS（HTTP Live Streaming）的主要作用是什么？",
      options: ["加密视频内容", "实现自适应码率播放", "压缩视频大小", "防止视频被下载"],
      correctAnswer: 1
    }
  },
  {
    id: 13,
    root: "Chat System / WhatsApp",
    origin: "设计题目",
    meaning: "设计即时通讯系统",
    description: "核心：WebSocket 长连接保持实时通信。消息流：发送 → 服务器 → 推送在线用户 / 存储离线消息。消息存储：按会话分区，支持历史消息拉取。已读回执、消息撤回、端到端加密。大规模：连接层 + 业务层分离，每台服务器管理百万连接。",
    examples: [
      "WebSocket：ws://chat.example.com/connect",
      "消息结构：{msg_id, sender, receiver, content, timestamp}",
      "离线消息：SQLite 本地存储 + 服务端同步"
    ],
    videoId: "Design Whatsapp",
    quiz: {
      question: "即时通讯系统为什么使用 WebSocket 而不是 HTTP 轮询？",
      options: ["WebSocket 安全性更高", "WebSocket 支持双向实时通信，减少延迟和资源消耗", "WebSocket 传输速度更快", "HTTP 不支持消息推送"],
      correctAnswer: 1
    }
  },
  {
    id: 14,
    root: "Uber / Ride Sharing",
    origin: "设计题目",
    meaning: "设计打车系统",
    description: "核心挑战：实时位置更新、高效匹配。位置服务：司机每秒上报 GPS → 存储 Redis GEO。匹配算法：最近司机 + ETA + 评分。通知：长轮询 / WebSocket。关键组件：Location Service、Matching Service、Trip Service、Payment Service。",
    examples: [
      "Redis GEO：GEOADD drivers lng lat driver_id",
      "附近司机：GEORADIUS drivers lng lat 5 km",
      "ETA 计算：Google Maps API / 自建路网图"
    ],
    videoId: "Design Uber",
    quiz: {
      question: "Uber 系统中，Redis GEO 数据结构用于什么场景？",
      options: ["存储用户订单历史", "快速查询附近的司机", "计算车费", "管理司机评分"],
      correctAnswer: 1
    }
  },
  {
    id: 15,
    root: "Ticketmaster / 秒杀系统",
    origin: "设计题目",
    meaning: "设计高并发抢票系统",
    description: "核心挑战：库存超卖、高并发写入。解决方案：Redis 预扣库存（原子操作）→ 异步写数据库。队列削峰：请求入队 → 慢慢处理。分布式锁：防止同一用户重复下单。限流 + 验证码防刷。关键：先扣库存再创建订单，失败回滚。",
    examples: [
      "Redis DECR：原子减库存",
      "订单队列：RabbitMQ / Kafka 异步处理",
      "分布式锁：SET lock NX EX 10"
    ],
    videoId: "Design Ticketmaster",
    quiz: {
      question: "秒杀系统中，为什么要先在 Redis 扣库存，再异步写数据库？",
      options: ["Redis 更便宜", "避免数据库高并发写入压力，保证扣库存操作的原子性", "Redis 存储更可靠", "数据库不支持原子操作"],
      correctAnswer: 1
    }
  },
  {
    id: 16,
    root: "Web Crawler",
    origin: "设计题目",
    meaning: "设计大规模网页爬虫",
    description: "核心流程：URL Frontier（待爬队列）→ Fetcher（下载）→ Parser（解析）→ URL Extractor。去重：Bloom Filter 判断 URL 是否爬过。礼貌爬取：robots.txt、延迟策略、同域限流。分布式：URL 按域名哈希分配到不同 Worker。",
    examples: [
      "Bloom Filter：1% 误判率，节省 90% 内存",
      "robots.txt：遵守 Crawl-delay 和 Disallow",
      "URL Frontier：优先级队列 + 域名队列"
    ],
    videoId: "Design a Web Crawler",
    quiz: {
      question: "Web Crawler 使用 Bloom Filter 的主要目的是什么？",
      options: ["加快 URL 下载速度", "节省内存的同时判断 URL 是否已爬取", "解析网页内容", "遵守 robots.txt"],
      correctAnswer: 1
    }
  },
  {
    id: 17,
    root: "Search System",
    origin: "设计题目",
    meaning: "设计搜索引擎",
    description: "核心：倒排索引（word → [doc_ids]）。流程：爬取 → 分词 → 建索引 → 查询 → 排序。Elasticsearch 是常用方案。查询优化：分词、同义词、拼写纠错。排序：TF-IDF、BM25、个性化加权。分布式：索引分片 + 查询合并。",
    examples: [
      "倒排索引：'apple' → [doc1, doc3, doc7]",
      "TF-IDF：词频 × 逆文档频率",
      "Elasticsearch：分片 + 副本 + 自动均衡"
    ],
    videoId: "Design FB Post Search"
  },
  {
    id: 18,
    root: "Notification System",
    origin: "设计题目",
    meaning: "设计通知推送系统",
    description: "多渠道：Push（APNs/FCM）、SMS、Email、In-App。核心组件：通知服务 → 渠道适配器 → 第三方 API。用户偏好：订阅设置、免打扰时间。可靠性：重试机制、死信队列。高并发：消息队列削峰、批量发送。",
    examples: [
      "Push：设备 token → APNs/FCM → 手机",
      "批量：1000 条/批，避免 API 限流",
      "模板：'{{user}} liked your post'"
    ],
    videoId: "Notification System"
  },
  {
    id: 19,
    root: "Top-K / Leaderboard",
    origin: "设计题目",
    meaning: "设计实时排行榜",
    description: "小规模：Redis ZSET（Sorted Set）O(logN) 操作。大规模：分层聚合（分钟 → 小时 → 天）。近似算法：Count-Min Sketch、HyperLogLog。实时 Top-K：流式计算（Flink/Spark Streaming）。",
    examples: [
      "Redis ZSET：ZINCRBY leaderboard 1 user_id",
      "Top 10：ZREVRANGE leaderboard 0 9 WITHSCORES",
      "Count-Min Sketch：固定内存估算频率"
    ],
    videoId: "y-tA2NW4LNY"
  },
  {
    id: 20,
    root: "Dropbox / File Sync",
    origin: "设计题目",
    meaning: "设计文件同步系统",
    description: "核心：文件分块 + 增量同步。上传：文件 → 分块（4MB）→ 计算哈希 → 只上传新块。同步：本地变更 → 通知服务器 → 推送其他设备。冲突解决：版本向量、最后写入胜出。元数据存数据库，文件块存 S3。",
    examples: [
      "分块：4MB/块，SHA256 哈希",
      "增量同步：只同步变化的块",
      "冲突：文件重命名为 'file (conflict)'"
    ],
    videoId: "Design Dropbox or Google Drive"
  },

  // === 深入技术 (Deep Dives) ===
  {
    id: 21,
    root: "Cassandra",
    origin: "深入技术",
    meaning: "分布式 NoSQL 宽列数据库",
    description: "特点：无主架构、线性扩展、高可用。数据模型：Keyspace → Table → Row → Column。写入：Commit Log → Memtable → SSTable。一致性级别：ONE/QUORUM/ALL。适合：写密集、时序数据、地理分布。",
    examples: [
      "分区键：决定数据分布的节点",
      "聚簇键：分区内的排序顺序",
      "QUORUM：多数节点确认才返回成功"
    ],
    videoId: "TD3-INhm60Q"
  },
  {
    id: 22,
    root: "Kafka",
    origin: "深入技术",
    meaning: "分布式消息队列和流处理平台",
    description: "核心概念：Topic（主题）→ Partition（分区）→ Offset（偏移量）。Producer 写入，Consumer Group 消费。高吞吐：顺序写磁盘、零拷贝、批量处理。持久化：消息保留时间/大小可配置。用例：日志收集、事件溯源、流处理。",
    examples: [
      "Topic：orders, user-events, logs",
      "分区：按 key 哈希分配，保证顺序",
      "Consumer Group：自动负载均衡"
    ],
    videoId: "Kafka System Design Deep Dive"
  },
  {
    id: 23,
    root: "Redis",
    origin: "深入技术",
    meaning: "内存数据结构存储",
    description: "数据结构：String, List, Set, Sorted Set, Hash, Stream。用例：缓存、会话、排行榜、限流、分布式锁。持久化：RDB（快照）+ AOF（追加日志）。集群：Redis Cluster 自动分片。单线程模型，靠 I/O 多路复用实现高并发。",
    examples: [
      "缓存：GET/SET + TTL",
      "分布式锁：SET lock NX EX 10",
      "排行榜：ZSET 自动排序"
    ],
    videoId: "Redis Deep Dive"
  },
  {
    id: 24,
    root: "Elasticsearch",
    origin: "深入技术",
    meaning: "分布式搜索和分析引擎",
    description: "基于 Lucene 的倒排索引。核心：Index → Shard → Document。查询 DSL：match, term, bool, range。分析器：分词、大小写、同义词。聚合：桶聚合、指标聚合。用例：全文搜索、日志分析（ELK Stack）、实时分析。",
    examples: [
      "倒排索引：term → posting list",
      "分片：主分片 + 副本分片",
      "查询：GET /index/_search { 'query': {...} }"
    ],
    videoId: "Elasticsearch Deep Dive"
  },
  {
    id: 25,
    root: "DynamoDB",
    origin: "深入技术",
    meaning: "AWS 托管 NoSQL 数据库",
    description: "Key-Value + Document 混合模型。分区键（哈希）+ 排序键。读写容量单位（RCU/WCU）或按需模式。GSI（全局二级索引）支持其他查询模式。DynamoDB Streams 实现变更捕获。无服务器，自动扩展。",
    examples: [
      "主键：PK (user_id) + SK (timestamp)",
      "查询：只能按键查询，不支持 JOIN",
      "GSI：以其他属性为分区键建索引"
    ],
    videoId: "DynamoDB Deep Dive"
  },
  {
    id: 26,
    root: "Time Series Database",
    origin: "深入技术",
    meaning: "专为时间序列数据优化的数据库",
    description: "特点：高写入吞吐、时间范围查询优化、自动数据压缩/聚合。代表：InfluxDB, TimescaleDB, Prometheus。数据模型：measurement + tags + fields + timestamp。用例：监控指标、IoT 数据、金融行情。",
    examples: [
      "写入：cpu,host=server01 usage=0.64 1609459200",
      "查询：SELECT mean(usage) WHERE time > now() - 1h GROUP BY time(5m)",
      "降采样：1 秒数据 → 1 分钟聚合"
    ],
    videoId: "Qd76ZmfRs_Q"
  },

  // === 面试技巧 (Interview Skills) ===
  {
    id: 27,
    root: "系统设计面试框架",
    origin: "面试技巧",
    meaning: "结构化回答系统设计问题",
    description: "Hello Interview 框架：1) 需求澄清（功能/非功能）2) API 设计 3) 核心实体 4) 高层架构 5) 深入探讨。时间分配：需求 5min，设计 25min，深入 15min。画图要清晰，每个组件都要能解释。主动引导对话，展示权衡思考。",
    examples: [
      "需求：DAU 多少？读写比例？延迟要求？",
      "权衡：一致性 vs 可用性，成本 vs 性能",
      "深入：选一个组件深挖，展示专业度"
    ],
    videoId: "Ru54dxzCyD0"
  },
  {
    id: 28,
    root: "Behavioral Interview",
    origin: "面试技巧",
    meaning: "行为面试问题的 STAR 回答法",
    description: "STAR：Situation（情境）→ Task（任务）→ Action（行动）→ Result（结果）。常见问题：冲突解决、失败经历、影响他人、技术决策。准备 5-7 个故事覆盖不同维度。量化结果（节省 X%、提升 Y 倍）。展示成长和反思。",
    examples: [
      "冲突：与同事技术方案分歧 → 数据驱动决策",
      "失败：上线 bug 导致故障 → 改进测试流程",
      "影响：推动团队采用新技术 → 效率提升 30%"
    ],
    videoId: "CAda15Tawlg"
  },
  {
    id: 29,
    root: "Back-of-Envelope Estimation",
    origin: "面试技巧",
    meaning: "快速估算系统容量",
    description: "常用数字：1 天 = 86400 秒 ≈ 10^5；1 年 ≈ 3×10^7 秒。存储：1 char = 1 byte；1 KB = 1000 chars；1 MB = 1 photo。带宽：1 Gbps = 125 MB/s。QPS = DAU × 每用户请求数 / 86400。",
    examples: [
      "Twitter QPS：500M DAU × 10 req/day / 86400 ≈ 60K QPS",
      "存储：1B 用户 × 1KB profile = 1 TB",
      "峰值：平均 QPS × 3-5"
    ],
    videoId: "Ru54dxzCyD0"
  },
  {
    id: 30,
    root: "Trade-offs Discussion",
    origin: "面试技巧",
    meaning: "展示工程权衡思维",
    description: "没有完美方案，只有权衡。常见权衡：一致性 vs 可用性、延迟 vs 吞吐、成本 vs 性能、简单 vs 功能。说清楚为什么选择某方案，在什么情况下会选另一个。面试官想看的是思考过程，不只是答案。",
    examples: [
      "SQL vs NoSQL：一致性需求 → SQL；扩展性需求 → NoSQL",
      "Push vs Pull：小粉丝量 → Push；大 V → Pull",
      "同步 vs 异步：用户感知延迟敏感 → 同步；后台处理 → 异步"
    ],
    videoId: "Ru54dxzCyD0"
  }
];

// 网站配置
const SiteConfig = {
  title: "System Design 面试速成",
  subtitle: "来自 Hello Interview 的 FAANG 面试官教程",
  description: "基于 Hello Interview YouTube 频道 53 个视频，提炼 30 个核心概念",
  source: "Hello Interview (hellointerview.com)",
  totalConcepts: 30,
  categories: {
    "基础概念": 8,
    "设计题目": 12,
    "深入技术": 6,
    "面试技巧": 4
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WordRoots, SiteConfig };
}
