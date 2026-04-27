import { Redis } from 'ioredis';

// Allow a fallback if no REDIS_URL is provided, or provide a simple in-memory cache for MVP if Redis isn't running
const globalForRedis = global as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  (process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : new Redis({ host: 'localhost', port: 6379, maxRetriesPerRequest: null, retryStrategy: () => null }));

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Simple in-memory fallback cache just in case Redis fails locally
const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn('Redis failed, falling back to memory cache:', error);
    const cached = memoryCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 900): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.warn('Redis failed, falling back to memory cache:', error);
    memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}
