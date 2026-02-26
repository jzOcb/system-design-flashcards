// Hello Interview - System Design 深度讲解版
// 面向零基础学习者，解释每个技术选择的前因后果

const WordRootsDetailed = [
  // === 基础概念 (Fundamentals) ===
  {
    id: 1,
    root: "API Design",
    origin: "基础概念",
    meaning: "设计系统间通信的接口规范",
    
    // 为什么重要
    why: `
想象你在餐厅点餐：你（客户端）告诉服务员（API）你想要什么，服务员把你的要求传达给厨房（后端服务器），然后把做好的菜端给你。

API 就是这个"服务员"——它定义了：
• 客户端可以发什么请求
• 服务器会返回什么响应
• 双方如何"说话"（数据格式）

在系统设计面试中，API 设计通常是第一步，因为它直接反映了你对需求的理解。
    `,
    
    // 详细讲解
    deepDive: `
### 三种主流 API 风格

#### 1. REST（Representational State Transfer）
**核心思想**：把一切看作"资源"，用 HTTP 动词操作资源

\`\`\`
GET    /users/123      → 获取用户 123 的信息
POST   /users          → 创建新用户
PUT    /users/123      → 更新用户 123（全量）
PATCH  /users/123      → 更新用户 123（部分）
DELETE /users/123      → 删除用户 123
\`\`\`

**优点**：
• 简单直观，学习成本低
• 浏览器原生支持
• 天然支持缓存（GET 请求可缓存）

**缺点**：
• 可能过度获取（Over-fetching）：只需要用户名，却返回整个用户对象
• 可能不足获取（Under-fetching）：需要多次请求才能拿到关联数据

**适用场景**：公开 API、简单 CRUD 操作

---

#### 2. GraphQL
**核心思想**：客户端精确指定需要什么数据

\`\`\`graphql
# 只获取用户名和头像，不多不少
query {
  user(id: "123") {
    name
    avatar
    posts(limit: 5) {
      title
    }
  }
}
\`\`\`

**优点**：
• 一个请求获取所有需要的数据
• 强类型，自带文档
• 前端灵活，后端不用为每个页面写接口

**缺点**：
• 学习曲线陡峭
• 难以缓存（POST 请求）
• 可能被滥用（复杂查询拖垮服务器）

**适用场景**：复杂前端（如 Facebook）、多端适配（Web/iOS/Android 需求不同）

---

#### 3. gRPC（Google Remote Procedure Call）
**核心思想**：像调用本地函数一样调用远程服务

\`\`\`protobuf
// 定义服务
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}

// 调用就像本地函数
user = userService.GetUser(request)
\`\`\`

**优点**：
• 性能极高（二进制编码，比 JSON 小 10 倍）
• HTTP/2 支持多路复用、流式传输
• 强类型，自动生成客户端代码

**缺点**：
• 浏览器支持差（需要 gRPC-Web）
• 可读性差（二进制）
• 调试困难

**适用场景**：微服务之间的内部通信

---

### 面试中如何选择？

| 场景 | 推荐方案 | 理由 |
|-----|---------|------|
| 公开 API | REST | 简单、通用、易于对接 |
| 前端复杂 | GraphQL | 减少请求次数，灵活 |
| 微服务内部 | gRPC | 高性能，强类型 |
| 移动端 | REST 或 GraphQL | 节省流量，减少请求 |
    `,
    
    // 面试常问
    interviewTips: [
      "先定义 API 再设计系统，展示你的结构化思维",
      "说明为什么选择这种 API 风格，而不是死记硬背",
      "考虑版本控制：/v1/users 还是 Header 里带版本号？",
      "讨论分页策略：offset/limit 还是 cursor-based？",
      "别忘了错误处理：返回什么状态码和错误信息？"
    ],
    
    // 实际案例
    realWorldExample: `
**案例：设计 Twitter 的发推 API**

\`\`\`
POST /v1/tweets
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "Hello World!",
  "media_ids": ["abc123"],  // 可选，已上传的图片
  "reply_to": "tweet456"    // 可选，回复某条推
}

Response: 201 Created
{
  "id": "tweet789",
  "content": "Hello World!",
  "author": {
    "id": "user123",
    "username": "jason"
  },
  "created_at": "2024-01-01T12:00:00Z",
  "media": [...],
  "metrics": {
    "likes": 0,
    "retweets": 0,
    "replies": 0
  }
}
\`\`\`

**设计考量**：
1. 为什么用 POST？创建资源
2. 为什么 media_ids 而不是直接传图片？大文件应该单独上传到 Object Storage
3. 为什么返回完整对象？客户端可以立即展示，不用再请求
    `,
    
    examples: [
      "GET /users/{id} - RESTful 资源获取",
      "mutation { createPost(input: {...}) } - GraphQL 变更",
      "service.GetUser(request) - gRPC 调用"
    ],
    videoId: "DQ57zYedMdQ"
  },
  
  {
    id: 2,
    root: "Data Modeling",
    origin: "基础概念",
    meaning: "设计数据库结构和关系",
    
    why: `
数据模型就像房子的地基——地基打不好，房子迟早要出问题。

为什么重要？
• 错误的数据模型 → 查询慢、难扩展、改起来痛苦
• 正确的数据模型 → 查询快、易维护、扩展自然

两个关键决策：
1. 用什么数据库？SQL 还是 NoSQL？
2. 表/集合怎么设计？字段、索引、关系？
    `,
    
    deepDive: `
### SQL vs NoSQL：如何选择？

#### SQL 数据库（MySQL, PostgreSQL）
**本质**：数据存在表格里，表之间有关系

\`\`\`sql
-- 用户表
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100),
  created_at TIMESTAMP
);

-- 帖子表（外键关联用户）
CREATE TABLE posts (
  id BIGINT PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP
);
\`\`\`

**选 SQL 的理由**：
• 需要复杂查询（JOIN 多个表）
• 需要事务（转账：扣钱+加钱必须同时成功）
• 数据结构固定，不经常变
• 需要强一致性（银行、订单）

**SQL 的问题**：
• 扩展难（单机有上限）
• Schema 变更麻烦（加字段要锁表）
• 写入瓶颈（单点写）

---

#### NoSQL 数据库（MongoDB, Cassandra, DynamoDB）

**本质**：放弃一些 SQL 的特性，换取扩展性

**文档数据库（MongoDB）**：
\`\`\`json
{
  "_id": "user123",
  "email": "jason@example.com",
  "name": "Jason",
  "posts": [
    {"id": "post1", "content": "Hello"},
    {"id": "post2", "content": "World"}
  ]
}
\`\`\`

**选 NoSQL 的理由**：
• 数据量巨大（TB/PB 级）
• 需要水平扩展（加机器就能提升性能）
• 数据结构灵活（不同用户有不同字段）
• 高写入吞吐（日志、IoT 数据）

**NoSQL 的问题**：
• 不支持 JOIN（需要应用层处理）
• 最终一致性（可能读到旧数据）
• 事务支持有限

---

### 数据建模最佳实践

#### 1. 主键设计
\`\`\`
❌ 自增 ID：1, 2, 3...
   问题：可预测、分布式难生成、泄露业务量

✅ UUID/ULID：01ARZ3NDEKTSV4RRFFQ69G5FAV
   优点：全局唯一、无需协调、不可预测
   
✅ 雪花 ID：组合时间戳+机器ID+序列号
   优点：有序、高性能、包含时间信息
\`\`\`

#### 2. 索引策略
\`\`\`sql
-- 经常查询的字段要建索引
CREATE INDEX idx_user_email ON users(email);

-- 联合索引：注意顺序！
-- 查询 WHERE user_id = ? AND created_at > ?
CREATE INDEX idx_posts_user_time ON posts(user_id, created_at);
\`\`\`

**索引原则**：
• 查询条件里的字段
• 排序字段
• 选择性高的字段（email 好，gender 差）
• 不要过多（写入变慢）

#### 3. 范式化 vs 反范式化

**范式化**（数据不重复）：
\`\`\`
users: {id, name}
posts: {id, user_id, content}  -- 只存 user_id
\`\`\`
优点：数据一致，修改方便
缺点：查询需要 JOIN

**反范式化**（允许冗余）：
\`\`\`
posts: {id, user_id, user_name, content}  -- 冗余存 user_name
\`\`\`
优点：查询快，不需要 JOIN
缺点：用户改名要更新所有帖子

**权衡**：读多写少 → 反范式化；写多 → 范式化
    `,
    
    interviewTips: [
      "先问清楚读写比例！这决定了很多设计",
      "画 ER 图，说清楚表结构",
      "解释为什么选 SQL 或 NoSQL，不要随便说",
      "讨论索引：哪些查询、怎么建索引",
      "考虑数据量增长：1 年后还能撑住吗？"
    ],
    
    realWorldExample: `
**案例：设计 Twitter 的数据模型**

\`\`\`
Users 表（SQL - 需要事务和一致性）
- id (PK)
- username (unique)
- email (unique)
- password_hash
- created_at

Tweets 表（可以是 NoSQL - 需要高写入）
- id (PK, 雪花ID - 包含时间，天然有序)
- user_id
- content
- media_urls[]
- created_at
- reply_to_id (nullable)

Follows 表（需要高效查询）
- follower_id
- followee_id
- created_at
PRIMARY KEY (follower_id, followee_id)

Timeline（反范式化的缓存表 - 提高读取速度）
- user_id
- tweet_id
- tweet_content (冗余)
- author_name (冗余)
- created_at
\`\`\`

**为什么这样设计？**
1. Users 用 SQL：需要唯一约束、事务（注册时检查邮箱是否已存在）
2. Tweets 可以用 NoSQL：写入量大、不需要复杂关联
3. Timeline 反范式化：首页 feed 读取量巨大，必须快
    `,
    
    examples: [
      "用户表：user_id (PK), email (unique index), created_at",
      "帖子表：post_id, user_id (FK), content, created_at",
      "多对多：followers 表 (follower_id, followee_id)"
    ],
    videoId: "TUcPS6dsWx4"
  },
  
  {
    id: 3,
    root: "Caching",
    origin: "基础概念",
    meaning: "用高速存储减少数据库访问",
    
    why: `
想象你每次想看一张照片，都要跑到储藏室翻箱倒柜。太慢了！
如果把常看的照片放在书桌上呢？一伸手就能拿到。

这就是缓存的本质：
• 数据库 = 储藏室（大、慢）
• 缓存 = 书桌（小、快）

为什么需要缓存？
• 数据库慢（磁盘 I/O，网络延迟）
• 重复请求多（热门内容被反复访问）
• 计算结果可复用（复杂查询结果）

**性能差距**：
• 数据库查询：10-100ms
• Redis 缓存：0.1-1ms
• 100 倍差距！
    `,
    
    deepDive: `
### 缓存策略详解

#### 1. Cache-Aside（旁路缓存）- 最常用
\`\`\`python
def get_user(user_id):
    # 1. 先查缓存
    user = cache.get(f"user:{user_id}")
    if user:
        return user  # 缓存命中
    
    # 2. 缓存没有，查数据库
    user = db.query(f"SELECT * FROM users WHERE id = {user_id}")
    
    # 3. 写入缓存，设置过期时间
    cache.set(f"user:{user_id}", user, ttl=300)  # 5分钟
    
    return user
\`\`\`

**优点**：简单、可控
**缺点**：首次请求慢、可能数据不一致

---

#### 2. Write-Through（写穿）
\`\`\`
写数据 → 同时写缓存和数据库

优点：缓存始终是最新的
缺点：写入延迟增加
适用：数据一致性要求高的场景
\`\`\`

#### 3. Write-Behind（写回）
\`\`\`
写数据 → 先写缓存 → 异步批量写数据库

优点：写入超快
缺点：可能丢数据（缓存挂了数据就没了）
适用：可以容忍数据丢失的高频写入（日志、统计）
\`\`\`

---

### 缓存失效策略

#### TTL（Time To Live）
\`\`\`
cache.set("key", value, ttl=3600)  # 1小时后自动过期
\`\`\`
简单粗暴，适合时效性数据

#### LRU（Least Recently Used）
\`\`\`
缓存满了 → 踢掉最久没被访问的

用 HashMap + 双向链表实现：
- HashMap: O(1) 查找
- 链表: 维护访问顺序
\`\`\`

#### LFU（Least Frequently Used）
\`\`\`
缓存满了 → 踢掉访问次数最少的

比 LRU 更"公平"，但实现复杂
\`\`\`

---

### 缓存三大问题

#### 1. 缓存穿透
**问题**：查询不存在的数据，每次都打到数据库
\`\`\`
请求 user_id = -1 (不存在)
→ 缓存没有 → 查数据库 → 没有 → 不缓存
→ 下次还是打数据库...
\`\`\`

**解决方案**：
\`\`\`python
# 方案1：缓存空值
user = db.query(user_id)
if user is None:
    cache.set(f"user:{user_id}", "NULL", ttl=60)  # 缓存空值

# 方案2：布隆过滤器
if not bloom_filter.might_contain(user_id):
    return None  # 肯定不存在，不查数据库
\`\`\`

#### 2. 缓存击穿
**问题**：热点数据过期瞬间，大量请求同时打到数据库
\`\`\`
热门明星微博 → 缓存过期 → 10万请求同时查数据库 → 数据库崩了
\`\`\`

**解决方案**：
\`\`\`python
# 方案1：互斥锁
def get_hot_data(key):
    data = cache.get(key)
    if data:
        return data
    
    # 只让一个请求去查数据库
    if cache.setnx(f"lock:{key}", 1, ttl=10):
        data = db.query(...)
        cache.set(key, data)
        cache.delete(f"lock:{key}")
    else:
        time.sleep(0.1)  # 等一下，别人在查
        return get_hot_data(key)

# 方案2：热点数据永不过期，后台定时更新
\`\`\`

#### 3. 缓存雪崩
**问题**：大量缓存同时过期，数据库被压垮
\`\`\`
所有缓存 TTL = 1小时 → 1小时后全部过期 → 雪崩
\`\`\`

**解决方案**：
\`\`\`python
# TTL 加随机值
base_ttl = 3600
random_offset = random.randint(0, 600)  # 0-10分钟随机
cache.set(key, value, ttl=base_ttl + random_offset)
\`\`\`

---

### Redis 最常用数据结构

\`\`\`
String：简单 key-value
  SET user:123 "Jason"
  GET user:123

Hash：对象存储
  HSET user:123 name "Jason" age 30
  HGET user:123 name

List：队列/最近访问
  LPUSH recent:user:123 "post:456"
  LRANGE recent:user:123 0 9  # 最近10条

Set：去重、交集
  SADD followers:jason "alice" "bob"
  SINTER followers:jason followers:bob  # 共同关注

Sorted Set：排行榜
  ZADD leaderboard 100 "player1" 200 "player2"
  ZREVRANGE leaderboard 0 9  # Top 10
\`\`\`
    `,
    
    interviewTips: [
      "先说清楚为什么需要缓存（读多写少？热点数据？）",
      "选择合适的缓存策略，解释原因",
      "主动提到缓存一致性问题和解决方案",
      "讨论缓存大小和淘汰策略",
      "Redis 常用命令要熟悉"
    ],
    
    realWorldExample: `
**案例：Twitter 首页 Timeline 缓存设计**

\`\`\`
1. 用户发推
   → 写入 Tweets 表
   → 异步推送到粉丝的 Timeline 缓存

2. 用户刷首页
   → 直接读 Timeline 缓存（Redis List）
   → 缓存没有才查数据库

3. 缓存结构
   timeline:{user_id} = [tweet_id1, tweet_id2, ...]
   tweet:{tweet_id} = {content, author, created_at, ...}

4. 问题：大V发推怎么办？1000万粉丝
   → 不推送！粉丝请求时再拉取大V最新推文（拉模式）
   → 普通用户用推模式，大V用拉模式 = 混合模式
\`\`\`
    `,
    
    examples: [
      "用户 profile 缓存 - 读多写少，TTL 5min",
      "热门帖子 - LRU 淘汰，容量限制",
      "Session 存储 - Redis + TTL"
    ],
    videoId: "1NngTUYPdpI"
  },

  {
    id: 4,
    root: "Sharding",
    origin: "基础概念",
    meaning: "将数据分散到多个数据库实例",
    
    why: `
假设你有一本 10000 页的书，一个人看太慢了。怎么办？
把书拆成 10 份，10 个人同时看！

这就是分片（Sharding）：
• 数据量太大，一台机器存不下
• 请求太多，一台机器处理不过来
• 解决方案：分散到多台机器

什么时候需要分片？
• 单表数据量超过 1000 万行
• 单库数据量超过 500 GB
• 单机 QPS 超过 5000
    `,
    
    deepDive: `
### 分片策略详解

#### 1. 范围分片（Range Sharding）
\`\`\`
按某个字段的范围分配数据：

用户 ID 1-100万 → Shard 1
用户 ID 100万-200万 → Shard 2
...

优点：范围查询高效（查 ID 50万-60万的用户，只需要查 Shard 1）
缺点：容易热点（新用户都在最后一个分片）
\`\`\`

#### 2. 哈希分片（Hash Sharding）
\`\`\`
shard_id = hash(user_id) % num_shards

用户 ID 12345 → hash(12345) % 4 = 1 → Shard 1
用户 ID 67890 → hash(67890) % 4 = 2 → Shard 2

优点：数据均匀分布
缺点：范围查询需要查所有分片
\`\`\`

#### 3. 目录分片（Directory Sharding）
\`\`\`
维护一个映射表：

用户 jason → Shard 3
用户 alice → Shard 1

优点：灵活，可以手动调整
缺点：映射表本身成为瓶颈
\`\`\`

---

### 分片键选择 - 最关键的决策！

**好的分片键特征**：
1. 高基数（Cardinality）：可能的值很多
2. 均匀分布：不会集中在某几个分片
3. 查询友好：常用查询能定位到单个分片

**案例分析**：

\`\`\`
❌ 按性别分片
   问题：只有2个值，一半数据在一个分片

❌ 按创建时间分片
   问题：写入集中在最新分片（热点）

✅ 按用户 ID 哈希分片
   优点：均匀分布，用户相关查询高效

✅ 按地理位置分片
   适用场景：用户基本只访问本地数据
\`\`\`

---

### 分片的代价（Trade-offs）

#### 1. 跨分片查询
\`\`\`sql
-- 如果按 user_id 分片，这个查询要扫描所有分片：
SELECT * FROM orders WHERE product_id = 123;
\`\`\`

#### 2. 跨分片事务
\`\`\`
用户 A 转账给用户 B：
- A 在 Shard 1
- B 在 Shard 2
- 需要分布式事务（复杂、慢）
\`\`\`

#### 3. 数据迁移
\`\`\`
增加分片数量时，数据需要重新分布：
- 从 4 个分片变成 8 个
- 需要迁移约 50% 的数据
- 一致性哈希可以减少迁移量
\`\`\`

---

### 一致性哈希（Consistent Hashing）

普通哈希的问题：
\`\`\`
hash(key) % 4 = 2  → Shard 2
# 增加到 5 个分片后：
hash(key) % 5 = 3  → Shard 3
# 大量数据需要迁移！
\`\`\`

一致性哈希的解决：
\`\`\`
1. 把哈希空间想象成一个环（0 到 2^32）
2. 每个分片在环上有一个位置
3. 数据的哈希值顺时针找到最近的分片

添加新分片时：
- 只影响相邻分片的数据
- 大约 1/N 的数据需要迁移（N是分片数）
\`\`\`
    `,
    
    interviewTips: [
      "先问：数据量多大？QPS 多少？真的需要分片吗？",
      "分片键选择要说清楚 trade-off",
      "主动提跨分片查询的问题和解决方案",
      "知道一致性哈希的原理和好处",
      "讨论分片后的运维复杂度"
    ],
    
    realWorldExample: `
**案例：电商订单系统分片设计**

\`\`\`
需求：
- 日订单量 1000 万
- 需要按用户查询、按订单号查询
- 需要统计每日销售额

设计：
1. 分片键：user_id（用户查自己的订单最常见）
2. 分片策略：user_id 哈希 % 64 个分片
3. 订单号设计：分片ID + 时间戳 + 序列号
   - 通过订单号可以直接知道在哪个分片

查询优化：
- 用户查订单：直接定位分片
- 按订单号查：从订单号解析分片ID
- 统计销售额：Map-Reduce，各分片并行统计后汇总
\`\`\`
    `,
    
    examples: [
      "按 user_id 哈希分片 - 均匀分布",
      "按时间范围分片 - 冷热数据分离",
      "按地理位置分片 - 就近访问"
    ],
    videoId: "L521gizea4s"
  }
];

// 导出
if (typeof module !== 'undefined') {
  module.exports = { WordRootsDetailed };
}
