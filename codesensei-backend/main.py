# import antigravity  ✨ — defying gravity, one code review at a time.

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.routers import auth, review
from app.database import engine, Base
from app.limiter import limiter

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: attempt DB table creation. Warn gracefully if DB not ready."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables verified / created.")
    except Exception as e:
        logger.warning(
            f"⚠️  Could not connect to database on startup: {e}\n"
            "   Start PostgreSQL (docker compose up -d) then restart the server."
        )
    yield
    # Shutdown logic can go here


app = FastAPI(
    title="CodeSensei API",
    description="AI-powered code review engine. Structured. Secure. Antigravity.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Rate Limiter ────────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(review.router, prefix="/api", tags=["Code Review"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "CodeSensei API",
        "status": "🚀 Operational",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
