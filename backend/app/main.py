import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DevOps Backend API",
    description="Backend API for the Microservices CI/CD Demo",
    version="1.0.0",
)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "DevOps Backend API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/api/info")
async def get_info():
    return {
        "app": "Microservices CI/CD Demo",
        "version": "1.0.0",
        "environment": "debug" if os.getenv("DEBUG", "false").lower() == "true" else "production",
    }


@app.get("/api/items")
async def get_items():
    return {
        "items": [
            {"id": 1, "name": "Docker", "description": "Container platform"},
            {"id": 2, "name": "GitHub Actions", "description": "CI/CD automation"},
            {"id": 3, "name": "FastAPI", "description": "Modern Python web framework"},
            {"id": 4, "name": "React", "description": "JavaScript UI library"},
        ]
    }
