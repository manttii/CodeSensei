from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import Base  # single source of truth for metadata  # noqa: F401

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,        # reconnect if connection drops
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency — yields a DB session and ensures it closes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

