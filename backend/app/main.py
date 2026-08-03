from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app import models
from app.api import (
    auth,
    forecast,
    inventory,
    products,
    reports,
    sales,
    users,
    ai_manager,
)
from app.core.config import settings
from app.database.connection import Base, engine
from app.api import ai_manager


# Create Database Tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Smart Retail Intelligence Platform API",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------
# settings.frontend_origin can be a single URL or a comma-separated
# list of URLs (e.g. "https://myapp.vercel.app,https://myapp-iota.vercel.app")
_extra_origins = []
if settings.frontend_origin:
    _extra_origins = [
        origin.strip()
        for origin in settings.frontend_origin.split(",")
        if origin.strip()
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        *_extra_origins,
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    # Matches any Vercel preview/production URL for this project,
    # e.g. https://smart-retail-intelligence-platform-iota.vercel.app
    # and https://smart-retail-intelligence-platform-<hash>.vercel.app
    allow_origin_regex=r"https://smart-retail-intelligence-platform.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Startup Event
@app.on_event("startup")
def startup_event():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        print("\n" + "=" * 60)
        print("🚀 Smart Retail Intelligence Platform API Started")
        print("✅ PostgreSQL Connected Successfully")
        print(f"🌐 API URL : http://127.0.0.1:8000")
        print(f"📚 Swagger : http://127.0.0.1:8000/docs")
        print("=" * 60 + "\n")

    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ DATABASE CONNECTION FAILED")
        print(str(e))
        print("=" * 60 + "\n")


# Routers
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(users.router, prefix=settings.api_prefix)
app.include_router(products.router, prefix=settings.api_prefix)
app.include_router(inventory.router, prefix=settings.api_prefix)
app.include_router(sales.router, prefix=settings.api_prefix)
app.include_router(forecast.router, prefix=settings.api_prefix)
app.include_router(reports.router, prefix=settings.api_prefix)
app.include_router(ai_manager.router, prefix=settings.api_prefix)


# Root Endpoint
@app.get("/")
def root():
    return {
        "success": True,
        "message": "Smart Retail Intelligence Platform API Running",
        "version": "1.0.0",
    }


# Health Check Endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "api": "running",
    }
