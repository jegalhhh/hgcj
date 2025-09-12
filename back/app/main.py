from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import Base, engine
from .routers import auth_router, donation_router, user_router, leaderboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Donation App (MVP)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 또는 ["*"] (개발만)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.mount("/static", StaticFiles(directory="uploads"), name="static")

app.include_router(auth_router.router)
app.include_router(donation_router.router)
app.include_router(user_router.router)
app.include_router(leaderboard_router.router)
