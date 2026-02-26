// System Design Cases Data
const casesData = {
  cases: [
    {
      id: "youtube",
      title: "Design YouTube",
      category: "Product Design",
      difficulty: "Hard",
      requirements: {
        functional: [
          "Users should be able to upload videos",
          "Users should be able to watch/stream videos",
          "Support video metadata (title, description, privacy settings)",
          "Support large video files (up to 256GB)",
          "Enable video search and discovery"
        ],
        non_functional: [
          "High Availability (prioritize over consistency)",
          "Low Latency Streaming (~500ms to first pixel)",
          "Scalability (1M uploads/day, 100M DAU)",
          "Support for low bandwidth streaming",
          "Fault Tolerance and Durability"
        ]
      },
      api_design: [
        "POST /videos - Upload video with metadata",
        "GET /videos/{id} - Stream video content",
        "GET /videos/{id}/metadata - Get video information",
        "POST /videos/{id}/views - Track video view",
        "GET /search?q={query} - Search videos"
      ],
      high_level_design: `
        **Upload Flow:**
        Client → API Gateway → Upload Service → Object Storage (S3) for video bytes
        → Metadata stored in Database → Transcoding Service processes video
        → CDN distributes globally
        
        **Streaming Flow:**
        Client → CDN (cache hit) → return video
        CDN (cache miss) → Origin servers → Object Storage → return to CDN → Client
        
        **Key Components:**
        - Load Balancers
        - API Gateway
        - Upload/Stream Services
        - Object Storage (S3)
        - Metadata Database (SQL)
        - Transcoding Pipeline
        - CDN (CloudFront, Akamai)
      `,
      deep_dives: [
        {
          topic: "Handling Large File Uploads",
          details: "Use chunked upload with resumable uploads. Break 256GB files into chunks (5-10MB), upload in parallel, track progress, support resume on failure."
        },
        {
          topic: "Adaptive Bitrate Streaming",
          details: "Transcode videos into multiple resolutions (1080p, 720p, 480p, 360p). Use HLS or DASH protocols. Client adapts quality based on bandwidth."
        },
        {
          topic: "CDN Strategy",
          details: "Global CDN with edge locations for low latency. Cache popular content, implement cache eviction policies, use origin shield."
        },
        {
          topic: "Scalability",
          details: "Horizontal scaling of services, database sharding by video_id, read replicas for metadata, distributed object storage."
        }
      ]
    },
    {
      id: "uber",
      title: "Design Uber",
      category: "Product Design",
      difficulty: "Hard",
      requirements: {
        functional: [
          "Riders can request rides",
          "Drivers can accept/reject ride requests",
          "Real-time location tracking for drivers and riders",
          "Match riders with nearby available drivers",
          "Calculate ETA and fare estimates",
          "Support ride history and payments"
        ],
        non_functional: [
          "Low Latency (< 1 second for matching)",
          "High Availability (critical for safety)",
          "Strong Consistency for ride states",
          "Scalability (millions of concurrent users)",
          "Real-time updates via WebSockets"
        ]
      },
      api_design: [
        "POST /rides/request - Request a ride",
        "POST /rides/{id}/accept - Driver accepts ride",
        "PUT /locations - Update driver/rider location",
        "GET /drivers/nearby?lat={lat}&lon={lon} - Find nearby drivers",
        "GET /rides/{id}/status - Get ride status"
      ],
      high_level_design: `
        **Request Flow:**
        Rider App → API Gateway → Ride Service → Matching Service
        → finds nearby drivers using geospatial index → sends notifications
        → Driver accepts → update ride status → WebSocket push to clients
        
        **Location Tracking:**
        Driver/Rider Apps → WebSocket Gateway → Location Service
        → Redis (geohash for proximity search) → periodic DB persistence
        
        **Key Components:**
        - API Gateway
        - Ride Management Service
        - Matching Service (geospatial indexing)
        - Location Service (Redis with geohashing)
        - Notification Service
        - WebSocket Servers
        - Database (PostgreSQL with PostGIS)
      `,
      deep_dives: [
        {
          topic: "Geospatial Indexing",
          details: "Use QuadTree or Geohashing (Redis GEOADD). Divide world into grid cells, index drivers by location, efficiently find nearby drivers within radius."
        },
        {
          topic: "Matching Algorithm",
          details: "Find drivers within 5km radius, filter by availability/rating, estimate ETA, send top 3 candidates, first to accept wins, implement timeout."
        },
        {
          topic: "Real-time Updates",
          details: "WebSocket connections for live location updates. Reduce update frequency (every 5 seconds when moving), use message queues for reliability."
        },
        {
          topic: "Scalability",
          details: "Shard by geographic region, replicate data across zones, use cache for hot spots (airports, stadiums), horizontal scaling of services."
        }
      ]
    },
    {
      id: "whatsapp",
      title: "Design WhatsApp",
      category: "Product Design",
      difficulty: "Hard",
      requirements: {
        functional: [
          "Send and receive one-to-one messages",
          "Group messaging support",
          "Media sharing (photos, videos, files)",
          "Message delivery status (sent, delivered, read)",
          "Offline message storage and delivery",
          "End-to-end encryption"
        ],
        non_functional: [
          "Low Latency (< 100ms message delivery)",
          "High Availability (99.99% uptime)",
          "Strong Consistency for message ordering",
          "Scalability (billions of messages/day)",
          "Security and Privacy"
        ]
      },
      api_design: [
        "POST /messages - Send message",
        "GET /messages?user_id={id} - Get message history",
        "POST /messages/{id}/status - Update delivery status",
        "POST /groups - Create group",
        "POST /media - Upload media file",
        "WebSocket /ws - Real-time message stream"
      ],
      high_level_design: `
        **Message Flow:**
        Sender → WebSocket Gateway → Message Service → Check recipient online?
        → If online: push via WebSocket
        → If offline: store in Message Queue → deliver when user comes online
        → Persist in Database → Update delivery status
        
        **Media Handling:**
        Client → Upload to Object Storage (S3) → Store URL in message
        → Recipient downloads from CDN
        
        **Key Components:**
        - WebSocket Gateway (persistent connections)
        - Message Service
        - Message Queue (Kafka/RabbitMQ for offline delivery)
        - Key-Value Store (message cache)
        - Database (Cassandra for message history)
        - Object Storage + CDN (media files)
      `,
      deep_dives: [
        {
          topic: "Message Ordering",
          details: "Use message_id with timestamp + sequence number. Client-side sequence tracking. Server ensures FIFO delivery per conversation."
        },
        {
          topic: "Offline Message Delivery",
          details: "Queue messages in Kafka/RabbitMQ. Store undelivered messages with TTL. On reconnect, flush queue to client. Ack-based delivery confirmation."
        },
        {
          topic: "Group Messaging",
          details: "Fanout pattern: send to each group member individually. Use message queue for async delivery. Optimize with user-group membership cache."
        },
        {
          topic: "WebSocket Management",
          details: "Maintain persistent connections per user. Heartbeat for connection health. Reconnection with exponential backoff. Scale with connection pooling."
        }
      ]
    },
    {
      id: "newsfeed",
      title: "Design News Feed",
      category: "Product Design",
      difficulty: "Medium",
      requirements: {
        functional: [
          "Users can create posts",
          "Users can view personalized news feed",
          "Follow/unfollow other users",
          "Paginated feed display",
          "Support likes, comments, shares",
          "Real-time updates for new posts"
        ],
        non_functional: [
          "Low Latency (< 200ms to load feed)",
          "High Availability",
          "Eventual Consistency acceptable",
          "Scalability (millions of users, billions of posts)",
          "Efficient fanout for popular users"
        ]
      },
      api_design: [
        "POST /posts - Create a new post",
        "GET /feed?user_id={id}&page={n} - Get paginated feed",
        "POST /follows - Follow a user",
        "GET /posts/{id} - Get specific post",
        "POST /posts/{id}/like - Like a post"
      ],
      high_level_design: `
        **Feed Generation (Fanout on Write):**
        User creates post → Fanout Service → Get follower list
        → Push post_id to each follower's feed cache (Redis)
        → Async delivery via message queue
        
        **Feed Reading:**
        User requests feed → Feed Service → Read from Redis feed cache
        → Fetch post details from Database → Rank/filter → Return paginated results
        
        **Hybrid Approach:**
        - Fanout on write for normal users (< 10K followers)
        - Fanout on read for celebrities (> 10K followers)
        
        **Key Components:**
        - API Gateway
        - Post Service
        - Fanout Service
        - Feed Cache (Redis sorted sets)
        - Posts Database (Cassandra)
        - Graph Database (followers/following)
      `,
      deep_dives: [
        {
          topic: "Fanout Strategies",
          details: "Fanout on write: pre-compute feeds, fast reads. Fanout on read: compute on demand, fresh data. Hybrid: use both based on user popularity."
        },
        {
          topic: "Feed Ranking",
          details: "Chronological vs algorithmic. Score posts by engagement (likes, comments), recency, user affinity. Use ML model for personalization."
        },
        {
          topic: "Caching Strategy",
          details: "Redis sorted sets for feed timeline (score = timestamp). Cache top 500 posts per user. LRU eviction. Write-through cache on new posts."
        },
        {
          topic: "Scalability",
          details: "Shard posts by post_id. Shard feeds by user_id. Async fanout via message queue. Read replicas for post details. CDN for media content."
        }
      ]
    },
    {
      id: "ratelimiter",
      title: "Design Rate Limiter",
      category: "Infrastructure Design",
      difficulty: "Medium",
      requirements: {
        functional: [
          "Limit requests per client (IP, user_id, API key)",
          "Support multiple limit types (per second, minute, hour)",
          "Return 429 status when limit exceeded",
          "Support different limits for different endpoints",
          "Provide rate limit info in response headers"
        ],
        non_functional: [
          "Low Latency (< 10ms overhead)",
          "High Availability",
          "Accuracy (minimal false positives/negatives)",
          "Scalability (millions of requests/second)",
          "Distributed and fault-tolerant"
        ]
      },
      api_design: [
        "Middleware layer, not user-facing API",
        "Internal check: isAllowed(client_id, endpoint)",
        "Return: { allowed: true/false, limit: 100, remaining: 45, reset: timestamp }",
        "Configuration API: POST /limits - Set rate limit rules"
      ],
      high_level_design: `
        **Request Flow:**
        Client Request → Rate Limiter Middleware → Check Redis counter
        → If under limit: increment counter, forward to backend
        → If over limit: return 429 Too Many Requests
        
        **Distributed Setup:**
        Multiple Rate Limiter instances → Shared Redis cluster (atomic operations)
        → Consistent view of request counts across instances
        
        **Key Components:**
        - Rate Limiter Service (middleware)
        - Redis (centralized counter storage)
        - Rules Engine (load limits from config DB)
        - Monitoring & Alerting
      `,
      deep_dives: [
        {
          topic: "Rate Limiting Algorithms",
          details: "Token Bucket: refill tokens at fixed rate, consume on request. Sliding Window: track request timestamps in window. Fixed Window Counter: simpler but has boundary issues. Leaky Bucket: smooth traffic."
        },
        {
          topic: "Distributed Rate Limiting",
          details: "Use Redis for shared state. Atomic INCR operations. Lua scripts for multi-op atomicity. Handle Redis failures gracefully (fail-open vs fail-closed)."
        },
        {
          topic: "Performance Optimization",
          details: "In-memory cache for rules. Redis pipelining. Async updates. Local rate limiting + distributed coordination. Use Redis cluster for horizontal scaling."
        },
        {
          topic: "Edge Cases",
          details: "Clock skew across servers. Redis failover handling. Distributed counter lag. Rate limit rule updates. Monitoring and alerting for abuse patterns."
        }
      ]
    },
    {
      id: "webcrawler",
      title: "Design Web Crawler",
      category: "Infrastructure Design",
      difficulty: "Hard",
      requirements: {
        functional: [
          "Crawl web pages from seed URLs",
          "Extract and follow hyperlinks",
          "Store page content and metadata",
          "Handle politeness (robots.txt, rate limiting per domain)",
          "Detect and handle duplicates",
          "Support re-crawling for freshness"
        ],
        non_functional: [
          "Scalability (billions of pages)",
          "Distributed crawling",
          "Fault Tolerance (handle failures, retries)",
          "Politeness (respect robots.txt, rate limits)",
          "Efficiency (prioritize important pages)"
        ]
      },
      api_design: [
        "POST /crawl - Add seed URLs to crawl queue",
        "GET /status/{job_id} - Check crawl job status",
        "GET /pages?domain={domain} - Query crawled pages",
        "POST /recrawl - Trigger re-crawl for specific URLs"
      ],
      high_level_design: `
        **Crawling Pipeline:**
        Seed URLs → URL Frontier (priority queue) → Fetcher Workers (distributed)
        → Download page → Parser (extract links) → URL Deduplicator
        → New URLs back to Frontier → Content Storage → Indexer
        
        **Distributed Architecture:**
        - URL Frontier: Kafka or Redis queue (FIFO/priority)
        - Fetcher Workers: Horizontally scaled worker pool
        - DNS Resolver: Cache DNS lookups
        - Robot.txt Cache: Respect crawl rules
        - Bloom Filter: Fast duplicate detection
        
        **Key Components:**
        - URL Frontier (priority queue)
        - Fetcher Service (worker pool)
        - Parser Service (extract links, content)
        - Storage Service (HBase, HDFS)
        - Duplicate Detector (Bloom filter)
        - Scheduler (prioritization, politeness)
      `,
      deep_dives: [
        {
          topic: "URL Frontier Design",
          details: "Priority queue for important pages (PageRank). Per-domain queues for politeness. Combine FIFO for fairness and priority for efficiency. Use Kafka for distributed queue."
        },
        {
          topic: "Duplicate Detection",
          details: "Use Bloom Filter for fast membership test (space-efficient, allows false positives). Compute URL fingerprint (hash). Store seen URLs in distributed KV store. Handle URL normalization."
        },
        {
          topic: "Politeness & Robots.txt",
          details: "Cache robots.txt per domain. Rate limit requests per domain (1-2 requests/second). Delay between requests from same domain. Respect Crawl-delay directive."
        },
        {
          topic: "Scalability & Fault Tolerance",
          details: "Distribute work by URL hash. Multiple fetcher workers. Checkpoint progress. Retry failed fetches with exponential backoff. Dead letter queue for persistent failures. Monitor crawler health."
        }
      ]
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = casesData;
}
