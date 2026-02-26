// English Flashcards with Full Abbreviation Explanations
// System Design Interview Prep - All acronyms explained

const FlashcardDataEN = [
  // === Trade-off Questions ===
  {
    id: 1,
    category: "Trade-offs",
    question: "When to use SQL vs NoSQL?",
    answer: `SQL (Structured Query Language):
- Use when: ACID compliance needed, complex JOINs, strong consistency (banking, orders)
- ACID = Atomicity, Consistency, Isolation, Durability

NoSQL (Not Only SQL):
- Use when: Horizontal scaling, flexible schema, eventual consistency OK (social, logs)
- Types: Document (MongoDB), Key-Value (Redis), Wide-column (Cassandra), Graph (Neo4j)

Interview key: Explain YOUR scenario's requirements, not memorized definitions`,
    followUp: "Follow-up: What database does your company use and why?"
  },
  {
    id: 2,
    category: "Trade-offs",
    question: "News Feed: Push vs Pull model?",
    answer: `Push (Fan-out on Write):
- On post → write to ALL followers' feeds
- Fast reads, slow writes
- Good for: Regular users with <1000 followers

Pull (Fan-out on Read):
- On read → fetch from all followed users
- Fast writes, slow reads
- Good for: Celebrities with millions of followers

Real solution: HYBRID! Push for regular users, Pull for celebrities`,
    followUp: "Twitter/Instagram both use hybrid approaches"
  },
  {
    id: 3,
    category: "Trade-offs",
    question: "Consistency vs Availability: Which do you choose?",
    answer: `This is the core of CAP Theorem:
CAP = Consistency, Availability, Partition tolerance

During network partition, you MUST choose:

CP (Consistency + Partition tolerance):
- Banking, inventory → Better to error than have wrong data
- Example: HBase, MongoDB

AP (Availability + Partition tolerance):
- Social likes, comments → Better to be slightly stale than unavailable
- Example: Cassandra, DynamoDB

Interview key: Choose based on BUSINESS requirements, not tech preference`,
    followUp: "Follow-up: How do you handle eventual consistency? Answer: Message queues + compensation"
  },
  {
    id: 4,
    category: "Trade-offs",
    question: "Sync calls vs Async message queue?",
    answer: `Synchronous (Sync):
- User waits for response
- Use for: Login validation, payment confirmation
- HTTP/REST, gRPC

Asynchronous (Async):
- Background processing, delayed response OK
- Use for: Email sending, report generation, video transcoding
- Message Queues: Kafka, RabbitMQ, SQS

Decision criteria: Does user need immediate result?`,
    followUp: "Async challenge: How to guarantee no message loss? Answer: ACK mechanism + Dead Letter Queue (DLQ)"
  },

  // === Back-of-Envelope Estimation ===
  {
    id: 5,
    category: "Estimation",
    question: "What's Twitter's QPS? How to calculate?",
    answer: `QPS = Queries Per Second

Calculation:
DAU (Daily Active Users): 500M
Requests per user per day: ~10 (feed refresh + tweets)
QPS = 500M × 10 / 86,400 ≈ 58,000

Peak QPS = Average × 3-5 ≈ 200,000 QPS

Key numbers to memorize:
- 1 day = 86,400 seconds ≈ 10^5
- 1 year ≈ 3×10^7 seconds`,
    followUp: "Write QPS is much lower than read (100:1 ratio). Estimate separately."
  },
  {
    id: 6,
    category: "Estimation",
    question: "How much storage for 1 billion user profiles?",
    answer: `Assumptions first:
- Each profile: ~1KB (name, avatar URL, bio, etc.)

Calculation:
1B users × 1KB = 1TB

With indexes, backups, growth buffer: 3-5TB

Interview tip: State assumptions FIRST, then calculate`,
    followUp: "What about profile images? That's Object Storage (S3/Blob), calculated separately"
  },
  {
    id: 7,
    category: "Estimation",
    question: "How many QPS can one server handle?",
    answer: `Rough benchmarks:

Simple CRUD operations: 10,000-50,000 QPS
Complex business logic: 1,000-5,000 QPS
Database writes: 1,000-10,000 QPS (depends on indexes)

So for 200K QPS (Twitter scale):
Need 20-200 application servers

Reference points:
- Redis single node: 100K+ QPS
- MySQL single node: 5-10K QPS`,
    followUp: "Redis 6.0 now supports multi-threading"
  },

  // === Scenario-Based Questions ===
  {
    id: 8,
    category: "Scenarios",
    question: "User reports 'site is slow'. How do you debug?",
    answer: `Debug layer by layer, from closest to user:

1. Frontend: Chrome DevTools → Network waterfall
2. CDN (Content Delivery Network): Check cache hit rate
3. Load Balancer (LB): Check server distribution
4. Application: APM (Application Performance Monitoring) → slow requests
5. Database: Slow query logs
6. Cache: Cache miss rate

Start from where user is closest`,
    followUp: "If only specific users are slow: Check geography, network, account data volume"
  },
  {
    id: 9,
    category: "Scenarios",
    question: "Flash sale system: How to prevent overselling?",
    answer: `Core: Redis atomic stock decrement

Pseudocode:
if (DECR stock >= 0) {
  Create order (async)
} else {
  INCR stock  // rollback
  return "Sold out"
}

Supporting systems:
- Rate limiting (Token Bucket algorithm)
- CAPTCHA to prevent bots
- Message queue for peak shaving`,
    followUp: "Why not use database? Answer: Too slow, can't handle the QPS"
  },
  {
    id: 10,
    category: "Scenarios",
    question: "User can't see their just-posted content due to replication lag. Fix?",
    answer: `Three solutions:

1. Read from primary after write
   - Simple but increases primary load

2. Client-side cache (Optimistic Update)
   - Cache just-written data locally
   - Best UX

3. Version-based routing
   - Read request includes version
   - If replica version < needed, route to primary

Most common: Option 2 (best user experience)`,
    followUp: "This is called 'Read Your Own Writes' consistency"
  },

  // === Component Selection ===
  {
    id: 11,
    category: "Components",
    question: "Redis vs Memcached: When to use which?",
    answer: `Redis:
- Rich data structures (List, Set, Sorted Set, Hash)
- Persistence (RDB/AOF)
- Pub/Sub messaging
- Lua scripting

Memcached:
- Pure KV (Key-Value) cache
- Multi-threaded (slightly higher single-node performance)
- Simpler

Reality: 99% of cases → Redis
More features, easier to operate`,
    followUp: "Redis 6.0 also supports multi-threading now"
  },
  {
    id: 12,
    category: "Components",
    question: "Kafka vs RabbitMQ: When to use which?",
    answer: `Kafka:
- High throughput (millions/sec)
- Log collection, stream processing
- Message replay capability
- Partition-based parallelism

RabbitMQ:
- Complex routing (exchanges, bindings)
- Lower latency
- Traditional message queue semantics
- Better for RPC patterns

Simple rule: High volume + need replay → Kafka; Otherwise → RabbitMQ`,
    followUp: "Kafka doesn't guarantee order across partitions. RabbitMQ guarantees order within a single queue."
  },
  {
    id: 13,
    category: "Components",
    question: "MySQL LIKE vs Elasticsearch for search?",
    answer: `MySQL LIKE '%term%':
- Small datasets
- Simple prefix matching
- No special infrastructure

Elasticsearch (ES):
- Full-text search with tokenization
- Highlighting, fuzzy matching
- Aggregations and analytics

Decision points:
- Data > 1 million rows? → ES
- Need tokenized search (not just prefix)? → ES
- Need relevance ranking? → ES

Any "Yes" → Use ES`,
    followUp: "ES caveat: Near real-time, not real-time. ~1 second write delay."
  },

  // === API Design ===
  {
    id: 14,
    category: "API Design",
    question: "REST vs GraphQL vs gRPC: How to choose?",
    answer: `REST (Representational State Transfer):
- Public APIs
- Simple CRUD operations
- Cache-friendly (HTTP caching)

GraphQL:
- Flexible client queries
- Reduces over-fetching/under-fetching
- Good for complex frontend needs

gRPC (Google Remote Procedure Call):
- Internal microservices
- High performance (Protocol Buffers)
- Strongly typed, code generation
- Bidirectional streaming

Common pattern: REST for external, gRPC for internal, GraphQL for complex frontend`,
    followUp: "gRPC uses HTTP/2, supports bidirectional streaming"
  },
  {
    id: 15,
    category: "API Design",
    question: "Pagination: Offset vs Cursor-based?",
    answer: `Offset-based: /items?page=5&limit=20
- Simple implementation
- Supports "jump to page N"
- Problem: Large offsets are slow (OFFSET 10000)

Cursor-based: /items?cursor=abc123&limit=20
- Consistent performance regardless of position
- Good for infinite scroll
- Cannot jump to arbitrary page

Decision:
- Large dataset + only need "next page" → Cursor
- Need to jump to page N → Offset (with limit)`,
    followUp: "Cursor implementation: Use last item's ID or timestamp as cursor"
  },

  // === Classic Design Problems ===
  {
    id: 16,
    category: "Design Problems",
    question: "Design URL Shortener: What's the core?",
    answer: `Core flow: Long URL → Short code → 302 redirect

Short code generation:
1. Auto-increment ID + Base62 encoding
2. MD5 hash, take first 7 characters

Storage schema:
<short_code, long_url, user_id, created_at>

Optimization:
- Cache hot short codes (99% cache hit rate)
- Read-heavy, perfect for caching`,
    followUp: "7 chars Base62 = 62^7 ≈ 3.5 trillion combinations, plenty"
  },
  {
    id: 17,
    category: "Design Problems",
    question: "Design Rate Limiter: Which algorithm?",
    answer: `Four algorithms:

1. Token Bucket:
   - Allows bursts, most common
   - Parameters: bucket size (burst), refill rate (sustained QPS)

2. Leaky Bucket:
   - Smooths traffic, constant output rate

3. Fixed Window:
   - Simple but has boundary spike problem

4. Sliding Window:
   - Most accurate but complex

Distributed implementation:
Redis + Lua script for atomicity`,
    followUp: "Token bucket params: Bucket capacity (burst allowed) + refill rate (QPS limit)"
  },
  {
    id: 18,
    category: "Design Problems",
    question: "Design Chat System: How to push messages in real-time?",
    answer: `WebSocket for persistent connections

Message flow:
Send → Server → Check recipient online status
→ Online: Push via WebSocket
→ Offline: Store in offline message table, pull on reconnect

Scaling architecture:
- Connection layer (Gateway) - holds WebSocket connections
- Business layer - message routing logic
- Separate concerns for better scaling`,
    followUp: "Single server can manage ~1 million WebSocket connections (C10M problem)"
  },

  // === Database Deep Dive ===
  {
    id: 19,
    category: "Database",
    question: "B+ Tree vs Hash Index: What's the difference?",
    answer: `B+ Tree:
- Supports range queries and sorting
- O(log N) lookup
- Default for most scenarios
- Leaf nodes linked for range scans

Hash Index:
- Only equality lookups
- O(1) lookup time
- Good for exact match only

MySQL InnoDB: Only B+ Tree
Redis/Memcached: Hash-based`,
    followUp: "B+ Tree leaf nodes have a linked list, making range scans efficient"
  },
  {
    id: 20,
    category: "Database",
    question: "When to shard? How to choose shard key?",
    answer: `Warning signs:
- Single table > 50 million rows
- Single DB > 1TB

Shard key principles:
1. Even distribution (avoid hot spots)
2. Matches common query patterns (avoid cross-shard queries)
3. Immutable (user_id good, status bad)

Common approach: Hash by user_id`,
    followUp: "Biggest challenges after sharding: Cross-shard JOINs and transactions"
  },

  // === Caching ===
  {
    id: 21,
    category: "Caching",
    question: "Cache Penetration, Breakdown, Avalanche: What are they?",
    answer: `Cache Penetration:
- Queries for non-existent data → always hits DB
- Fix: Cache empty results OR Bloom Filter

Cache Breakdown (Hotspot):
- Popular key expires → massive DB traffic
- Fix: Mutex lock OR never-expire with async refresh

Cache Avalanche:
- Many keys expire simultaneously
- Fix: Add random jitter to TTL (Time To Live)

Common theme: All three = DB gets overwhelmed`,
    followUp: "All three problems = DB getting hammered"
  },
  {
    id: 22,
    category: "Caching",
    question: "Cache-DB inconsistency: How to handle?",
    answer: `Standard strategy: Cache-Aside Pattern

Read:
1. Check cache
2. If miss → Query DB → Write to cache

Write:
1. Write to DB
2. DELETE cache (not update!)

Why delete instead of update?
Avoids race conditions with concurrent writes

Edge cases: Add short TTL as safety net`,
    followUp: "Extreme edge cases can still have inconsistency. Short TTL is the safety net."
  },

  // === Distributed Systems ===
  {
    id: 23,
    category: "Distributed",
    question: "Distributed Lock: How to implement? What are the pitfalls?",
    answer: `Redis implementation:
SET key value NX EX 10
(NX = only if Not eXists, EX = EXpire in 10 seconds)

Pitfalls:
1. Lock expires before task completes
   → Fix: Lease renewal (Redisson watchdog)

2. Redis master-replica failover loses lock
   → Fix: RedLock (majority of nodes)

3. Client GC pause causes lock to expire
   → Fix: Fencing Token`,
    followUp: "Fencing Token: Each lock acquisition returns incrementing token. Resource rejects old tokens."
  },
  {
    id: 24,
    category: "Distributed",
    question: "Distributed Transactions: How to implement?",
    answer: `Options (reliability↑, performance↓):

1. Eventual Consistency:
   Message queue + compensation
   Most common, good enough for most cases

2. TCC (Try-Confirm-Cancel):
   Three-phase with business-level rollback

3. Saga:
   Long transaction split into steps + compensation chain

4. 2PC (Two-Phase Commit):
   Strong consistency but blocking, rarely used

Most scenarios: Option 1 is sufficient`,
    followUp: "E-commerce order: Order service publishes message → Inventory service consumes → Compensate on failure"
  },

  // === Interview Tips ===
  {
    id: 25,
    category: "Interview Tips",
    question: "First 5 minutes of system design interview: What to do?",
    answer: `CLARIFY REQUIREMENTS! Ask before drawing:

1. Functional Requirements:
   - Core features? MVP scope?

2. Non-functional Requirements (NFRs):
   - DAU? QPS? Latency requirements?

3. Constraints:
   - Existing systems? Tech stack limitations?

These 5 minutes determine the next 40 minutes`,
    followUp: "Jumping straight to architecture without clarifying is a RED FLAG - shows no product thinking"
  },
  {
    id: 26,
    category: "Interview Tips",
    question: "Interviewer asks 'What else would you optimize?' - How to answer?",
    answer: `Great opportunity to show depth:

1. Observability:
   - Metrics, Logging, Tracing (the "three pillars")

2. Disaster Recovery:
   - Multi-AZ deployment, failover

3. Security:
   - DDoS protection, encryption at rest/in transit

4. Cost Optimization:
   - Hot/cold storage tiering, reserved instances

5. Internationalization:
   - Multi-region deployment, CDN

Pick 1-2 and go deep`,
    followUp: "Saying 'add caching' is too shallow. Explain: What to cache? How to invalidate?"
  },
  {
    id: 27,
    category: "Interview Tips",
    question: "Behavioral: 'Tell me about a conflict with a colleague'",
    answer: `Use STAR format:
S (Situation): Brief context
T (Task): Your responsibility  
A (Action): What you specifically did
R (Result): Quantified outcome + lessons learned

Key: Show how you resolved through communication/data, NOT that you "won" the argument`,
    followUp: "Prepare 5-7 stories covering: conflict, failure, influencing others, technical decisions"
  },

  // === Advanced Topics ===
  {
    id: 28,
    category: "Advanced",
    question: "What is CQRS? When to use it?",
    answer: `CQRS = Command Query Responsibility Segregation

Extreme read/write separation:
- Command model (writes) completely separate from
- Query model (reads)

Use when:
- Read/write ratio is extreme (100:1)
- Read and write needs are very different

Example:
- Writes go to MySQL (for transactions)
- Reads go to ES (for search) + Redis (for caching)`,
    followUp: "CQRS often paired with Event Sourcing"
  },
  {
    id: 29,
    category: "Advanced",
    question: "What is Event Sourcing?",
    answer: `Instead of storing current state, store all events.
Current state = replay of all events.

Advantages:
- Complete audit trail
- Can reconstruct any point in time ("time travel")
- Natural fit for event-driven systems

Disadvantages:
- Queries require event replay (need snapshots)
- Higher storage cost

Example: Bank account stores every transaction, not just balance`,
    followUp: "Event Sourcing + CQRS = powerful pattern for complex systems"
  },
  {
    id: 30,
    category: "Advanced",
    question: "Microservices: What are the principles for splitting?",
    answer: `Core principles:

1. Single Responsibility:
   One service does one thing well

2. Independent Deployment:
   Change one without affecting others

3. Data Independence:
   Each service owns its database

Split signals:
- Team boundaries
- Different release frequencies  
- Different scaling needs

DON'T split too early! Start monolith, split when pain is clear`,
    followUp: "Biggest challenges after splitting: Distributed transactions and data consistency"
  }
];

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FlashcardDataEN };
}
