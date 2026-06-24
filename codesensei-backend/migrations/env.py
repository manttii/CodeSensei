"""
Alembic environment — CodeSensei
Reads DATABASE_URL from .env via pydantic-settings.
Imports app.models.Base so autogenerate detects all table changes.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Import our models so Alembic can see them for autogenerate ─────────────
from app.models import Base          # noqa: F401 — registers all ORM models
from app.config import settings      # reads .env

# Alembic Config object
config = context.config

# Override sqlalchemy.url with our settings value (ignores placeholder in .ini)
config.set_main_option("sqlalchemy.url", settings.database_url)

# Set up Python logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata for autogenerate comparisons
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Offline mode: emit SQL to stdout without a live DB connection."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Online mode: connect to the live DB and apply migrations."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,          # detect column type changes
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

