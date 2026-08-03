"""Apply the project SQL migrations in filename order.

Run with: .\\.venv\\Scripts\\python.exe scripts\\apply_migrations.py
"""
from pathlib import Path
import sys

from sqlalchemy import text

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.database.connection import engine


def main() -> None:
    migrations_dir = BACKEND_DIR / "database" / "migrations"
    with engine.begin() as connection:
        for migration in sorted(migrations_dir.glob("*.sql")):
            print(f"Applying {migration.name}")
            connection.execute(text(migration.read_text(encoding="utf-8")))
    print("Database migrations completed.")


if __name__ == "__main__":
    main()
