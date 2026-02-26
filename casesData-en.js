// System Design Cases - English Version
// Detailed explanations with code examples and interview tips

const casesData = {
  cases: [
    {
      id: "youtube",
      title: "Design YouTube",
      category: "Product Design",
      difficulty: "Hard",
      
      requirements: {
        functional: [
          "Video upload: Users can upload videos up to 256GB (requires chunked upload, resumable)",
          "Video playback: Streaming with seek support (requires video segmentation)",
          "Video processing: Auto-transcode to multiple resolutions (1080p/720p/480p/360p)",
          "Metadata management: Title, description, tags, thumbnails, privacy settings",
          "Video search: Search by title, description, tags (requires search engine)"
        ],
        non_functional: [
          "High Availability > Strong Consistency: Better to show stale data than be unavailable",
          "Low latency playback: Time to first frame < 500ms (requires CDN + preloading)",
          "Scale: 1M uploads/day, 100M DAU, 1B+ video library",
          "Bandwidth adaptation: Auto quality switching (HLS/DASH protocols)",
          "Durability: Once uploaded successfully, videos are never lost"
        ]
      },

      estimation: `
**Storage Estimation:**
• Daily uploads: 1M videos × avg 500MB = 500TB/day
• After transcoding (multi-resolution): ~3x = 1.5PB/day
• Yearly storage: ~500PB (requires Object Storage)

**Bandwidth Estimation:**
• DAU: 100M users × avg 5 videos × 10 min × 5Mbps
• Peak bandwidth: ~100Tbps (requires global CDN)

**QPS Estimation:**
• Playback requests: 100M × 5 videos / 86400s ≈ 6K QPS (average)
• Peak 3x: 18K QPS
• Upload requests: 1M / 86400 ≈ 12 QPS (relatively small)
      `,

      api_design: [
        "POST /v1/videos/upload-url - Get pre-signed upload URL (direct to S3)",
        "POST /v1/videos/upload-complete - Upload complete, trigger transcoding",
        "GET /v1/videos/{id}/manifest - Get HLS/DASH manifest",
        "GET /v1/videos/{id}/chunks/{quality}/{index} - Get video segment",
        "GET /v1/search?q={query}&page={n} - Search videos",
        "POST /v1/videos/{id}/views - Record view (async write)"
      ],

      high_level_design: `
**Upload Flow (Why designed this way):**

\`\`\`
Client ──────────────────────────────────────────────────────
   │
   │ 1. POST /upload-url (request upload)
   ▼
API Gateway ───────────────────────────────────────────────────
   │  
   │ Why API Gateway?
   │ • Single entry point for rate limiting, auth
   │ • Request routing
   ▼
Upload Service ────────────────────────────────────────────────
   │
   │ 2. Returns pre-signed URL
   │    Why pre-signed?
   │    • Client uploads directly to S3, not through server
   │    • Reduces server bandwidth
   │    • URL has expiry, secure
   ▼
Client direct to S3 ──────────────────────────────────────────────
   │
   │ 3. Multipart Upload
   │    Why chunked?
   │    • 256GB file will fail in single upload
   │    • Supports resume on failure
   │    • Can upload multiple chunks in parallel
   ▼
S3 Object Storage ──────────────────────────────────────────────
   │
   │ 4. Upload complete notification
   ▼
Transcoding Queue (Kafka/SQS) ─────────────────────────────────
   │
   │ 5. Transcoding job enqueued
   │    Why message queue?
   │    • Transcoding is slow (minutes), can't wait synchronously
   │    • Queue handles traffic spikes
   │    • Failed jobs can retry
   ▼
Transcoding Workers (Kubernetes Jobs) ─────────────────────────
   │
   │ 6. Transcode to multiple resolutions
   │    • 1080p, 720p, 480p, 360p
   │    • Generate HLS/DASH segments
   │    • Each segment ~2-10 seconds
   ▼
S3 + CDN ────────────────────────────────────────────────────
   │
   │ 7. Transcoding complete, update metadata
   ▼
Metadata DB (MySQL/PostgreSQL) ────────────────────────────────
\`\`\`

**Playback Flow:**

\`\`\`
Client requests playback
   │
   │ 1. GET /videos/{id}/manifest
   ▼
API → Metadata DB query video info
   │
   │ 2. Return manifest file (contains segment lists for each quality)
   ▼
Client parses manifest, requests video segments
   │
   │ 3. GET /chunks/1080p/001.ts
   ▼
CDN (Edge node)
   │
   │ Cache HIT → Return directly (latency < 50ms)
   │ Cache MISS → Fetch from S3 → Cache → Return
   ▼
Client player
   │
   │ 4. Auto-switch quality based on bandwidth
   │    Good bandwidth → Switch to 1080p
   │    Poor bandwidth → Switch to 480p
\`\`\`

**Key Component Choices:**

| Component | Choice | Reasoning |
|-----------|--------|-----------|
| Video Storage | S3/GCS | Infinite scale, high durability, cheap |
| Metadata | PostgreSQL | ACID, complex queries |
| Cache | Redis | Hot video metadata |
| CDN | CloudFront/Akamai | Global distribution, low latency |
| Message Queue | Kafka | High throughput, durable |
| Search | Elasticsearch | Full-text search, relevance ranking |
| Transcoding | FFmpeg on K8s | Horizontal scaling, on-demand |
      `,

      deep_dives: [
        {
          topic: "Large File Chunked Upload (Must Know)",
          details: `
**Problem**: How to upload a 256GB file?

**Solution: Multipart Upload**

\`\`\`python
# 1. Initialize multipart upload
upload_id = s3.create_multipart_upload(bucket, key)

# 2. Client splits file (100MB each)
for i, chunk in enumerate(file.chunks(100MB)):
    # Get pre-signed URL for this chunk
    url = s3.generate_presigned_url(
        'upload_part',
        upload_id=upload_id,
        part_number=i+1
    )
    # Client uploads directly
    response = requests.put(url, data=chunk)
    etags.append(response.headers['ETag'])

# 3. Complete upload
s3.complete_multipart_upload(upload_id, parts=etags)
\`\`\`

**Resumable Upload Implementation**:
• Server tracks completed chunk numbers
• Client on reconnect queries completed chunks
• Only uploads missing chunks

**Interview Points**:
• Chunk size tradeoff: Too small → too many requests, too large → costly on failure
• Parallel upload of multiple chunks improves speed
• Upload timeout and retry strategy
          `
        },
        {
          topic: "Adaptive Bitrate Streaming (ABR)",
          details: `
**Problem**: What if user's network fluctuates?

**Solution: HLS/DASH Protocol**

\`\`\`
# manifest.m3u8 example
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
720p/playlist.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1000000,RESOLUTION=854x480
480p/playlist.m3u8
\`\`\`

**Player Behavior**:
1. Download manifest, get playlists for all resolutions
2. Measure download speed
3. Select highest quality < 80% of current bandwidth
4. Continuously monitor, dynamically switch

**Transcoding Pipeline**:
\`\`\`
Original video (4K)
   │
   ├── FFmpeg transcode → 1080p → segment (2s each)
   ├── FFmpeg transcode → 720p  → segment
   ├── FFmpeg transcode → 480p  → segment
   └── FFmpeg transcode → 360p  → segment
   
Each resolution stored separately, cached separately on CDN
\`\`\`

**Interview Points**:
• Why HLS instead of raw video?
  → Supports seek, adapts to network, reduces time to first frame
• Segment duration choice: 2-10s, too long → slow switching, too short → too many requests
          `
        },
        {
          topic: "CDN Caching Strategy",
          details: `
**Problem**: Where does 100Tbps bandwidth come from?

**Solution: Multi-tier CDN + Smart Caching**

\`\`\`
Client
   │
   ▼
Edge PoP (Edge node) ← 95% requests hit
   │ 100+ nodes globally
   │ Cache hot video segments
   ▼
Regional PoP ← 4% of remaining requests
   │ 1-2 per major region
   │ Cache medium-hot videos
   ▼
Origin Shield ← Last 1%
   │ Protects origin from thundering herd
   ▼
S3 Origin
\`\`\`

**Caching Strategy**:
• Hot videos: Top 1000, permanent cache
• Medium hot: LRU eviction, 7 day TTL
• Cold videos: On-demand fetch, 1 day TTL

**Cache Key Design**:
\`\`\`
/videos/{video_id}/{quality}/{chunk_index}.ts

# Example
/videos/abc123/1080p/00001.ts
/videos/abc123/720p/00001.ts
\`\`\`

**Interview Points**:
• Cache hit rate target: > 95%
• Cache-Control header settings
• How to invalidate cache when video updates (versioning)
          `
        },
        {
          topic: "Database Design",
          details: `
**Metadata Table Design**:

\`\`\`sql
-- Videos table
CREATE TABLE videos (
  id BIGINT PRIMARY KEY,  -- Snowflake ID
  user_id BIGINT NOT NULL,
  title VARCHAR(500),
  description TEXT,
  status ENUM('uploading','processing','ready','failed'),
  duration_seconds INT,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  FULLTEXT idx_search (title, description)
);

-- Video chunks table (tracks transcoded segments)
CREATE TABLE video_chunks (
  video_id BIGINT,
  quality ENUM('1080p','720p','480p','360p'),
  chunk_index INT,
  s3_key VARCHAR(500),
  duration_ms INT,
  PRIMARY KEY (video_id, quality, chunk_index)
);
\`\`\`

**Sharding Strategy**:
• Shard by video_id hash
• Each shard ~10M videos
• 64 shards supports 640M videos

**Read-Write Separation**:
• 1 primary for writes
• N replicas for reads
• Metadata cached in Redis (TTL 5min)
          `
        }
      ],

      interviewTips: [
        "First clarify scale: DAU, daily uploads, average video size",
        "Explain upload and playback as two main flows, don't jump around",
        "Proactively mention chunked upload and adaptive bitrate - core YouTube features",
        "CDN is essential, explain multi-tier cache architecture",
        "Justify database choices: why S3 for videos, why MySQL for metadata"
      ],

      commonMistakes: [
        "❌ Storing videos in database → Use Object Storage",
        "❌ Synchronous transcoding → Use message queue for async",
        "❌ Ignoring CDN → Can't handle traffic without CDN",
        "❌ Single resolution → Must support adaptive bitrate",
        "❌ Ignoring resumable upload → Required for large files"
      ]
    },

    {
      id: "uber",
      title: "Design Uber",
      category: "Product Design",
      difficulty: "Hard",
      
      requirements: {
        functional: [
          "Rider requests ride: Specify pickup and destination",
          "Match nearby drivers: Find closest available driver",
          "Real-time tracking: Rider sees driver location",
          "Trip management: Driver accepts, starts trip, completes trip",
          "Fare calculation: Based on distance, time, surge pricing",
          "Payment processing: Auto-charge after trip"
        ],
        non_functional: [
          "Low latency matching: < 1 second to return match",
          "High availability: Ride-hailing is critical, can't be down",
          "Real-time: Location updates < 5 second delay",
          "Scale: Millions of concurrent drivers, tens of millions of users",
          "Consistency: Trip state must be strongly consistent (no double booking)"
        ]
      },

      estimation: `
**Scale Estimation:**
• Online drivers: 1 million
• DAU: 10 million riders
• Daily trips: 10 million
• QPS: 10M / 86400 ≈ 115 QPS (trips)
• Location updates: 1M drivers × every 5s = 200K QPS

**Storage Estimation:**
• Each location update: 50 bytes (driver_id + lat/lng + timestamp)
• Daily location data: 200K × 86400 × 50 bytes ≈ 860GB/day
• Usually only keep latest location, archive history
      `,

      api_design: [
        "POST /v1/rides - Rider requests ride",
        "GET /v1/rides/{id} - Get trip details",
        "PUT /v1/rides/{id}/accept - Driver accepts",
        "PUT /v1/rides/{id}/start - Start trip",
        "PUT /v1/rides/{id}/complete - Complete trip",
        "PUT /v1/drivers/{id}/location - Update driver location",
        "GET /v1/drivers/nearby?lat={lat}&lng={lng}&radius={r} - Query nearby drivers",
        "WebSocket /ws/rides/{id} - Real-time location push"
      ],

      high_level_design: `
**Ride Matching Flow (Core!):**

\`\`\`
Rider App
   │
   │ 1. POST /rides {pickup: {lat, lng}, dest: {lat, lng}}
   ▼
API Gateway
   │
   ▼
Ride Service
   │
   │ 2. Create Ride record, status = MATCHING
   │
   │ 3. Call Matching Service
   ▼
Matching Service ──────────────────────────────────────────────
   │
   │ 4. Query nearby drivers
   │    How to quickly find nearby drivers?
   │
   ▼
Location Service (Redis + Geohash) ─────────────────────────────
   │
   │ GEORADIUS drivers:online {lat} {lng} 5 km
   │ Returns all online drivers within 5km
   │
   │ 5. Filter:
   │    • Driver has active trip? Exclude
   │    • Rating too low? Exclude
   │    • Car type mismatch? Exclude
   │
   │ 6. Sort:
   │    • By ETA (estimated arrival time)
   │    • Not straight-line distance! Consider traffic
   │
   │ 7. Send notification to Top 3 drivers
   ▼
Notification Service
   │
   │ 8. Push notification to Driver App
   ▼
Driver App
   │
   │ 9. Driver sees request, taps accept
   │    PUT /rides/{id}/accept
   ▼
Ride Service
   │
   │ 10. Check: Is this ride still available? (distributed lock)
   │     • Another driver might have accepted
   │     • Rider might have cancelled
   │
   │ 11. Update Ride status = ACCEPTED
   │
   │ 12. Notify rider: Driver accepted
   ▼
WebSocket Gateway
   │
   ▼
Rider App shows: Driver is on the way, ETA 5 minutes
\`\`\`

**Real-time Location Tracking:**

\`\`\`
Driver App (every 5 seconds)
   │
   │ PUT /drivers/{id}/location
   │ {lat: 31.2, lng: 121.5, timestamp: ...}
   ▼
API Gateway
   │
   ▼
Location Service
   │
   │ 1. Update Redis Geo index
   │    GEOADD drivers:online {lng} {lat} {driver_id}
   │
   │ 2. If driver has active trip, push to rider
   ▼
WebSocket Gateway
   │
   │ Find rider's WebSocket connection
   │ Push driver's new location
   ▼
Rider App updates driver position on map
\`\`\`

**Key Components:**

| Component | Choice | Reasoning |
|-----------|--------|-----------|
| Location Storage | Redis Geo | Native geo queries, millisecond response |
| Trip Data | PostgreSQL | Strong consistency, ACID transactions |
| Real-time Push | WebSocket | Bidirectional real-time communication |
| Notifications | FCM/APNs | Push to mobile apps |
| Matching Lock | Redis | Distributed lock prevents double booking |
| Message Queue | Kafka | High throughput location updates |
      `,

      deep_dives: [
        {
          topic: "Geospatial Indexing (Must Know)",
          details: `
**Problem**: How to quickly find drivers within 5km?

**Solution 1: Geohash + Redis**

\`\`\`python
# Geohash principle: Divide Earth's surface into grid cells, each with a code
# Similar prefix = geographically close

# Tiananmen Square, Beijing: wtw3sjq
# Forbidden City, Beijing:   wtw3sjz  (differs only in last char, very close!)

# Redis implementation
import redis
r = redis.Redis()

# Add driver location
r.geoadd("drivers:online", 116.397, 39.908, "driver_001")
r.geoadd("drivers:online", 116.398, 39.909, "driver_002")

# Query drivers within 5km
nearby = r.georadius(
    "drivers:online",
    longitude=116.397,
    latitude=39.908,
    radius=5,
    unit="km",
    withdist=True,    # Return distance
    sort="ASC",       # Sort by distance
    count=10          # Return max 10
)
# Returns: [("driver_001", 0.0), ("driver_002", 0.15)]
\`\`\`

**Solution 2: QuadTree (if not using Redis)**

\`\`\`
Recursively divide map into 4 quadrants:
         ┌───────┬───────┐
         │ NW    │ NE    │
         │       │   🚗  │
         ├───────┼───────┤
         │ SW    │ SE    │
         │  🚗   │       │
         └───────┴───────┘

When querying, only traverse relevant quadrants
\`\`\`

**Interview Points**:
• Geohash boundary problem: Adjacent cells may have completely different codes
  → Solution: Also query 8 neighboring cells
• Remove driver from index when offline
• Balance index update frequency vs location update frequency
          `
        },
        {
          topic: "Driver Matching Algorithm",
          details: `
**Problem**: Found nearby drivers, how to choose?

**Don't just pick the closest! Consider:**
1. ETA (Estimated Time of Arrival) - consider traffic
2. Driver rating
3. Acceptance rate
4. Car type match
5. Fairness (don't always dispatch to same driver)

**Matching Algorithm:**

\`\`\`python
def match_driver(ride, nearby_drivers):
    candidates = []
    
    for driver in nearby_drivers:
        # 1. Basic filtering
        if driver.current_ride is not None:
            continue  # Already has trip
        if driver.rating < 4.0:
            continue  # Rating too low
        if ride.car_type != driver.car_type:
            continue  # Car type mismatch
        
        # 2. Calculate ETA (call Maps API)
        eta = maps_api.get_eta(driver.location, ride.pickup)
        
        # 3. Calculate match score
        score = calculate_score(
            eta=eta,
            rating=driver.rating,
            acceptance_rate=driver.acceptance_rate,
            recent_rides=driver.recent_rides
        )
        candidates.append((driver, score, eta))
    
    # 4. Sort by score, take Top 3
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[:3]

def calculate_score(eta, rating, acceptance_rate, recent_rides):
    score = 0
    score += (1 - eta / 30) * 40      # Lower ETA = higher score (30min max)
    score += (rating / 5) * 30        # Rating weight 30%
    score += acceptance_rate * 20     # Acceptance rate weight 20%
    score += (1 - recent_rides / 10) * 10  # Fairness: fewer recent rides = bonus
    return score
\`\`\`

**Why send to multiple drivers?**
• First driver might not accept
• Set timeout (e.g., 15 seconds)
• After timeout, send to next driver
• When one accepts, cancel others immediately
          `
        },
        {
          topic: "High Concurrency Dispatch (Distributed Lock)",
          details: `
**Problem**: Multiple drivers tap "Accept" simultaneously?

**Solution: Redis Distributed Lock**

\`\`\`python
def accept_ride(driver_id, ride_id):
    lock_key = f"ride_lock:{ride_id}"
    
    # 1. Try to acquire lock (SET NX EX)
    acquired = redis.set(
        lock_key,
        driver_id,
        nx=True,  # Only set if key doesn't exist
        ex=30     # 30s expiry, prevents deadlock
    )
    
    if not acquired:
        return {"error": "Ride already taken by another driver"}
    
    try:
        # 2. Check ride status
        ride = db.get_ride(ride_id)
        if ride.status != "MATCHING":
            return {"error": "Ride status changed"}
        
        # 3. Update ride
        ride.status = "ACCEPTED"
        ride.driver_id = driver_id
        db.save(ride)
        
        # 4. Cancel requests to other drivers
        cancel_other_driver_requests(ride_id, except_driver=driver_id)
        
        # 5. Notify rider
        notify_rider(ride.rider_id, f"Driver {driver_id} accepted")
        
        return {"success": True}
        
    finally:
        # 6. Release lock (only owner can release)
        if redis.get(lock_key) == driver_id:
            redis.delete(lock_key)
\`\`\`

**Why need lock?**
• Two drivers tap accept almost simultaneously
• Without lock → both succeed → one ride, two drivers
• With lock → only first one succeeds
          `
        },
        {
          topic: "Surge Pricing",
          details: `
**Problem**: Supply-demand imbalance?

**Rainy day/rush hour: Demand >> Supply**
• Riders wait too long → bad experience
• Driver income unchanged → no incentive to drive

**Solution: Dynamic Pricing**

\`\`\`python
def calculate_surge_multiplier(area_id):
    # 1. Get supply-demand data for area
    demand = get_ride_requests_count(area_id, last_10_min)
    supply = get_available_drivers_count(area_id)
    
    # 2. Calculate supply-demand ratio
    if supply == 0:
        ratio = float('inf')
    else:
        ratio = demand / supply
    
    # 3. Map to surge multiplier
    if ratio < 1.0:
        return 1.0    # Supply > demand, no surge
    elif ratio < 1.5:
        return 1.2    # Light imbalance
    elif ratio < 2.0:
        return 1.5
    elif ratio < 3.0:
        return 2.0
    else:
        return 2.5    # Max 2.5x
    
def calculate_fare(ride, surge):
    base_fare = 10  # Base price
    per_km = 2      # Per kilometer
    per_min = 0.5   # Per minute
    
    distance = get_distance(ride.pickup, ride.dest)
    duration = get_estimated_duration(ride.pickup, ride.dest)
    
    fare = base_fare + (distance * per_km) + (duration * per_min)
    return fare * surge  # Multiply by surge
\`\`\`

**Interview Points**:
• Surge must be calculated in real-time
• Must inform rider of surge reason and amount
• Cap protection (can't surge infinitely)
          `
        }
      ],

      interviewTips: [
        "Focus on matching flow - this is Uber's core",
        "Geospatial indexing is a must-ask, explain Geohash principle",
        "Distributed lock must be mentioned - prevents double booking",
        "Real-time via WebSocket, don't use polling",
        "Proactively mention surge pricing to show business understanding"
      ],

      commonMistakes: [
        "❌ Using polling for real-time location → Use WebSocket",
        "❌ Selecting driver by straight-line distance → Use ETA",
        "❌ Ignoring distributed lock → Causes double booking",
        "❌ Storing location updates in MySQL → Use Redis Geo",
        "❌ Querying database for every request → Location data should be in memory"
      ]
    },

    {
      id: "ratelimiter",
      title: "Design Rate Limiter",
      category: "Infrastructure Design",
      difficulty: "Medium",
      
      requirements: {
        functional: [
          "Limit request rate: Max N requests per second/minute",
          "Multi-dimensional limits: By IP, user ID, API key",
          "Return rate limit info: Remaining quota, reset time",
          "Flexible configuration: Different limits for different APIs"
        ],
        non_functional: [
          "Low latency: < 10ms overhead",
          "High availability: Rate limiter failure shouldn't break service",
          "Accuracy: Minimize false positives/negatives",
          "Distributed: Share rate limit state across instances"
        ]
      },

      api_design: [
        "// Internal interface, not exposed externally",
        "isAllowed(client_id, endpoint) → bool",
        "getRateLimitInfo(client_id) → {limit, remaining, reset}",
        "// HTTP Response Headers",
        "X-RateLimit-Limit: 100",
        "X-RateLimit-Remaining: 45",
        "X-RateLimit-Reset: 1640000000"
      ],

      high_level_design: `
**Overall Architecture:**

\`\`\`
Client Request
   │
   ▼
Load Balancer
   │
   ▼
Rate Limiter Middleware ◄──────────── Rules Config DB
   │                                  (Rate limit rules)
   │ Check if over limit
   ▼
Redis Cluster ◄───────────────────── (Shared counters)
   │
   │ Under limit → Allow
   │ Over limit → Return 429
   ▼
Backend Service
\`\`\`

**Rate Limiting Algorithm Comparison:**

| Algorithm | Principle | Pros | Cons |
|-----------|-----------|------|------|
| Fixed Window | Max 100 per minute | Simple | Boundary burst issue |
| Sliding Window | Max 100 in last 60s | Smooth | Higher memory usage |
| Token Bucket | Request needs token from bucket | Allows burst | Complex implementation |
| Leaky Bucket | Requests drain at fixed rate | Smooth traffic | No burst allowed |
      `,

      deep_dives: [
        {
          topic: "Token Bucket Algorithm (Most Common)",
          details: `
**Principle:**
\`\`\`
Bucket capacity: 100 tokens
Refill rate: 10 tokens/second

Request arrives → Is there a token in bucket?
  Yes → Take one token, allow request
  No → Reject (429)

Auto-refill 10 tokens per second (up to capacity)
\`\`\`

**Implementation:**

\`\`\`python
import time
import redis

class TokenBucket:
    def __init__(self, redis_client, key, capacity, refill_rate):
        self.redis = redis_client
        self.key = key
        self.capacity = capacity  # Bucket capacity
        self.refill_rate = refill_rate  # Tokens per second
    
    def is_allowed(self):
        now = time.time()
        
        # Lua script ensures atomicity
        lua_script = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        
        -- Get current state
        local data = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(data[1]) or capacity
        local last_refill = tonumber(data[2]) or now
        
        -- Calculate tokens to refill
        local elapsed = now - last_refill
        local refill = elapsed * refill_rate
        tokens = math.min(capacity, tokens + refill)
        
        -- Try to get token
        local allowed = 0
        if tokens >= 1 then
            tokens = tokens - 1
            allowed = 1
        end
        
        -- Update state
        redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
        redis.call('EXPIRE', key, 3600)  -- 1 hour expiry
        
        return {allowed, tokens}
        """
        
        result = self.redis.eval(lua_script, 1, self.key, 
                                  self.capacity, self.refill_rate, now)
        return result[0] == 1, result[1]

# Usage
bucket = TokenBucket(redis, "rate:user:123", capacity=100, refill_rate=10)
allowed, remaining = bucket.is_allowed()
\`\`\`

**Why Lua script?**
• Multiple Redis operations need atomic execution
• Avoids race conditions
• Single network round-trip
          `
        },
        {
          topic: "Sliding Window Algorithm",
          details: `
**Principle:**
\`\`\`
Limit: Max 100 requests in 60 seconds

Record timestamp of each request
On query: Count requests in last 60 seconds
\`\`\`

**Implementation:**

\`\`\`python
def is_allowed_sliding_window(user_id, limit=100, window_seconds=60):
    now = time.time()
    window_start = now - window_seconds
    key = f"rate:{user_id}"
    
    # Lua script
    lua_script = """
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window_start = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])
    
    -- Remove old records outside window
    redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)
    
    -- Count requests in current window
    local count = redis.call('ZCARD', key)
    
    if count < limit then
        -- Add current request
        redis.call('ZADD', key, now, now .. ':' .. math.random())
        redis.call('EXPIRE', key, window_seconds * 2)
        return {1, limit - count - 1}  -- allowed, remaining
    else
        return {0, 0}  -- denied
    end
    """
    
    result = redis.eval(lua_script, 1, key, now, window_start, limit)
    return result[0] == 1

# Uses Sorted Set to store request timestamps
# Score = timestamp
# Member = timestamp:random (ensures uniqueness)
\`\`\`

**Pros**: Accurate, no boundary issues
**Cons**: Memory usage (one record per request)
          `
        },
        {
          topic: "Distributed Rate Limiting",
          details: `
**Problem**: How do multiple server instances share rate limit state?

**Solution 1: Centralized (Redis)**
\`\`\`
All instances share one Redis
Pros: Consistent state
Cons: Redis becomes bottleneck, has latency
\`\`\`

**Solution 2: Local + Sync**
\`\`\`
Each instance local rate limiting + periodic sync
Example: Limit 100 QPS, 10 instances
Each instance locally limits to 10 QPS
Pros: Fast
Cons: Not precise
\`\`\`

**Solution 3: Token Bucket Service**
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
Batch fetch tokens (reduces request count)
\`\`\`

**Redis Cluster Handling:**
\`\`\`python
# Use Redis Cluster
# Hash by user ID to different nodes
def get_redis_node(user_id):
    slot = crc16(user_id) % 16384
    return redis_cluster.get_node_by_slot(slot)
\`\`\`
          `
        },
        {
          topic: "Rate Limit Configuration Management",
          details: `
**Configuration Example:**

\`\`\`yaml
# rate_limits.yaml
default:
  requests_per_second: 10
  requests_per_minute: 100

endpoints:
  /api/v1/search:
    requests_per_second: 5  # Search is stricter
  /api/v1/upload:
    requests_per_minute: 10  # Upload is stricter

user_tiers:
  free:
    requests_per_day: 1000
  premium:
    requests_per_day: 100000
  enterprise:
    requests_per_day: unlimited

# IP whitelist/blacklist
whitelist:
  - 10.0.0.0/8  # Internal network no limit
blacklist:
  - 1.2.3.4     # Malicious IP
\`\`\`

**Hot Config Reload:**
\`\`\`python
# Periodically fetch from config center
def reload_config():
    new_config = config_center.get("rate_limits")
    global RATE_LIMITS
    RATE_LIMITS = new_config

# Or use watch mechanism
config_center.watch("rate_limits", on_change=reload_config)
\`\`\`
          `
        }
      ],

      interviewTips: [
        "First explain the problem being solved (prevent abuse, protect backend)",
        "Token bucket is most common algorithm, know how to implement",
        "Redis Lua script for atomicity is key",
        "Proactively mention distributed rate limiting challenges",
        "Discuss fallback strategy when rate limiter fails (fail-open vs fail-closed)"
      ],

      commonMistakes: [
        "❌ Local rate limiting without considering distributed → Need shared state",
        "❌ Non-atomic operations → Race conditions",
        "❌ Fixed window without considering boundary → Burst issues",
        "❌ Rejecting all requests when rate limiter fails → Need fallback strategy",
        "❌ Not returning rate limit info → Client needs to know remaining quota"
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = casesData;
}
