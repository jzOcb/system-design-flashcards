// Deep Dive 技术文档数据
// 来源：Hello Interview 的 Deep Dive 系列视频

const DeepDiveData = [
  {
    id: 'redis',
    title: 'Redis 深入解析',
    subtitle: '内存数据结构存储，缓存之王',
    icon: '🔴',
    sections: [
      {
        title: '核心特性',
        content: `**单线程模型**
Redis 6.0 前是纯单线程，通过 I/O 多路复用处理高并发。
优点：无锁、简单、原子操作天然保证
缺点：CPU 利用率低，一个慢命令阻塞全部

**数据结构**
- String: 最基础，可存数字（INCR 原子操作）
- List: 双向链表，LPUSH/RPOP 实现队列
- Set: 无序集合，交集并集差集
- Sorted Set (ZSet): 排行榜神器，O(logN) 插入
- Hash: 对象存储，单独更新字段
- Stream: 消息队列（5.0+）`
      },
      {
        title: '持久化策略',
        content: `**RDB (快照)**
定时全量快照，fork 子进程不阻塞主线程
优点：恢复快、文件紧凑
缺点：可能丢失最后一次快照后的数据

**AOF (追加日志)**
记录每个写命令，类似 MySQL binlog
策略：always（每条）/ everysec（每秒）/ no（系统决定）
优点：数据安全
缺点：文件大、恢复慢

**混合持久化** (4.0+)
RDB + 增量 AOF，兼顾恢复速度和数据安全`
      },
      {
        title: '集群方案',
        content: `**主从复制**
一主多从，读写分离，从库只读
异步复制，有延迟风险

**Sentinel (哨兵)**
监控主从，自动故障转移
至少 3 个 Sentinel 节点

**Redis Cluster**
分片集群，16384 个槽位
自动分片、故障转移
不支持跨槽事务和复杂多键操作`
      },
      {
        title: '面试必知',
        content: `**常见用途**
- 缓存（最常见）
- 会话存储
- 排行榜（ZSet）
- 分布式锁（SET NX EX）
- 限流（Token Bucket）
- 消息队列（Stream/List）

**注意事项**
- 大 key 问题：value 过大导致阻塞
- 热 key 问题：单 key QPS 过高
- 内存淘汰：LRU/LFU/TTL
- 主从延迟：读己之写问题`
      }
    ]
  },
  {
    id: 'kafka',
    title: 'Kafka 深入解析',
    subtitle: '分布式消息队列与流处理平台',
    icon: '📨',
    sections: [
      {
        title: '核心概念',
        content: `**基本组件**
- Broker: Kafka 服务器节点
- Topic: 消息主题（逻辑分类）
- Partition: 分区（物理分片，并行单位）
- Offset: 消息在分区内的位置
- Producer: 消息生产者
- Consumer Group: 消费者组（负载均衡）

**消息保证**
- At most once: 可能丢，不重复
- At least once: 不丢，可能重复（默认）
- Exactly once: 不丢不重（0.11+ 事务支持）`
      },
      {
        title: '高吞吐原理',
        content: `**顺序写磁盘**
追加写入，无随机 I/O，磁盘吞吐可达 600MB/s

**零拷贝 (Zero Copy)**
sendfile 系统调用，数据直接从 Page Cache 到网卡
避免内核态到用户态的多次拷贝

**批量处理**
Producer 批量发送，Consumer 批量拉取
减少网络往返和系统调用

**分区并行**
多 Partition 并行写入和消费
Consumer 数量 ≤ Partition 数量`
      },
      {
        title: '可靠性保证',
        content: `**副本机制**
每个 Partition 有多个副本（Leader + Followers）
只有 Leader 处理读写，Follower 同步

**ISR (In-Sync Replicas)**
与 Leader 保持同步的副本集合
acks=all 时，ISR 全部确认才返回成功

**数据保留**
按时间（默认 7 天）或大小保留
可配置压缩（只保留每个 key 最新值）`
      },
      {
        title: '面试必知',
        content: `**vs RabbitMQ**
- Kafka: 高吞吐、可重放、适合大数据/日志
- RabbitMQ: 低延迟、复杂路由、传统消息队列

**常见问题**
- 消息顺序：只在单 Partition 内保证
- 消费积压：增加 Consumer（≤ Partition 数）
- 重复消费：幂等处理或事务
- Rebalance: Consumer 加入/退出时触发`
      }
    ]
  },
  {
    id: 'cassandra',
    title: 'Cassandra 深入解析',
    subtitle: '分布式 NoSQL 宽列数据库',
    icon: '👁️',
    sections: [
      {
        title: '核心特性',
        content: `**无主架构 (Masterless)**
所有节点对等，没有单点故障
任意节点可接受读写

**数据模型**
- Keyspace: 类似数据库
- Table: 宽列表
- Partition Key: 决定数据分布的节点
- Clustering Key: 分区内的排序顺序

**写入路径**
请求 → Commit Log（持久化）
→ Memtable（内存）
→ SSTable（刷盘）`
      },
      {
        title: '一致性级别',
        content: `**可配置一致性**
- ONE: 一个副本响应即可（最快）
- QUORUM: 多数副本响应（平衡）
- ALL: 所有副本响应（最慢，强一致）

**读写组合**
W + R > N 时保证强一致性
（W=写副本数，R=读副本数，N=总副本数）

示例：3 副本，W=2, R=2
写入 2 个，读取 2 个，至少重叠 1 个`
      },
      {
        title: '适用场景',
        content: `**适合**
- 写密集型（日志、时序数据）
- 地理分布（多数据中心）
- 高可用要求（无单点）
- 简单查询模式（按 key 查询）

**不适合**
- 复杂查询（JOIN、聚合）
- 频繁更新（墓碑问题）
- 小数据量（杀鸡用牛刀）
- 需要强一致性的场景`
      },
      {
        title: '面试必知',
        content: `**数据建模原则**
- 按查询设计表（反范式）
- 一个查询一张表
- 避免全表扫描

**常见问题**
- 热点分区：分区键分布不均
- 墓碑 (Tombstone)：删除标记累积
- 读放大：多 SSTable 合并读取

**vs HBase**
- Cassandra: 无主、最终一致、运维简单
- HBase: 依赖 HDFS/ZK、强一致、更复杂`
      }
    ]
  },
  {
    id: 'elasticsearch',
    title: 'Elasticsearch 深入解析',
    subtitle: '分布式搜索和分析引擎',
    icon: '🔍',
    sections: [
      {
        title: '核心概念',
        content: `**基本结构**
- Index: 索引（类似数据库）
- Type: 类型（7.x 已废弃）
- Document: 文档（JSON 格式）
- Shard: 分片（Lucene 实例）
- Replica: 副本（高可用 + 读扩展）

**倒排索引**
传统索引：文档 → 词
倒排索引：词 → [文档列表]
支持高效全文搜索`
      },
      {
        title: '搜索原理',
        content: `**分词 (Analysis)**
文本 → Tokenizer（分词）→ Token Filter（处理）
中文需要特殊分词器（IK、结巴）

**相关性评分**
TF-IDF / BM25 算法
词频 × 逆文档频率 = 相关性分数

**查询类型**
- Match: 全文搜索，会分词
- Term: 精确匹配，不分词
- Bool: 组合查询（must/should/must_not）
- Range: 范围查询`
      },
      {
        title: '写入与近实时',
        content: `**写入流程**
写请求 → 主分片 → Translog（持久化）
→ 内存 Buffer → Refresh（1s）→ 可搜索

**近实时 (Near Real-Time)**
写入后默认 1 秒可搜索（refresh_interval）
不是真正实时！

**Flush**
Translog 写入磁盘，清空内存
触发条件：Translog 大小或时间`
      },
      {
        title: '面试必知',
        content: `**常见用途**
- 全文搜索（核心功能）
- 日志分析（ELK Stack）
- 指标聚合（Kibana 可视化）
- 地理位置搜索

**性能优化**
- 合理分片数（每分片 20-50GB）
- 批量写入（bulk API）
- 避免深分页（用 scroll 或 search_after）

**注意事项**
- 不是数据库，不保证事务
- 写入有延迟（近实时）
- 更新 = 删除 + 新增（append-only）`
      }
    ]
  },
  {
    id: 'dynamodb',
    title: 'DynamoDB 深入解析',
    subtitle: 'AWS 托管 NoSQL 数据库',
    icon: '⚡',
    sections: [
      {
        title: '核心概念',
        content: `**数据模型**
- Table: 表
- Item: 项目（类似行）
- Attribute: 属性（类似列）

**主键设计**
- Partition Key (PK): 哈希分布
- Sort Key (SK): 分区内排序（可选）

示例：用户订单表
PK = user_id, SK = order_date
查询某用户所有订单：Query(PK=user_id)`
      },
      {
        title: '容量模式',
        content: `**预置容量**
- RCU: 读容量单位（4KB/次，强一致×2）
- WCU: 写容量单位（1KB/次）
需要预估，超出会被限流

**按需模式**
自动扩展，按请求付费
适合不可预测的流量

**自动扩展**
预置 + 自动调整
设置目标利用率（如 70%）`
      },
      {
        title: '索引类型',
        content: `**Local Secondary Index (LSI)**
- 同分区，不同排序键
- 创建表时指定，不可后加
- 共享 RCU/WCU

**Global Secondary Index (GSI)**
- 不同分区键
- 可随时添加
- 独立 RCU/WCU
- 最终一致性

实际：GSI 更常用，更灵活`
      },
      {
        title: '面试必知',
        content: `**设计原则**
- 按访问模式设计（单表设计）
- 避免热分区（分区键均匀分布）
- GSI 支持其他查询模式

**常见问题**
- 只支持 Key 查询，无 JOIN
- 扫描全表很贵（Scan 操作）
- 项目大小限制 400KB

**vs Cassandra**
- DynamoDB: 全托管、按需付费、AWS 生态
- Cassandra: 自管理、更灵活、多云`
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DeepDiveData };
}
