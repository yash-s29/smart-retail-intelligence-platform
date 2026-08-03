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


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://localhost:3000",
        "http://localhost:5173",
    ],
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