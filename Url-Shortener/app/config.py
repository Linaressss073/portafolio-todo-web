from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    pg_dsn: str = "postgresql+asyncpg://admin:administrator@localhost:7070/app_db"
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl: int = 3600

    class Config:
        env_file = ".env"


settings = Settings()
