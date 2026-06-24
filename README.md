# CodeSensei ⚡

> AI-powered code review engine. Structured. Secure. Antigravity.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql)](https://postgresql.org)
[![Gemini](https://img.shields.io/badge/Gemini-1.5--flash-4285F4?logo=google)](https://ai.google.dev)

---

## ✨ Features

- 🧠 **AI Code Analysis** — Powered by Google Gemini 1.5 Flash
- 🔐 **Secure Auth** — JWT in `httpOnly` cookies, bcrypt passwords
- ⚡ **SHA-256 Caching** — Skips Gemini for identical submissions
- 🛡️ **Rate Limiting** — 3 req/min · 20 req/day per IP (slowapi)
- 🔒 **Prompt Injection Hardened** — User code wrapped in XML tags
- 📝 **Monaco Editor** — VS Code Dark+ theme in the browser
- 🐳 **Docker Portability** — One-command PostgreSQL setup

## 🏗️ Architecture

```
CodeSensei/
├── codesensei-frontend/    ← Next.js 15 · TypeScript · Tailwind CSS v4
└── codesensei-backend/     ← Python FastAPI · PostgreSQL · Alembic
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.11+, Docker Desktop

### 1. Backend

```bash
cd codesensei-backend

# Start PostgreSQL
docker compose up -d

# Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — add your GEMINI_API_KEY and generate a JWT_SECRET_KEY

# Run database migrations
alembic upgrade head

# Start server
uvicorn main:app --reload
# → http://localhost:8000/docs
```

### 2. Frontend

```bash
cd codesensei-frontend

npm install
npm run dev
# → http://localhost:3000
```

## 🔑 Environment Variables

Copy `codesensei-backend/.env.example` → `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Random 32-byte hex secret |
| `GEMINI_API_KEY` | [Get yours here](https://aistudio.google.com/app/apikey) |

Generate a secure JWT secret:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 🛡️ Security

| Vector | Mitigation |
|---|---|
| Prompt Injection | `<user_code>` XML isolation + strict instructions |
| XSS / CSRF | `httpOnly`, `SameSite=Lax` cookie |
| SQL Injection | SQLAlchemy ORM parameterized queries |
| API Quota Exhaustion | SHA-256 response caching |
| Rate Abuse | slowapi: 3/min · 20/day |
| Context Overflow | 8,000 char hard cap (frontend + Pydantic) |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login + set cookie |
| `GET` | `/api/auth/me` | Current user |
| `POST` | `/api/auth/logout` | Clear cookie |
| `POST` | `/api/review` | Submit code for AI review |
| `GET` | `/api/reviews` | Review history |
| `GET` | `/api/reviews/{id}` | Single review detail |

---

> `# import antigravity` ✨ — defying gravity, one code review at a time.
