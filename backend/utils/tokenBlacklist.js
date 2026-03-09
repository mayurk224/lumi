const { getRedisClient, isRedisReady } = require('../config/redis.js');
const jwt = require('jsonwebtoken');

const PREFIX = process.env.TOKEN_BLACKLIST_PREFIX || 'blacklist:';

/**
 * Add a token to the blacklist.
 * TTL is set to the token's remaining lifetime so Redis auto-expires the key.
 * If Redis is unavailable, logs a warning and returns false (fail open).
 *
 * @param {string} token - Raw JWT string
 * @returns {Promise<boolean>} - true if blacklisted, false if failed
 */
const blacklistToken = async (token) => {
  if (!isRedisReady()) {
    console.warn('Redis unavailable — token not blacklisted:', token.substring(0, 20) + '...')
    return false
  }

  try {
    // Decode without verifying to extract expiry
    // (token was already verified upstream when this is called)
    const decoded = jwt.decode(token)

    if (!decoded || !decoded.exp) {
      console.warn('Token has no expiry — cannot blacklist')
      return false
    }

    const now = Math.floor(Date.now() / 1000)
    const ttl = decoded.exp - now

    if (ttl <= 0) {
      // Token already expired — no need to blacklist
      return true
    }

    const client = getRedisClient()
    const key = `${PREFIX}${token}`

    // Store the token's jti or userId for audit purposes
    // Value is not security-critical — just for debugging
    const value = JSON.stringify({
      userId: decoded.id || decoded.sub || 'unknown',
      blacklistedAt: new Date().toISOString(),
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
    })

    // ioredis SET with EX uses positional args: SET key value EX seconds
    await client.set(key, value, 'EX', ttl)

    console.log(`Token blacklisted for user ${decoded.id || 'unknown'}, TTL: ${ttl}s`)
    return true
  } catch (err) {
    console.error('Error blacklisting token:', err.message)
    return false
  }
}

/**
 * Check if a token is blacklisted.
 * Returns false (not blacklisted) if Redis is unavailable — fail open.
 *
 * @param {string} token - Raw JWT string
 * @returns {Promise<boolean>} - true if blacklisted, false if valid/unknown
 */
const isTokenBlacklisted = async (token) => {
  if (!isRedisReady()) {
    console.warn('Redis unavailable — skipping blacklist check')
    return false
  }

  try {
    const client = getRedisClient()
    const key = `${PREFIX}${token}`
    const result = await client.get(key)
    return result !== null
  } catch (err) {
    console.error('Error checking token blacklist:', err.message)
    return false
  }
}

/**
 * Remove a token from the blacklist manually.
 * Normally not needed since TTL handles expiry — useful for testing.
 *
 * @param {string} token - Raw JWT string
 * @returns {Promise<boolean>}
 */
const removeFromBlacklist = async (token) => {
  if (!isRedisReady()) return false

  try {
    const client = getRedisClient()
    const key = `${PREFIX}${token}`
    await client.del(key)
    return true
  } catch (err) {
    console.error('Error removing from blacklist:', err.message)
    return false
  }
}

/**
 * Get count of currently blacklisted tokens (for admin/debug).
 * Uses Redis SCAN to avoid blocking.
 *
 * @returns {Promise<number>}
 */
const getBlacklistCount = async () => {
  if (!isRedisReady()) return 0

  try {
    const client = getRedisClient()
    let count = 0
    let cursor = '0'

    do {
      // ioredis SCAN returns [nextCursorString, keysArray]
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH', `${PREFIX}*`,
        'COUNT', 100
      )
      cursor = nextCursor
      count += keys.length
    } while (cursor !== '0')

    return count
  } catch (err) {
    console.error('Error counting blacklist:', err.message)
    return 0
  }
}

/**
 * Get full details of all active blacklisted tokens.
 * For admin/debug use only — do not expose to regular users.
 *
 * @returns {Promise<Array>}
 */
const getBlacklistDetails = async () => {
  if (!isRedisReady()) return []

  try {
    const client = getRedisClient()
    const keys = []
    let cursor = '0'

    // First collect all keys via SCAN
    do {
      const [nextCursor, batch] = await client.scan(
        cursor,
        'MATCH', `${PREFIX}*`,
        'COUNT', 100
      )
      cursor = nextCursor
      keys.push(...batch)
    } while (cursor !== '0')

    if (keys.length === 0) return []

    // Fetch all values and TTLs in parallel using pipeline
    const pipeline = client.pipeline()
    keys.forEach(key => {
      pipeline.get(key)
      pipeline.ttl(key)
    })
    const results = await pipeline.exec()

    // results is array of [error, value] pairs
    // every 2 entries = [get_result, ttl_result] for one key
    const details = []
    for (let i = 0; i < keys.length; i++) {
      const [getErr, value] = results[i * 2]
      const [ttlErr, ttl] = results[i * 2 + 1]

      if (!getErr && value) {
        try {
          const meta = JSON.parse(value)
          details.push({
            key: keys[i],
            ttlSeconds: ttlErr ? null : ttl,
            ...meta,
          })
        } catch {
          details.push({ key: keys[i], ttlSeconds: ttlErr ? null : ttl })
        }
      }
    }

    return details
  } catch (err) {
    console.error('Error fetching blacklist details:', err.message)
    return []
  }
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  removeFromBlacklist,
  getBlacklistCount,
  getBlacklistDetails,
}
