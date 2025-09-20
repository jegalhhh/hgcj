from fastapi import FastAPI
import os

app = FastAPI(title="Simple Test App")

@app.get("/")
def read_root():
    return {
        "message": "Hello World",
        "port": os.getenv("PORT", "8080"),
        "secret_key_exists": bool(os.getenv("SECRET_KEY")),
        "database_url": os.getenv("DATABASE_URL", "not_set")
    }

@app.get("/health")
def health():
    return {"status": "ok"}
