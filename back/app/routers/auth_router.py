from fastapi import APIRouter, Depends, HTTPException, UploadFile, Form
from sqlalchemy.orm import Session
from ..models import User
from ..schemas import UserCreate, UserLogin, Token, UserMe
from ..auth import hash_password, verify_password, create_access_token
from ..deps import get_db
import os, uuid, shutil

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserMe)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.name == data.name).first():
        raise HTTPException(400, "Name already exists")
    user = User(name=data.name, password_hash=hash_password(data.password))
    db.add(user); db.commit(); db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == data.name).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token)

@router.post("/profile-image", response_model=UserMe)
def upload_profile_image(
    file: UploadFile,
    user_id: int = Form(...),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(400, "Unsupported image type")
    filename = f"{uuid.uuid4().hex}{ext}"
    os.makedirs("uploads", exist_ok=True)
    path = os.path.join("uploads", filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user.profile_image_url = f"/static/{filename}"
    db.commit(); db.refresh(user)
    return user
