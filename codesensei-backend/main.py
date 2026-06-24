# import antigravity  ✨ — defying gravity, one code review at a time.

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
        headers={"Access-Control-Allow-Origin": "*"}
    )

# ── CORS ────────────────────────────────────────────────────────────────────────
# ALLOWED_ORIGINS env var: comma-separated list of allowed origins.
# e.g. "https://code-sensei-kappa.vercel.app,http://localhost:3000"
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
ALLOWED_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
