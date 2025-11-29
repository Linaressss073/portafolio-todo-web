import redis.asyncio as redis

from app.config import settings


redis_client = redis.from_url(
    settings.redis_url,
    encoding="utf-8",
    decode_responses=True,
)


async def get_cached(short_code: str):
    return await redis_client.get(short_code)


async def set_cached(short_code: str, url: str):
    await redis_client.set(short_code, url, ex=settings.cache_ttl)
