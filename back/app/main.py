from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import Base, engine
from .routers import auth_router, donation_router, user_router, leaderboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Donation App (MVP)", version="1.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://hgcj-front.vercel.app",
        "https://hgcj-472606.web.app",
        "https://hgcj-472606.firebaseapp.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# uploads 디렉토리가 존재할 때만 마운트 (로컬 개발용)
import os
if os.path.exists("uploads") and not os.getenv("VERCEL"):
    app.mount("/static", StaticFiles(directory="uploads"), name="static")

app.include_router(auth_router.router)
app.include_router(donation_router.router)
app.include_router(user_router.router)
app.include_router(leaderboard_router.router)
