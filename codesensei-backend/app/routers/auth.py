"""
Authentication Router — CodeSensei
────────────────────────────────────
POST /api/auth/register — hash password, create user, set JWT cookie
POST /api/auth/login    — verify credentials, set httpOnly JWT cookie
GET  /api/auth/me       — return current user profile (requires auth)
POST /api/auth/logout   — clear the auth cookie
"""

import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

router = APIRouter()

# ── Password Hashing ────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT Utilities ───────────────────────────────────────────────────────────
COOKIE_NAME = "codesensei_token"


def create_access_token(user_id: int, email: str) -> str:
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        minutes=settings.jwt_access_token_expire_minutes
    )
    payload = {"sub": str(user_id), "email": email, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )


def _set_auth_cookie(response: Response, token: str) -> None:
    """Attach the JWT as an httpOnly, Secure, SameSite=Lax cookie."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.environment != "development",  # False in dev (no HTTPS)
        samesite="lax",
        max_age=settings.jwt_access_token_expire_minutes * 60,
        path="/",
    )


# ── Dependency: get current user from cookie ────────────────────────────────
def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in.",
        )
    payload = decode_access_token(token)
    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
        )
    return user


# ── Schemas ─────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = {"str_strip_whitespace": True}


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


# ── Endpoints ────────────────────────────────────────────────────────────────
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new account",
)
async def register(
    payload: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    if len(payload.password) < 8:
        raise HTTPException(
            status_code=422, detail="Password must be at least 8 characters."
        )
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    _set_auth_cookie(response, token)
    return user


@router.post("/login", response_model=UserResponse, summary="Log in")
async def login(
    payload: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    token = create_access_token(user.id, user.email)
    _set_auth_cookie(response, token)
    return user


@router.get("/me", response_model=UserResponse, summary="Get current user")
async def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout", summary="Log out")
async def logout(response: Response):
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"message": "Logged out successfully."}
