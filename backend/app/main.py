import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import Item, Visit


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    if db.query(Item).count() == 0:
        default_items = [
            Item(name="Docker", description="Container platform"),
            Item(name="GitHub Actions", description="CI/CD automation"),
            Item(name="FastAPI", description="Modern Python web framework"),
            Item(name="React", description="JavaScript UI library"),
            Item(name="PostgreSQL", description="Relational database"),
            Item(name="Caddy", description="Automatic HTTPS web server"),
        ]
        db.add_all(default_items)
        db.commit()
    db.close()
    yield


app = FastAPI(
    title="DevOps Backend API",
    description="Backend API for the Microservices CI/CD Pipeline",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")


class ItemCreate(BaseModel):
    name: str
    description: str | None = None


class ItemResponse(BaseModel):
    id: int
    name: str
    description: str | None

    class Config:
        from_attributes = True


@app.get("/")
async def root():
    return {"message": "DevOps Backend API", "status": "running"}


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(func.now())
        return {"status": "healthy", "database": "connected"}
    except Exception:
        raise HTTPException(status_code=503, detail="Database unavailable")


@app.get("/api/info")
async def get_info(
    user_agent: str | None = Header(default=None),
    db: Session = Depends(get_db),
):
    visit = Visit(path="/api/info", user_agent=user_agent)
    db.add(visit)
    db.commit()

    total_visits = db.query(Visit).count()

    return {
        "app": "Microservices CI/CD Pipeline",
        "version": "1.0.0",
        "environment": os.getenv("DEBUG", "false").lower() == "true"
        and "debug"
        or "production",
        "total_visits": total_visits,
    }


@app.get("/api/items", response_model=list[ItemResponse])
async def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@app.post("/api/items", response_model=ItemResponse, status_code=201)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.delete("/api/items/{item_id}", status_code=204)
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()


@app.get("/api/stats")
async def get_stats(db: Session = Depends(get_db)):
    return {
        "total_items": db.query(Item).count(),
        "total_visits": db.query(Visit).count(),
    }
