from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# 데이터베이스별 연결 설정
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif settings.DATABASE_URL.startswith("postgresql"):
    connect_args = {"sslmode": "require"}
else:
    connect_args = {}

try:
    engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base = declarative_base()
    print(f"Database engine created successfully for: {settings.DATABASE_URL.split('@')[0]}@***")
except Exception as e:
    print(f"Database engine creation failed: {e}")
    raise
