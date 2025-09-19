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
async def upload_profile_image(
    file: UploadFile,
    user_id: int = Form(...),
    db: Session = Depends(get_db),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(400, "Unsupported image type")
    
    # 파일 크기 제한 (5MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(400, "File too large (max 5MB)")
    
    # 이미지 압축 및 리사이즈 (프로필용)
    import base64
    from PIL import Image
    import io
    
    # 원본 이미지 읽기
    file_content = await file.read()
    
    # PIL로 이미지 열기
    pil_image = Image.open(io.BytesIO(file_content))
    
    # RGB로 변환
    if pil_image.mode in ('RGBA', 'LA', 'P'):
        pil_image = pil_image.convert('RGB')
    
    # 프로필 이미지는 작게 리사이즈 (512x512)
    max_size = 512
    if pil_image.width > max_size or pil_image.height > max_size:
        pil_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    
    # 압축된 이미지를 바이트로 변환
    output = io.BytesIO()
    pil_image.save(output, format='JPEG', quality=90, optimize=True)
    compressed_content = output.getvalue()
    
    # Base64 인코딩
    base64_content = base64.b64encode(compressed_content).decode('utf-8')
    profile_image_url = f"data:image/jpeg;base64,{base64_content}"

    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user.profile_image_url = profile_image_url
    db.commit(); db.refresh(user)
    return user
