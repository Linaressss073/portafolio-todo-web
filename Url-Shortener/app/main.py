from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache import get_cached, set_cached
from app.db import Base, engine, get_session
from app.models import Url


class CreateUrlRequest(BaseModel):
    short_code: str
    target_url: HttpUrl


app = FastAPI()


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/{short_code}")
async def resolve_short_code(
    short_code: str,
    session: AsyncSession = Depends(get_session),
):
    cached = await get_cached(short_code)
    if cached:
        return {"target": cached, "cached": True}

    result = await session.execute(
        select(Url.target_url).where(Url.short_code == short_code)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    target_url = row[0]
    await set_cached(short_code, target_url)
    return {"target": target_url, "cached": False}


@app.post("/urls", status_code=status.HTTP_201_CREATED)
async def create_url(
    payload: CreateUrlRequest,
    session: AsyncSession = Depends(get_session),
):
    url = Url(short_code=payload.short_code, target_url=str(payload.target_url))
    session.add(url)
    try:
        await session.commit()
    except Exception:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="short_code already exists",
        )
    return {"short_code": payload.short_code}
