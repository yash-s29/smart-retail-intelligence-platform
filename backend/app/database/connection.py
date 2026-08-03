from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=False,
)


def test_database_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✅ PostgreSQL Connected Successfully")
        return True
    except Exception as e:
        print(f"❌ PostgreSQL Connection Failed: {e}")
        return False