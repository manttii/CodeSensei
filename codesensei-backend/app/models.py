"""
SQLAlchemy ORM Models for CodeSensei
─────────────────────────────────────
User          — registered accounts (email + bcrypt password)
CodeReview    — every AI review job, with SHA-256 hash for cache lookups
"""

import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship, DeclarativeBase


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
    )

    # One user → many reviews
    reviews = relationship(
        "CodeReview", back_populates="owner", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


class CodeReview(Base):
    __tablename__ = "code_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    original_code = Column(Text, nullable=False)
    language = Column(String(64), nullable=False)
    review_focus = Column(String(64), nullable=False, default="Full Audit")

    # SHA-256(code + ":" + review_focus) — used for cache dedup
    code_hash = Column(String(64), nullable=False, index=True)

    # Structured Gemini response: { vulnerabilities, performance_tips, refactored_code }
    ai_feedback_json = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
    )

    owner = relationship("User", back_populates="reviews")

    # Composite index: fast cache lookups scoped to user + hash
    __table_args__ = (
        Index("ix_code_reviews_user_hash", "user_id", "code_hash"),
    )

    def __repr__(self) -> str:
        return (
            f"<CodeReview id={self.id} user_id={self.user_id} "
            f"lang={self.language!r} focus={self.review_focus!r}>"
        )

