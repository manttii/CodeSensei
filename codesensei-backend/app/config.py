from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://codesensei:codesensei_secret@localhost:5432/codesensei_db"

    # JWT
    jwt_secret_key: str = "CHANGE_ME_generate_a_real_secret_key"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 10080  # 7 days

    # AI
    gemini_api_key: str = ""

    # App
    environment: str = "development"
    allowed_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
