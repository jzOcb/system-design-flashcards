// System Design Cases - 详细版
// 每个案例包含：完整需求分析、设计决策理由、深入技术细节、面试技巧

const casesData = {
  cases: [
    {
      id: "youtube",
      title: "Design YouTube",
      category: "Product Design",
      difficulty: "Hard",
      
      // 需求分析 - 解释每个需求的重要性
      requirements: {
        functional: [
          "视频上传：用户能上传最大 256GB 的视频文件（需要分片上传、断点续传）",
          "视频播放：流式播放，支持拖动进度条（需要视频分片存储）",
          "视频处理：自动转码成多种分辨率（1080p/720p/480p/360p）",
          "元数据管理：标题、描述、标签、缩略图、隐私设置",
          "视频搜索：按标题、描述、标签搜索（需要搜索引擎）"
        ],
        non_functional: [
          "高可用 > 强一致：宁可短暂看到旧数据，不能服务不可用",
          "低延迟播放：首帧 < 500ms（需要 CDN + 预加载）",
          "规模：1M 上传/天，100M DAU，10亿+ 视频库",
          "带宽适应：自动切换画质（HLS/DASH 协议）",
          "持久性：视频一旦上传成功，永不丢失"
        ]
      },

      // 容量估算 - 面试必问
      estimation: `
**存储估算：**
• 日上传：1M 视频 × 平均 500MB = 500TB/天
• 转码后（多分辨率）：约 3 倍 = 1.5PB/天
• 年存储：~500PB（需要 Object Storage）

**带宽估算：**
• DAU：100M 用户 × 平均 5 视频 × 10 分钟 × 5Mbps
• 峰值带宽：约 100Tbps（需要全球 CDN）

**QPS 估算：**
• 播放请求：100M × 5 视频 / 86400秒 ≈ 6K QPS（平均）
• 峰值 3 倍：18K QPS
• 上传请求：1M / 86400 ≈ 12 QPS（相对小）
      `,

      api_design: [
        "POST /v1/videos/upload-url - 获取预签名上传 URL（直传 S3）",
        "POST /v1/videos/upload-complete - 上传完成，触发转码",
        "GET /v1/videos/{id}/manifest - 获取 HLS/DASH manifest",
        "GET /v1/videos/{id}/chunks/{quality}/{index} - 获取视频分片",
        "GET /v1/search?q={query}&page={n} - 搜索视频",
        "POST /v1/videos/{id}/views - 记录观看（异步写入）"
      ],

      // 详细的高层设计，解释每个组件选择的原因
      high_level_design: `
**上传流程（为什么这样设计）：**

\`\`\`
Client ──────────────────────────────────────────────────────
   │
   │ 1. POST /upload-url (请求上传)
   ▼
API Gateway ───────────────────────────────────────────────────
   │  
   │ 为什么要 API Gateway？
   │ • 统一入口，方便限流、认证
   │ • 可以做请求路由
   ▼
Upload Service ────────────────────────────────────────────────
   │
   │ 2. 返回预签名 URL (Pre-signed URL)
   │    为什么用预签名？
   │    • 客户端直传 S3，不经过服务器
   │    • 减少服务器带宽压力
   │    • URL 有时效性，安全
   ▼
Client 直传 S3 ──────────────────────────────────────────────────
   │
   │ 3. 分片上传（Multipart Upload）
   │    为什么要分片？
   │    • 256GB 大文件，单次上传必然失败
   │    • 支持断点续传
   │    • 可以并行上传多个分片
   ▼
S3 Object Storage ──────────────────────────────────────────────
   │
   │ 4. 上传完成通知
   ▼
Transcoding Queue (Kafka/SQS) ─────────────────────────────────
   │
   │ 5. 转码任务入队
   │    为什么用消息队列？
   │    • 转码很慢（分钟级），不能同步等待
   │    • 队列削峰填谷
   │    • 失败可重试
   ▼
Transcoding Workers (Kubernetes Jobs) ─────────────────────────
   │
   │ 6. 转码成多种分辨率
   │    • 1080p, 720p, 480p, 360p
   │    • 生成 HLS/DASH 分片
   │    • 每个分片约 2-10 秒
   ▼
S3 + CDN ────────────────────────────────────────────────────
   │
   │ 7. 转码完成，更新元数据
   ▼
Metadata DB (MySQL/PostgreSQL) ────────────────────────────────
\`\`\`

**播放流程：**

\`\`\`
Client 请求播放
   │
   │ 1. GET /videos/{id}/manifest
   ▼
API → Metadata DB 查询视频信息
   │
   │ 2. 返回 manifest 文件（包含各分辨率的分片列表）
   ▼
Client 解析 manifest，请求视频分片
   │
   │ 3. GET /chunks/1080p/001.ts
   ▼
CDN (边缘节点)
   │
   │ Cache HIT → 直接返回（延迟 < 50ms）
   │ Cache MISS → 回源到 S3 → 缓存 → 返回
   ▼
Client 播放器
   │
   │ 4. 根据带宽自动切换画质
   │    带宽好 → 切换到 1080p
   │    带宽差 → 切换到 480p
\`\`\`

**关键组件选型：**

| 组件 | 选型 | 理由 |
|------|------|------|
| 视频存储 | S3/GCS | 无限扩展、高持久性、便宜 |
| 元数据 | PostgreSQL | ACID、复杂查询 |
| 缓存 | Redis | 热门视频元数据 |
| CDN | CloudFront/Akamai | 全球分发、低延迟 |
| 消息队列 | Kafka | 高吞吐、持久化 |
| 搜索 | Elasticsearch | 全文搜索、相关性排序 |
| 转码 | FFmpeg on K8s | 水平扩展、按需启动 |
      `,

      deep_dives: [
        {
          topic: "大文件分片上传（必考）",
          details: `
**问题**：256GB 文件怎么上传？

**方案：Multipart Upload**

\`\`\`python
# 1. 初始化分片上传
upload_id = s3.create_multipart_upload(bucket, key)

# 2. 客户端切分文件（每片 100MB）
for i, chunk in enumerate(file.chunks(100MB)):
    # 获取该分片的预签名 URL
    url = s3.generate_presigned_url(
        'upload_part',
        upload_id=upload_id,
        part_number=i+1
    )
    # 客户端直传
    response = requests.put(url, data=chunk)
    etags.append(response.headers['ETag'])

# 3. 完成上传
s3.complete_multipart_upload(upload_id, parts=etags)
\`\`\`

**断点续传实现**：
• 服务端记录已完成的分片号
• 客户端重连后，查询已完成分片
• 只上传缺失的分片

**面试要点**：
• 分片大小权衡：太小→请求太多，太大→失败代价高
• 并行上传多个分片提高速度
• 上传超时和重试策略
          `
        },
        {
          topic: "自适应码率流（ABR）",
          details: `
**问题**：用户网络波动怎么办？

**方案：HLS/DASH 协议**

\`\`\`
# manifest.m3u8 示例
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p/playlist.m3u8
\`\`\`

**播放器行为**：
1. 下载 manifest，获取所有分辨率的 playlist
2. 测量下载速度
3. 选择 < 当前带宽 80% 的最高画质
4. 持续监控，动态切换

**转码流水线**：
\`\`\`
原视频 (4K)
   │
   ├── FFmpeg 转码 → 1080p → 切片 (2秒/片)
   ├── FFmpeg 转码 → 720p  → 切片
   ├── FFmpeg 转码 → 480p  → 切片
   └── FFmpeg 转码 → 360p  → 切片
   
每个分辨率独立存储，独立 CDN 缓存
\`\`\`

**面试要点**：
• 为什么用 HLS 而不是直接传原视频？
  → 支持 seek、适应网络、减少首帧延迟
• 分片时长选择：2-10秒，太长→切换慢，太短→请求多
          `
        },
        {
          topic: "CDN 缓存策略",
          details: `
**问题**：100Tbps 带宽从哪来？

**方案：多层 CDN + 智能缓存**

\`\`\`
Client
   │
   ▼
Edge PoP (边缘节点) ← 95% 请求命中
   │ 遍布全球 100+ 节点
   │ 缓存热门视频分片
   ▼
Regional PoP (区域节点) ← 剩余 4% 请求
   │ 每个大区 1-2 个
   │ 缓存中等热度视频
   ▼
Origin Shield (源站盾) ← 最后 1%
   │ 保护源站不被击穿
   ▼
S3 Origin (源站)
\`\`\`

**缓存策略**：
• 热门视频：前 1000 部，永久缓存
• 中等热度：LRU 淘汰，7 天 TTL
• 冷门视频：按需回源，1 天 TTL

**缓存 Key 设计**：
\`\`\`
/videos/{video_id}/{quality}/{chunk_index}.ts

# 示例
/videos/abc123/1080p/00001.ts
/videos/abc123/720p/00001.ts
\`\`\`

**面试要点**：
• 缓存命中率目标：> 95%
• Cache-Control 头设置
• 视频更新时如何失效缓存（版本号）
          `
        },
        {
          topic: "数据库设计",
          details: `
**元数据表设计**：

\`\`\`sql
-- 视频表
CREATE TABLE videos (
  id BIGINT PRIMARY KEY,  -- 雪花 ID
  user_id BIGINT NOT NULL,
  title VARCHAR(500),
  description TEXT,
  status ENUM('uploading','processing','ready','failed'),
  duration_seconds INT,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  FULLTEXT idx_search (title, description)  -- MySQL 全文索引
);

-- 视频分片表（记录转码后的分片信息）
CREATE TABLE video_chunks (
  video_id BIGINT,
  quality ENUM('1080p','720p','480p','360p'),
  chunk_index INT,
  s3_key VARCHAR(500),
  duration_ms INT,
  PRIMARY KEY (video_id, quality, chunk_index)
);
\`\`\`

**分库分表策略**：
• 按 video_id 哈希分片
• 每个分片约 1000 万视频
• 64 个分片支撑 6.4 亿视频

**读写分离**：
• 1 主库写入
• N 个从库读取
• 元数据缓存在 Redis（TTL 5分钟）
          `
        }
      ],

      // 面试技巧
      interviewTips: [
        "先问清楚规模：DAU、日上传量、平均视频大小",
        "从上传和播放两条主线讲，不要跳来跳去",
        "主动提到分片上传和自适应码率，这是 YouTube 的核心",
        "CDN 是必提的，要说清楚多层缓存架构",
        "数据库选型要说理由：为什么 S3 存视频、为什么 MySQL 存元数据"
      ],

      // 常见错误
      commonMistakes: [
        "❌ 视频直接存数据库 → 应该用 Object Storage",
        "❌ 同步转码 → 应该用消息队列异步处理",
        "❌ 忽略 CDN → 没有 CDN 根本撑不住流量",
        "❌ 单一分辨率 → 必须支持自适应码率",
        "❌ 忽略断点续传 → 大文件上传必须支持"
      ]
    },

    {
      id: "uber",
      title: "Design Uber",
      category: "Product Design",
      difficulty: "Hard",
      
      requirements: {
        functional: [
          "乘客请求打车：指定上车点和目的地",
          "匹配附近司机：找到最近的可用司机",
          "实时位置追踪：乘客能看到司机位置",
          "行程管理：司机接单、开始行程、结束行程",
          "费用计算：根据距离、时间、动态定价",
          "支付处理：行程结束自动扣款"
        ],
        non_functional: [
          "低延迟匹配：< 1秒内返回匹配结果",
          "高可用：打车是刚需，不能挂",
          "实时性：位置更新延迟 < 5秒",
          "规模：百万级在线司机，千万级用户",
          "一致性：行程状态必须强一致（不能重复派单）"
        ]
      },

      estimation: `
**规模估算：**
• 在线司机：100 万
• DAU：1000 万乘客
• 日订单：1000 万单
• QPS：1000万 / 86400 ≈ 115 QPS（订单）
• 位置更新：100万司机 × 每5秒1次 = 20万 QPS

**存储估算：**
• 每个位置更新：50 bytes (司机ID + 经纬度 + 时间戳)
• 每天位置数据：20万 × 86400 × 50 bytes ≈ 860GB/天
• 通常只保留最新位置，历史可归档
      `,

      api_design: [
        "POST /v1/rides - 乘客请求打车",
        "GET /v1/rides/{id} - 获取行程详情",
        "PUT /v1/rides/{id}/accept - 司机接单",
        "PUT /v1/rides/{id}/start - 开始行程",
        "PUT /v1/rides/{id}/complete - 结束行程",
        "PUT /v1/drivers/{id}/location - 更新司机位置",
        "GET /v1/drivers/nearby?lat={lat}&lng={lng}&radius={r} - 查询附近司机",
        "WebSocket /ws/rides/{id} - 实时位置推送"
      ],

      high_level_design: `
**打车匹配流程（核心！）：**

\`\`\`
乘客 App
   │
   │ 1. POST /rides {pickup: {lat, lng}, dest: {lat, lng}}
   ▼
API Gateway
   │
   ▼
Ride Service
   │
   │ 2. 创建 Ride 记录，状态 = MATCHING
   │
   │ 3. 调用 Matching Service
   ▼
Matching Service ──────────────────────────────────────────────
   │
   │ 4. 查询附近司机
   │    如何快速找到附近司机？
   │
   ▼
Location Service (Redis + Geohash) ─────────────────────────────
   │
   │ GEORADIUS drivers:online {lat} {lng} 5 km
   │ 返回 5km 内所有在线司机
   │
   │ 5. 过滤：
   │    • 已有订单的司机？排除
   │    • 评分太低？排除
   │    • 车型不匹配？排除
   │
   │ 6. 排序：
   │    • 按 ETA（预计到达时间）排序
   │    • 不是按直线距离！要考虑路况
   │
   │ 7. 发送通知给 Top 3 司机
   ▼
Notification Service
   │
   │ 8. Push 通知到司机 App
   ▼
司机 App
   │
   │ 9. 司机看到订单，点击接单
   │    PUT /rides/{id}/accept
   ▼
Ride Service
   │
   │ 10. 检查：这单还在吗？（分布式锁）
   │     • 其他司机可能先抢到
   │     • 乘客可能取消了
   │
   │ 11. 更新 Ride 状态 = ACCEPTED
   │
   │ 12. 通知乘客：司机已接单
   ▼
WebSocket Gateway
   │
   ▼
乘客 App 显示：司机正在赶来，预计 5 分钟
\`\`\`

**实时位置追踪：**

\`\`\`
司机 App (每 5 秒)
   │
   │ PUT /drivers/{id}/location
   │ {lat: 31.2, lng: 121.5, timestamp: ...}
   ▼
API Gateway
   │
   ▼
Location Service
   │
   │ 1. 更新 Redis Geo 索引
   │    GEOADD drivers:online {lng} {lat} {driver_id}
   │
   │ 2. 如果司机在行程中，推送给乘客
   ▼
WebSocket Gateway
   │
   │ 找到乘客的 WebSocket 连接
   │ 推送司机新位置
   ▼
乘客 App 更新地图上的司机位置
\`\`\`

**关键组件：**

| 组件 | 选型 | 理由 |
|------|------|------|
| 位置存储 | Redis Geo | 原生支持地理查询，毫秒级响应 |
| 行程数据 | PostgreSQL | 强一致性，ACID 事务 |
| 实时推送 | WebSocket | 双向实时通信 |
| 通知 | FCM/APNs | 推送到 App |
| 匹配锁 | Redis | 分布式锁防止重复派单 |
| 消息队列 | Kafka | 位置更新高吞吐 |
      `,

      deep_dives: [
        {
          topic: "地理位置索引（必考）",
          details: `
**问题**：如何快速找到 5km 内的司机？

**方案 1：Geohash + Redis**

\`\`\`python
# Geohash 原理：把地球表面划分成网格，每个格子一个编码
# 编码前缀相同 = 地理位置接近

# 北京天安门: wtw3sjq
# 北京故宫:   wtw3sjz  (只差最后一位，很近！)

# Redis 实现
import redis
r = redis.Redis()

# 添加司机位置
r.geoadd("drivers:online", 116.397, 39.908, "driver_001")
r.geoadd("drivers:online", 116.398, 39.909, "driver_002")

# 查询 5km 内的司机
nearby = r.georadius(
    "drivers:online",
    longitude=116.397,
    latitude=39.908,
    radius=5,
    unit="km",
    withdist=True,    # 返回距离
    sort="ASC",       # 按距离排序
    count=10          # 最多返回 10 个
)
# 返回: [("driver_001", 0.0), ("driver_002", 0.15)]
\`\`\`

**方案 2：QuadTree（如果不用 Redis）**

\`\`\`
把地图递归划分成 4 个象限：
         ┌───────┬───────┐
         │ NW    │ NE    │
         │       │   🚗  │
         ├───────┼───────┤
         │ SW    │ SE    │
         │  🚗   │       │
         └───────┴───────┘

查询时只需遍历相关象限
\`\`\`

**面试要点**：
• Geohash 边界问题：相邻格子编码可能完全不同
  → 解决：查询时也查相邻 8 个格子
• 司机离线后要从索引删除
• 索引更新频率和位置更新频率要平衡
          `
        },
        {
          topic: "司机匹配算法",
          details: `
**问题**：找到附近司机后，怎么选？

**不是选最近的！要考虑：**
1. ETA（预计到达时间）- 考虑路况
2. 司机评分
3. 接单率
4. 车型匹配
5. 公平性（不能总派给同一个司机）

**匹配算法：**

\`\`\`python
def match_driver(ride, nearby_drivers):
    candidates = []
    
    for driver in nearby_drivers:
        # 1. 基础过滤
        if driver.current_ride is not None:
            continue  # 已有订单
        if driver.rating < 4.0:
            continue  # 评分太低
        if ride.car_type != driver.car_type:
            continue  # 车型不匹配
        
        # 2. 计算 ETA（调用地图 API）
        eta = maps_api.get_eta(driver.location, ride.pickup)
        
        # 3. 计算匹配分数
        score = calculate_score(
            eta=eta,
            rating=driver.rating,
            acceptance_rate=driver.acceptance_rate,
            recent_rides=driver.recent_rides
        )
        candidates.append((driver, score, eta))
    
    # 4. 按分数排序，取 Top 3
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[:3]

def calculate_score(eta, rating, acceptance_rate, recent_rides):
    # 权重可以调整
    score = 0
    score += (1 - eta / 30) * 40      # ETA 越短分越高（30分钟为上限）
    score += (rating / 5) * 30        # 评分权重 30%
    score += acceptance_rate * 20     # 接单率权重 20%
    score += (1 - recent_rides / 10) * 10  # 公平性：最近接单少的加分
    return score
\`\`\`

**为什么发给多个司机？**
• 第一个司机可能不接
• 设置超时（如 15 秒）
• 超时后发给下一个
• 有司机接单后立即取消其他请求
          `
        },
        {
          topic: "高并发派单（分布式锁）",
          details: `
**问题**：多个司机同时点"接单"怎么办？

**方案：Redis 分布式锁**

\`\`\`python
def accept_ride(driver_id, ride_id):
    lock_key = f"ride_lock:{ride_id}"
    
    # 1. 尝试获取锁（SET NX EX）
    acquired = redis.set(
        lock_key,
        driver_id,
        nx=True,  # 只在 key 不存在时设置
        ex=30     # 30秒过期，防止死锁
    )
    
    if not acquired:
        return {"error": "订单已被其他司机接走"}
    
    try:
        # 2. 检查订单状态
        ride = db.get_ride(ride_id)
        if ride.status != "MATCHING":
            return {"error": "订单状态已变更"}
        
        # 3. 更新订单
        ride.status = "ACCEPTED"
        ride.driver_id = driver_id
        db.save(ride)
        
        # 4. 取消发给其他司机的请求
        cancel_other_driver_requests(ride_id, except_driver=driver_id)
        
        # 5. 通知乘客
        notify_rider(ride.rider_id, f"司机 {driver_id} 已接单")
        
        return {"success": True}
        
    finally:
        # 6. 释放锁（只有自己能释放）
        if redis.get(lock_key) == driver_id:
            redis.delete(lock_key)
\`\`\`

**为什么需要锁？**
• 两个司机几乎同时点接单
• 没有锁 → 两个都成功 → 一单两司机
• 有锁 → 只有第一个成功
          `
        },
        {
          topic: "动态定价（Surge Pricing）",
          details: `
**问题**：供需不平衡时怎么办？

**下雨天/高峰期：需求 >> 供给**
• 乘客等太久 → 体验差
• 司机收入不变 → 没动力出车

**解决：动态加价**

\`\`\`python
def calculate_surge_multiplier(area_id):
    # 1. 获取该区域的供需数据
    demand = get_ride_requests_count(area_id, last_10_min)
    supply = get_available_drivers_count(area_id)
    
    # 2. 计算供需比
    if supply == 0:
        ratio = float('inf')
    else:
        ratio = demand / supply
    
    # 3. 映射到加价倍数
    if ratio < 1.0:
        return 1.0    # 供大于求，不加价
    elif ratio < 1.5:
        return 1.2    # 轻微供不应求
    elif ratio < 2.0:
        return 1.5
    elif ratio < 3.0:
        return 2.0
    else:
        return 2.5    # 最高 2.5 倍
    
def calculate_fare(ride, surge):
    base_fare = 10  # 起步价
    per_km = 2      # 每公里
    per_min = 0.5   # 每分钟
    
    distance = get_distance(ride.pickup, ride.dest)
    duration = get_estimated_duration(ride.pickup, ride.dest)
    
    fare = base_fare + (distance * per_km) + (duration * per_min)
    return fare * surge  # 乘以加价倍数
\`\`\`

**面试要点**：
• 加价要实时计算，不能太滞后
• 要告知乘客加价原因和金额
• 上限保护（不能无限加价）
          `
        }
      ],

      interviewTips: [
        "重点讲匹配流程，这是 Uber 的核心",
        "地理位置索引是必问的，要能解释 Geohash 原理",
        "分布式锁一定要提，防止重复派单",
        "实时性通过 WebSocket 实现，不要用轮询",
        "可以主动提动态定价，展示业务理解"
      ],

      commonMistakes: [
        "❌ 用轮询实现实时位置 → 应该用 WebSocket",
        "❌ 按直线距离选司机 → 应该按 ETA",
        "❌ 忽略分布式锁 → 会导致重复派单",
        "❌ 位置更新存 MySQL → 应该用 Redis Geo",
        "❌ 每次请求都查数据库 → 位置数据应该在内存"
      ]
    },

    {
      id: "whatsapp",
      title: "Design WhatsApp",
      category: "Product Design",
      difficulty: "Hard",
      
      requirements: {
        functional: [
          "一对一聊天：发送文本、图片、视频、语音消息",
          "群聊：支持最多 1000 人的群组",
          "消息状态：发送中 → 已发送 → 已送达 → 已读",
          "离线消息：用户不在线时消息不丢失",
          "消息漫游：换手机后历史消息同步",
          "端到端加密：服务器无法读取消息内容"
        ],
        non_functional: [
          "低延迟：消息送达 < 100ms（在线用户）",
          "高可用：聊天是核心功能，不能挂",
          "消息顺序：保证消息按发送顺序显示",
          "规模：20亿用户，1000亿消息/天",
          "持久性：消息发送成功后永不丢失"
        ]
      },

      estimation: `
**规模估算：**
• 日活用户：20 亿
• 日消息量：1000 亿条
• QPS：1000亿 / 86400 ≈ 120 万 QPS
• 峰值：360 万 QPS

**存储估算：**
• 平均消息大小：100 bytes (不含媒体)
• 日消息存储：1000亿 × 100B = 10TB/天
• 30 天：300TB
• 媒体文件另算（通常存 Object Storage）

**连接数估算：**
• 在线用户：假设 10% = 2 亿
• 每用户一个 WebSocket 连接
• 需要支撑 2 亿长连接
      `,

      api_design: [
        "WebSocket /ws/chat - 主要通信通道",
        "POST /v1/messages - 发送消息（HTTP fallback）",
        "GET /v1/messages?conversation_id={id}&before={cursor} - 拉取历史消息",
        "PUT /v1/messages/{id}/status - 更新消息状态",
        "POST /v1/media/upload - 上传媒体文件",
        "POST /v1/groups - 创建群组",
        "PUT /v1/groups/{id}/members - 管理群成员"
      ],

      high_level_design: `
**消息发送流程（一对一）：**

\`\`\`
发送方 Alice
   │
   │ 1. 通过 WebSocket 发送消息
   │    {to: "bob", content: "Hello", msg_id: "uuid"}
   ▼
WebSocket Gateway (连接网关)
   │
   │ 2. 消息入队（Kafka）
   │    为什么用消息队列？
   │    • 削峰填谷
   │    • 接收方可能不在线
   │    • 保证消息不丢
   ▼
Kafka Message Queue
   │
   │ 3. 消费者处理消息
   ▼
Message Service
   │
   │ 4. 持久化消息到数据库
   │    存两份：sender_outbox, receiver_inbox
   │
   │ 5. 查询 Bob 是否在线
   ▼
Presence Service (Redis)
   │
   │ 6a. 如果 Bob 在线：
   │     找到 Bob 的 WebSocket 连接
   │     推送消息
   │
   │ 6b. 如果 Bob 不在线：
   │     消息已在数据库，等 Bob 上线拉取
   │     可选：发送 Push 通知
   ▼
接收方 Bob
   │
   │ 7. Bob 收到消息，发送 ACK
   │    {msg_id: "uuid", status: "delivered"}
   ▼
WebSocket Gateway
   │
   │ 8. 更新消息状态
   │    通知 Alice: 消息已送达
   ▼
Alice 看到 ✓✓
\`\`\`

**消息状态机：**

\`\`\`
SENDING → SENT → DELIVERED → READ
   │        │        │
   │        │        └── Bob 打开对话
   │        │
   │        └── 服务器收到
   │
   └── 发送中（本地状态）
   
显示：
SENDING:   ⌛ (转圈)
SENT:      ✓  (单勾)
DELIVERED: ✓✓ (双勾)
READ:      ✓✓ (蓝色双勾)
\`\`\`

**群聊消息流程：**

\`\`\`
Alice 发群消息
   │
   │ {group_id: "group123", content: "Hello everyone"}
   ▼
Message Service
   │
   │ 1. 存储消息一份（不是每人一份！）
   │
   │ 2. 获取群成员列表（1000 人）
   ▼
Fanout Service
   │
   │ 3. 为每个在线成员推送
   │    并行处理，不是串行
   │
   │ 4. 离线成员等上线后拉取
   ▼
群成员 App
\`\`\`

**关键组件：**

| 组件 | 选型 | 理由 |
|------|------|------|
| 连接管理 | WebSocket Gateway | 长连接，实时推送 |
| 消息队列 | Kafka | 高吞吐、持久化、有序 |
| 消息存储 | Cassandra | 高写入、水平扩展 |
| 在线状态 | Redis | 快速查询、支持 TTL |
| 媒体存储 | S3 + CDN | 大文件、全球分发 |
| 搜索 | Elasticsearch | 消息搜索（可选） |
      `,

      deep_dives: [
        {
          topic: "消息存储设计（必考）",
          details: `
**问题**：1000亿消息/天怎么存？

**方案：Cassandra + 合理的分区键**

\`\`\`sql
-- 消息表设计
CREATE TABLE messages (
  conversation_id TEXT,    -- 会话ID（分区键）
  message_id TIMEUUID,     -- 消息ID（聚簇键，自带时间戳）
  sender_id TEXT,
  content TEXT,
  media_url TEXT,
  status TEXT,
  created_at TIMESTAMP,
  PRIMARY KEY (conversation_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);  -- 最新消息在前

-- 会话ID设计
-- 一对一: 小ID_大ID (Alice_Bob, 不是 Bob_Alice)
-- 群聊: group_xxx
\`\`\`

**为什么这样设计？**

1. **分区键选 conversation_id**
   • 同一个会话的消息在同一个分区
   • 拉取历史消息只需要查一个分区
   • 不会出现热点（假设没有超级大群）

2. **聚簇键选 message_id (TIMEUUID)**
   • TIMEUUID 包含时间戳，天然有序
   • 分区内按时间排序
   • 分页查询高效

3. **为什么用 Cassandra？**
   • 写入吞吐高（100万 QPS 没问题）
   • 水平扩展（加节点就行）
   • 适合时间序列数据

**拉取历史消息：**

\`\`\`python
def get_messages(conversation_id, before_message_id, limit=20):
    # Cassandra 会利用分区键和聚簇键高效查询
    return db.execute("""
        SELECT * FROM messages
        WHERE conversation_id = ?
        AND message_id < ?
        ORDER BY message_id DESC
        LIMIT ?
    """, [conversation_id, before_message_id, limit])
\`\`\`
          `
        },
        {
          topic: "WebSocket 连接管理",
          details: `
**问题**：2 亿用户同时在线，怎么管理连接？

**架构：多层 Gateway**

\`\`\`
                    用户
                    │ │ │ │ │ │
                    ▼ ▼ ▼ ▼ ▼ ▼
              ┌─────────────────┐
              │  Load Balancer  │
              └─────────────────┘
                   │  │  │
        ┌──────────┼──┼──┼──────────┐
        ▼          ▼  ▼  ▼          ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │Gateway 1│ │Gateway 2│ │Gateway N│  (每个 Gateway 10万连接)
   └─────────┘ └─────────┘ └─────────┘
        │          │           │
        └──────────┼───────────┘
                   ▼
           ┌─────────────┐
           │ Connection  │  (记录：用户 → Gateway 映射)
           │ Registry    │  (Redis Cluster)
           └─────────────┘
\`\`\`

**连接注册：**

\`\`\`python
# 用户连接时
def on_connect(user_id, websocket):
    gateway_id = get_current_gateway_id()
    
    # 注册到 Redis
    redis.hset(f"user:{user_id}", mapping={
        "gateway": gateway_id,
        "connected_at": time.time()
    })
    redis.expire(f"user:{user_id}", 86400)  # 24小时过期
    
    # 心跳保活
    schedule_heartbeat(user_id)

# 发送消息时
def send_to_user(user_id, message):
    # 1. 查询用户在哪个 Gateway
    user_info = redis.hgetall(f"user:{user_id}")
    
    if not user_info:
        return False  # 用户不在线
    
    gateway_id = user_info["gateway"]
    
    # 2. 发送到对应 Gateway
    if gateway_id == current_gateway:
        # 本地发送
        websocket = local_connections[user_id]
        websocket.send(message)
    else:
        # 跨 Gateway，通过内部通道
        internal_bus.send(gateway_id, user_id, message)
\`\`\`

**心跳机制：**

\`\`\`
Client ──────── 每 30 秒 ping ────────> Gateway
       <───────── pong ────────────────
       
• 超过 90 秒没收到 ping → 断开连接
• 断开时清理 Redis 注册信息
• 客户端断开后自动重连（指数退避）
\`\`\`
          `
        },
        {
          topic: "离线消息投递",
          details: `
**问题**：Bob 不在线，消息怎么办？

**方案：消息队列 + 拉取**

\`\`\`
Alice 发消息给离线的 Bob
   │
   ▼
Message Service
   │
   │ 1. 消息存入数据库（Bob 的 inbox）
   │
   │ 2. 检查 Bob 在线状态 → 不在线
   │
   │ 3. 发送 Push 通知
   │    "Alice: Hello"
   ▼
APNs / FCM
   │
   │ 4. Bob 手机收到通知
   ▼
Bob 打开 App
   │
   │ 5. 建立 WebSocket 连接
   │
   │ 6. 拉取离线消息
   │    GET /messages?since={last_seen_message_id}
   ▼
Message Service
   │
   │ 7. 返回离线期间的所有消息
   │
   │ 8. 更新消息状态为 delivered
   │
   │ 9. 通知 Alice: 消息已送达
\`\`\`

**消息顺序保证：**

\`\`\`python
# 客户端维护消息序号
class MessageClient:
    def __init__(self):
        self.local_seq = 0
        self.server_seq = 0
        self.pending_messages = {}  # 待确认的消息
    
    def send(self, content):
        self.local_seq += 1
        msg = {
            "local_seq": self.local_seq,
            "content": content,
            "timestamp": time.time()
        }
        self.pending_messages[self.local_seq] = msg
        websocket.send(msg)
    
    def on_ack(self, local_seq, server_seq):
        # 服务器确认收到
        del self.pending_messages[local_seq]
        self.server_seq = server_seq
    
    def on_reconnect(self):
        # 重连后重发未确认的消息
        for msg in self.pending_messages.values():
            websocket.send(msg)
\`\`\`
          `
        },
        {
          topic: "端到端加密（加分项）",
          details: `
**问题**：如何保证服务器无法读取消息？

**方案：Signal Protocol（WhatsApp 实际使用）**

\`\`\`
简化版原理：

1. 每个用户有一对密钥
   • 公钥：可以公开
   • 私钥：只存在用户设备上

2. Alice 想发消息给 Bob
   • 获取 Bob 的公钥
   • 用 Bob 的公钥加密消息
   • 发送加密后的消息

3. Bob 收到消息
   • 用自己的私钥解密
   • 只有 Bob 能解密

4. 服务器只能看到：
   • 谁发给谁
   • 消息大小
   • 时间戳
   • 看不到内容！
\`\`\`

\`\`\`python
# 简化示例
from cryptography.hazmat.primitives.asymmetric import x25519

# 密钥交换
alice_private = x25519.X25519PrivateKey.generate()
alice_public = alice_private.public_key()

bob_private = x25519.X25519PrivateKey.generate()
bob_public = bob_private.public_key()

# Alice 计算共享密钥
shared_key_alice = alice_private.exchange(bob_public)

# Bob 计算相同的共享密钥
shared_key_bob = bob_private.exchange(alice_public)

# shared_key_alice == shared_key_bob
# 用这个密钥加密消息
\`\`\`

**面试要点**：
• 不需要完全理解加密算法
• 要知道端到端加密意味着服务器无法解密
• 密钥存在用户设备上，丢了就没了
          `
        }
      ],

      interviewTips: [
        "先画消息流转图，从发送到接收",
        "WebSocket 连接管理是重点，要讲清楚",
        "消息存储用 Cassandra，要解释为什么",
        "离线消息和消息状态是必考点",
        "群聊的 fanout 策略要提（存一份 vs 存多份）"
      ],

      commonMistakes: [
        "❌ 用 HTTP 轮询 → 应该用 WebSocket",
        "❌ 每人存一份群消息 → 消息存一份，指针存多份",
        "❌ 忽略消息顺序 → 需要序号保证顺序",
        "❌ 消息直接删除 → 应该软删除",
        "❌ 同步发送 → 应该异步队列"
      ]
    },

    {
      id: "newsfeed",
      title: "Design News Feed",
      category: "Product Design",
      difficulty: "Medium",
      
      requirements: {
        functional: [
          "发帖：用户能发布文字、图片、视频",
          "Feed 流：用户能看到关注的人的帖子",
          "互动：点赞、评论、转发",
          "关注/取关：管理关注关系",
          "实时更新：新帖子实时出现在 Feed"
        ],
        non_functional: [
          "低延迟：Feed 加载 < 200ms",
          "最终一致性：新帖子可以稍后出现（不需要强一致）",
          "高可用：社交是高频应用",
          "规模：1亿 DAU，10亿关注关系"
        ]
      },

      estimation: `
**规模：**
• DAU：1 亿
• 平均关注数：200
• 日发帖量：5000 万
• Feed 请求：1 亿 × 10 次/天 = 10 亿/天 ≈ 12K QPS

**存储：**
• 帖子：5000 万 × 1KB = 50GB/天
• Feed 缓存：1 亿用户 × 500 帖子 × 8 bytes = 400GB（Redis）
      `,

      api_design: [
        "POST /v1/posts - 发布帖子",
        "GET /v1/feed?user_id={id}&cursor={c} - 获取 Feed",
        "POST /v1/posts/{id}/like - 点赞",
        "POST /v1/posts/{id}/comments - 评论",
        "POST /v1/users/{id}/follow - 关注",
        "DELETE /v1/users/{id}/follow - 取关"
      ],

      high_level_design: `
**核心问题：Feed 怎么生成？**

两种方案：

**方案 1: Fanout on Write（推模式）**
\`\`\`
Alice 发帖
   │
   │ 1. 帖子存数据库
   │
   │ 2. 获取 Alice 的粉丝列表（1000人）
   │
   │ 3. 把帖子 ID 推到每个粉丝的 Feed 缓存
   ▼
Bob 的 Feed 缓存: [Alice的帖子, ...]
Carol 的 Feed 缓存: [Alice的帖子, ...]
...

优点：读取 Feed 超快，直接从缓存取
缺点：写入时 fanout 开销大
适用：普通用户（粉丝 < 1万）
\`\`\`

**方案 2: Fanout on Read（拉模式）**
\`\`\`
Bob 请求 Feed
   │
   │ 1. 获取 Bob 关注的人列表
   │
   │ 2. 从每个人的 timeline 拉取最新帖子
   │
   │ 3. 合并、排序、返回
   ▼
Bob 看到 Feed

优点：写入简单，无 fanout
缺点：读取慢，需要实时合并
适用：大 V（粉丝太多，推不过来）
\`\`\`

**实际方案：混合模式**
\`\`\`
普通用户（粉丝 < 1万）→ Fanout on Write
大 V（粉丝 > 1万）→ Fanout on Read

Bob 的 Feed = 缓存中的普通用户帖子 + 实时拉取大 V 帖子
\`\`\`

**详细流程：**

\`\`\`
Alice 发帖（普通用户，1000 粉丝）
   │
   ▼
Post Service
   │
   │ 1. 存储帖子到 Posts DB
   │    INSERT INTO posts (id, user_id, content, ...)
   │
   │ 2. 发消息到 Fanout Queue
   ▼
Fanout Service
   │
   │ 3. 获取 Alice 的粉丝列表
   │    SELECT follower_id FROM follows WHERE followee_id = 'alice'
   │
   │ 4. 并行写入每个粉丝的 Feed 缓存
   │    ZADD feed:bob {timestamp} {post_id}
   │    ZADD feed:carol {timestamp} {post_id}
   │    ...
   ▼
Redis Feed Cache
   │
   │ feed:bob = [post_id_1, post_id_2, ...]  (Sorted Set by timestamp)
   │
   ▼
Bob 请求 Feed
   │
   │ GET /feed?cursor=xxx
   ▼
Feed Service
   │
   │ 5. 从缓存读取 Feed
   │    ZREVRANGE feed:bob 0 19 (最新20条)
   │
   │ 6. 拉取大 V 帖子（如果关注了大 V）
   │
   │ 7. 合并排序
   │
   │ 8. 批量获取帖子详情
   │    SELECT * FROM posts WHERE id IN (...)
   ▼
返回 Feed 给 Bob
\`\`\`

**组件选型：**

| 组件 | 选型 | 理由 |
|------|------|------|
| 帖子存储 | MySQL/PostgreSQL | 关系数据，复杂查询 |
| Feed 缓存 | Redis Sorted Set | 按时间排序，快速读取 |
| 关注关系 | Graph DB 或 MySQL | 社交图谱 |
| 消息队列 | Kafka | Fanout 异步处理 |
| CDN | CloudFront | 图片视频加速 |
      `,

      deep_dives: [
        {
          topic: "Feed 缓存设计",
          details: `
**数据结构：Redis Sorted Set**

\`\`\`python
# 写入 Feed
def add_to_feed(user_id, post_id, timestamp):
    # Sorted Set: score=timestamp, member=post_id
    redis.zadd(f"feed:{user_id}", {post_id: timestamp})
    
    # 保留最近 1000 条，淘汰旧的
    redis.zremrangebyrank(f"feed:{user_id}", 0, -1001)

# 读取 Feed
def get_feed(user_id, cursor=None, limit=20):
    if cursor:
        # 分页：获取比 cursor 更旧的帖子
        posts = redis.zrevrangebyscore(
            f"feed:{user_id}",
            max=cursor,
            min="-inf",
            start=0,
            num=limit
        )
    else:
        # 第一页：最新的 20 条
        posts = redis.zrevrange(f"feed:{user_id}", 0, limit-1)
    
    # 批量获取帖子详情
    return get_posts_by_ids(posts)
\`\`\`

**为什么用 Sorted Set？**
• O(log N) 插入
• O(log N + M) 范围查询
• 天然按时间排序
• 支持高效分页
          `
        },
        {
          topic: "大 V 问题",
          details: `
**问题**：Taylor Swift 有 1 亿粉丝，发一条帖子...

**Fanout on Write 会怎样？**
• 需要写入 1 亿个 Feed 缓存
• 假设每次写入 1ms，需要 27 小时！
• 还占用巨大 Redis 内存

**解决：大 V 用 Fanout on Read**

\`\`\`python
def get_feed(user_id):
    # 1. 从缓存读取普通关注者的帖子
    cached_posts = redis.zrevrange(f"feed:{user_id}", 0, 99)
    
    # 2. 获取关注的大 V 列表
    celebrities = get_celebrity_followees(user_id)
    
    # 3. 并行拉取大 V 最新帖子
    celebrity_posts = []
    for celeb in celebrities:
        posts = get_recent_posts(celeb, limit=10)
        celebrity_posts.extend(posts)
    
    # 4. 合并排序
    all_posts = merge_and_sort(cached_posts, celebrity_posts)
    
    return all_posts[:20]

# 判断是否大 V
def is_celebrity(user_id):
    follower_count = get_follower_count(user_id)
    return follower_count > 10000
\`\`\`

**面试要点**：
• 阈值选择：1万粉丝是个合理的界限
• 大 V 帖子需要单独索引优化
• 可以预计算大 V 的最新帖子缓存
          `
        },
        {
          topic: "Feed 排序算法",
          details: `
**问题**：只按时间排序吗？

**方案：算法排序（Ranking）**

\`\`\`python
def rank_posts(user_id, posts):
    ranked = []
    
    for post in posts:
        score = calculate_score(user_id, post)
        ranked.append((post, score))
    
    # 按分数降序排序
    ranked.sort(key=lambda x: x[1], reverse=True)
    return [p for p, s in ranked]

def calculate_score(user_id, post):
    score = 0
    
    # 1. 时间衰减（越新越高）
    age_hours = (now - post.created_at).hours
    time_score = 1 / (1 + age_hours)
    score += time_score * 30
    
    # 2. 互动量
    engagement = post.likes + post.comments * 2 + post.shares * 3
    score += min(engagement / 100, 30)  # 最高30分
    
    # 3. 用户亲密度
    affinity = get_affinity(user_id, post.author_id)
    score += affinity * 20
    
    # 4. 内容类型偏好
    if user_prefers(user_id, post.content_type):
        score += 10
    
    return score

def get_affinity(user_id, author_id):
    # 最近互动过 → 高亲密度
    recent_interactions = count_interactions(user_id, author_id, days=30)
    return min(recent_interactions / 10, 1.0)
\`\`\`

**面试要点**：
• 时间顺序只是基础
• 实际产品都有算法排序
• 要平衡新鲜度和质量
          `
        }
      ],

      interviewTips: [
        "先问清楚是时间线还是算法排序",
        "Fanout on Write vs Read 是核心考点",
        "大 V 问题必须主动提",
        "Feed 缓存用 Redis Sorted Set",
        "可以讨论排序算法加分"
      ],

      commonMistakes: [
        "❌ 只用 Fanout on Write → 大 V 会出问题",
        "❌ 实时计算 Feed → 太慢",
        "❌ 忽略分页 → Feed 必须支持无限滚动",
        "❌ 用 List 存 Feed → 应该用 Sorted Set",
        "❌ 同步 Fanout → 应该异步队列"
      ]
    },

    {
      id: "ratelimiter",
      title: "Design Rate Limiter",
      category: "Infrastructure Design",
      difficulty: "Medium",
      
      requirements: {
        functional: [
          "限制请求速率：每秒/每分钟最多 N 个请求",
          "多维度限制：按 IP、用户 ID、API Key",
          "返回限流信息：剩余配额、重置时间",
          "灵活配置：不同 API 不同限制"
        ],
        non_functional: [
          "低延迟：< 10ms 额外开销",
          "高可用：限流器挂了不能影响业务",
          "准确性：不能误杀正常请求",
          "分布式：多实例共享限流状态"
        ]
      },

      api_design: [
        "// 内部接口，不对外暴露",
        "isAllowed(client_id, endpoint) → bool",
        "getRateLimitInfo(client_id) → {limit, remaining, reset}",
        "// HTTP 响应头",
        "X-RateLimit-Limit: 100",
        "X-RateLimit-Remaining: 45",
        "X-RateLimit-Reset: 1640000000"
      ],

      high_level_design: `
**整体架构：**

\`\`\`
Client Request
   │
   ▼
Load Balancer
   │
   ▼
Rate Limiter Middleware ◄──────────── Rules Config DB
   │                                  (限流规则配置)
   │ 检查是否超限
   ▼
Redis Cluster ◄───────────────────── (共享计数器)
   │
   │ 未超限 → 放行
   │ 超限 → 返回 429
   ▼
Backend Service
\`\`\`

**限流算法对比：**

| 算法 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| 固定窗口 | 每分钟最多100个 | 简单 | 窗口边界有突刺 |
| 滑动窗口 | 过去60秒最多100个 | 平滑 | 内存占用高 |
| 令牌桶 | 桶里有令牌才能请求 | 允许突发 | 实现复杂 |
| 漏桶 | 请求匀速流出 | 流量平滑 | 不允许突发 |
      `,

      deep_dives: [
        {
          topic: "令牌桶算法（最常用）",
          details: `
**原理：**
\`\`\`
桶容量: 100 个令牌
填充速率: 10 个/秒

请求来了 → 桶里有令牌吗？
  有 → 取走一个令牌，放行
  没有 → 拒绝（429）

每秒自动填充 10 个令牌（不超过容量）
\`\`\`

**实现：**

\`\`\`python
import time
import redis

class TokenBucket:
    def __init__(self, redis_client, key, capacity, refill_rate):
        self.redis = redis_client
        self.key = key
        self.capacity = capacity  # 桶容量
        self.refill_rate = refill_rate  # 每秒填充数
    
    def is_allowed(self):
        now = time.time()
        
        # Lua 脚本保证原子性
        lua_script = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        
        -- 获取当前状态
        local data = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(data[1]) or capacity
        local last_refill = tonumber(data[2]) or now
        
        -- 计算应该填充的令牌数
        local elapsed = now - last_refill
        local refill = elapsed * refill_rate
        tokens = math.min(capacity, tokens + refill)
        
        -- 尝试获取令牌
        local allowed = 0
        if tokens >= 1 then
            tokens = tokens - 1
            allowed = 1
        end
        
        -- 更新状态
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, 3600)  -- 1小时过期
        
        return {allowed, tokens}
        """
        
        result = self.redis.eval(lua_script, 1, self.key, 
                                  self.capacity, self.refill_rate, now)
        return result[0] == 1, result[1]

# 使用
bucket = TokenBucket(redis, "rate:user:123", capacity=100, refill_rate=10)
allowed, remaining = bucket.is_allowed()
\`\`\`

**为什么用 Lua 脚本？**
• 多个 Redis 操作需要原子执行
• 避免竞态条件
• 一次网络往返
          `
        },
        {
          topic: "滑动窗口算法",
          details: `
**原理：**
\`\`\`
限制：60秒内最多100个请求

记录每个请求的时间戳
查询时：统计过去60秒内的请求数
\`\`\`

**实现：**

\`\`\`python
def is_allowed_sliding_window(user_id, limit=100, window_seconds=60):
    now = time.time()
    window_start = now - window_seconds
    key = f"rate:{user_id}"
    
    # Lua 脚本
    lua_script = """
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window_start = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])
    
    -- 删除窗口外的旧记录
    redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
    
    -- 统计当前窗口内的请求数
    local count = redis.call('ZCARD', key)
    
    if count < limit then
        -- 添加当前请求
        redis.call('ZADD', key, now, now .. ':' .. math.random())
        redis.call('EXPIRE', key, window_seconds * 2)
        return {1, limit - count - 1}  -- allowed, remaining
    else
        return {0, 0}  -- denied
    end
    """
    
    result = redis.eval(lua_script, 1, key, now, window_start, limit)
    return result[0] == 1

# 使用 Sorted Set 存储请求时间戳
# Score = 时间戳
# Member = 时间戳:随机数（保证唯一）
\`\`\`

**优点**：精确，无边界问题
**缺点**：内存占用（每个请求一条记录）
          `
        },
        {
          topic: "分布式限流",
          details: `
**问题**：多个服务器实例如何共享限流状态？

**方案 1：集中式（Redis）**
\`\`\`
所有实例共享一个 Redis
优点：状态一致
缺点：Redis 成为瓶颈，有延迟
\`\`\`

**方案 2：本地 + 同步**
\`\`\`
每个实例本地限流 + 定期同步
例：限制 100 QPS，10 个实例
每个实例本地限制 10 QPS
优点：快
缺点：不精确
\`\`\`

**方案 3：令牌桶服务**
\`\`\`
       ┌─────────────────┐
       │ Token Bucket    │
       │ Service         │
       └─────────────────┘
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
Instance1  Instance2  Instance3
    │         │         │
    └─────────┼─────────┘
              │
批量获取令牌（减少请求次数）
\`\`\`

**Redis 集群处理：**
\`\`\`python
# 使用 Redis Cluster
# 按用户 ID 哈希到不同节点
def get_redis_node(user_id):
    slot = crc16(user_id) % 16384
    return redis_cluster.get_node_by_slot(slot)
\`\`\`
          `
        },
        {
          topic: "限流配置管理",
          details: `
**配置示例：**

\`\`\`yaml
# rate_limits.yaml
default:
  requests_per_second: 10
  requests_per_minute: 100

endpoints:
  /api/v1/search:
    requests_per_second: 5  # 搜索更严格
  /api/v1/upload:
    requests_per_minute: 10  # 上传更严格

user_tiers:
  free:
    requests_per_day: 1000
  premium:
    requests_per_day: 100000
  enterprise:
    requests_per_day: unlimited

# IP 黑白名单
whitelist:
  - 10.0.0.0/8  # 内网不限流
blacklist:
  - 1.2.3.4     # 恶意 IP
\`\`\`

**配置热更新：**
\`\`\`python
# 定期从配置中心拉取
def reload_config():
    new_config = config_center.get("rate_limits")
    global RATE_LIMITS
    RATE_LIMITS = new_config

# 或者使用 Watch 机制
config_center.watch("rate_limits", on_change=reload_config)
\`\`\`
          `
        }
      ],

      interviewTips: [
        "先讲清楚要解决什么问题（防止滥用、保护后端）",
        "令牌桶是最常用的算法，要会实现",
        "Redis Lua 脚本保证原子性是关键",
        "分布式限流的挑战要主动提",
        "讨论限流失败时的降级策略（fail-open vs fail-closed）"
      ],

      commonMistakes: [
        "❌ 本地限流不考虑分布式 → 需要共享状态",
        "❌ 非原子操作 → 会有竞态条件",
        "❌ 固定窗口不考虑边界 → 有突刺问题",
        "❌ 限流器挂了就拒绝所有请求 → 应该有降级策略",
        "❌ 不返回限流信息 → 客户端需要知道剩余配额"
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = casesData;
}
