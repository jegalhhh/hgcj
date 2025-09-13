# main.py
from datetime import datetime, timezone, timedelta
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy import (create_engine, text, DateTime, ForeignKey, Integer,
                        Text, BigInteger)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker
from jose import JWTError, jwt
from passlib.hash import bcrypt

# 1) DB: 최초엔 SQLite 파일로 시작 (app.db 생성)
DATABASE_URL = "sqlite:///./app.db"  # 나중에 PostgreSQL로 바꿀 예정

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# JWT 설정
SECRET_KEY = "your-secret-key-here"  # 실제 운영에서는 환경변수로 관리
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 토큰 보안 설정
security = HTTPBearer()

class Base(DeclarativeBase):
    pass

# 2) 테이블 (아주 최소)
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    username: Mapped[str] = mapped_column(Text, unique=True, nullable=False)  # 아이디
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(Text, default="owner")  # owner, admin
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Business(Base):
    __tablename__ = "businesses"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)  # 사업자명
    phone: Mapped[str] = mapped_column(Text, nullable=False)  # 사업자 전화번호
    address: Mapped[str] = mapped_column(Text, nullable=False)  # 주소
    business_type: Mapped[str] = mapped_column(Text, nullable=False)  # 업종
    profile_image: Mapped[Optional[str]] = mapped_column(Text)  # 프로필 이미지 URL
    detail_images: Mapped[Optional[str]] = mapped_column(Text)  # 상세이미지 URLs (JSON 형태로 저장)
    description: Mapped[Optional[str]] = mapped_column(Text)  # 가게홍보문구
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Donation(Base):
    __tablename__ = "donations"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    business_id: Mapped[int] = mapped_column(ForeignKey("businesses.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    memo: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text, default="pending")  # pending, approved, rejected
    donated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    approved_by: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"))  # 승인한 관리자 ID
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text)  # 반려 사유

Base.metadata.create_all(engine)

# 성능 향상을 위한 인덱스 생성
def create_indexes():
    db = SessionLocal()
    try:
        # donations 테이블 인덱스
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_donations_biz_status_date 
            ON donations(business_id, status, donated_at DESC)
        """))
        
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_donations_status_date 
            ON donations(status, donated_at DESC)
        """))
        
        # businesses 테이블 인덱스
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_businesses_owner_id 
            ON businesses(owner_id)
        """))
        
        # users 테이블 인덱스
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_users_username 
            ON users(username)
        """))
        
        db.commit()
        print("인덱스 생성 완료")
    except Exception as e:
        print(f"인덱스 생성 중 오류: {e}")
    finally:
        db.close()

# 앱 시작 시 인덱스 생성
create_indexes()

# JWT 토큰 유틸리티 함수들
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않습니다.")

# 3) Pydantic 요청/응답 모델
class SignupIn(BaseModel):
    username: str  # 아이디
    password: str

class UserOut(BaseModel):
    id: int
    username: str  # 아이디
    role: str
    class Config:
        from_attributes = True

class BusinessCreateIn(BaseModel):
    name: str  # 사업자명
    phone: str  # 사업자 전화번호
    address: str  # 주소
    business_type: str  # 업종
    profile_image: Optional[str] = None  # 프로필 이미지 URL
    detail_images: Optional[str] = None  # 상세이미지 URLs (JSON 형태)
    description: Optional[str] = None  # 가게홍보문구

class BusinessOut(BaseModel):
    id: int
    owner_id: int
    name: str
    phone: str
    address: str
    business_type: str
    profile_image: Optional[str] = None
    detail_images: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class DonationCreateIn(BaseModel):
    business_id: int
    quantity: int = 1
    memo: Optional[str] = None
    donated_at: Optional[datetime] = None  # 없으면 서버가 지금 시간으로 저장

class LoginIn(BaseModel):
    username: str  # 아이디
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class RejectDonationIn(BaseModel):
    rejection_reason: str

app = FastAPI(title="기부 스탬프 데모")

# 4) 간단한 암호 해시 (데모용)
from passlib.hash import bcrypt

# 인증 의존성 함수
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    username = verify_token(token)
    
    db = SessionLocal()
    try:
        user = db.execute(
            text("SELECT id, username, role FROM users WHERE username=:u"),
            {"u": username}
        ).mappings().first()
        if user is None:
            raise HTTPException(status_code=401, detail="사용자를 찾을 수 없습니다.")
        return user
    finally:
        db.close()

def get_admin_user(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="관리자 권한이 필요합니다.")
    return current_user

# CORS (개발/초기용 설정)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/signup", response_model=UserOut)
def signup(payload: SignupIn):
    db = SessionLocal()
    try:
        # 아이디 중복 체크
        exists = db.execute(text("SELECT id FROM users WHERE username=:u"), {"u": payload.username}).first()
        if exists:
            raise HTTPException(400, "이미 사용 중인 아이디입니다.")
        ph = bcrypt.hash(payload.password)
        db.execute(
            text("INSERT INTO users(username, password_hash, role, created_at) VALUES (:u, :p, 'owner', :c)"),
            {"u": payload.username, "p": ph, "c": datetime.now(timezone.utc)},
        )
        db.commit()
        user_row = db.execute(text("SELECT id, username, role FROM users WHERE username=:u"), {"u": payload.username}).mappings().first()
        return user_row
    finally:
        db.close()

@app.post("/auth/login", response_model=Token)
def login(payload: LoginIn):
    db = SessionLocal()
    try:
        row = db.execute(
            text("SELECT id, username, name, role, password_hash FROM users WHERE username=:u"),
            {"u": payload.username},
        ).mappings().first()
        if not row or not bcrypt.verify(payload.password, row["password_hash"]):
            raise HTTPException(401, "아이디 또는 비밀번호가 올바르지 않습니다.")
        
        # 토큰 생성
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": row["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        db.close()

@app.get("/auth/me", response_model=UserOut)
def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/businesses", response_model=BusinessOut)
def create_business(payload: BusinessCreateIn, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        db.execute(
            text("""
                INSERT INTO businesses(owner_id, name, phone, address, business_type, 
                                     profile_image, detail_images, description, created_at) 
                VALUES (:oid, :nm, :phone, :addr, :type, :profile, :details, :desc, :created)
            """),
            {
                "oid": current_user["id"], 
                "nm": payload.name,
                "phone": payload.phone,
                "addr": payload.address,
                "type": payload.business_type,
                "profile": payload.profile_image,
                "details": payload.detail_images,
                "desc": payload.description,
                "created": datetime.now(timezone.utc)
            },
        )
        db.commit()
        # 생성된 business 정보 반환
        business_row = db.execute(
            text("SELECT * FROM businesses WHERE owner_id=:oid ORDER BY id DESC LIMIT 1"),
            {"oid": current_user["id"]}
        ).mappings().first()
        return business_row
    finally:
        db.close()

@app.get("/businesses")
def list_businesses(owner_id: Optional[int] = None, limit: int = 50, offset: int = 0, current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    try:
        if owner_id is None:
            rows = db.execute(
                text(
                    """
                    SELECT id, owner_id, name, phone, address, business_type, 
                           profile_image, detail_images, description, created_at
                    FROM businesses
                    ORDER BY id DESC
                    LIMIT :limit OFFSET :offset
                    """
                ),
                {"limit": limit, "offset": offset},
            ).mappings().all()
        else:
            rows = db.execute(
                text(
                    """
                    SELECT id, owner_id, name, phone, address, business_type, 
                           profile_image, detail_images, description, created_at
                    FROM businesses
                    WHERE owner_id = :oid
                    ORDER BY id DESC
                    LIMIT :limit OFFSET :offset
                    """
                ),
                {"oid": owner_id, "limit": limit, "offset": offset},
            ).mappings().all()
        return rows
    finally:
        db.close()

@app.get("/businesses/{business_id}/stats")
def business_stats(business_id: int):
    db = SessionLocal()
    try:
        stat = db.execute(
            text(
                """
                SELECT
                  COUNT(d.id) AS donation_count,
                  COALESCE(SUM(d.quantity), 0) AS total_quantity,
                  MIN(d.donated_at) AS first_donation_at,
                  MAX(d.donated_at) AS last_donation_at
                FROM donations d
                WHERE d.business_id = :bid AND d.status='approved'
                """
            ),
            {"bid": business_id},
        ).mappings().first()
        if stat is None:
            return {"donation_count": 0, "total_quantity": 0, "first_donation_at": None, "last_donation_at": None}
        return stat
    finally:
        db.close()

@app.post("/donations")
def create_donation(payload: DonationCreateIn, current_user: dict = Depends(get_current_user)):
    if payload.quantity < 1:
        raise HTTPException(400, "quantity는 1 이상이어야 합니다.")
    db = SessionLocal()
    try:
        donated_at = payload.donated_at or datetime.now(timezone.utc)
        now = datetime.now(timezone.utc)
        db.execute(
            text("""
                INSERT INTO donations(business_id, quantity, memo, status, donated_at, created_at)
                VALUES (:bid, :qty, :memo, 'pending', :dt, :created)
            """),
            {"bid": payload.business_id, "qty": payload.quantity, "memo": payload.memo, "dt": donated_at, "created": now},
        )
        db.commit()
        return {"ok": True}
    finally:
        db.close()

@app.post("/donations/{donation_id}/approve")
def approve_donation(donation_id: int, admin_user: dict = Depends(get_admin_user)):
    """관리자가 기부를 승인"""
    db = SessionLocal()
    try:
        # 기부 존재 및 상태 확인
        donation = db.execute(
            text("SELECT id, status FROM donations WHERE id=:did"),
            {"did": donation_id}
        ).mappings().first()
        
        if not donation:
            raise HTTPException(404, "기부를 찾을 수 없습니다.")
        
        if donation["status"] != "pending":
            raise HTTPException(400, f"이미 처리된 기부입니다. 현재 상태: {donation['status']}")
        
        # 승인 처리
        now = datetime.now(timezone.utc)
        db.execute(
            text("""
                UPDATE donations 
                SET status='approved', updated_at=:updated, approved_by=:admin_id
                WHERE id=:did
            """),
            {"updated": now, "admin_id": admin_user["id"], "did": donation_id}
        )
        db.commit()
        return {"ok": True, "message": "기부가 승인되었습니다."}
    finally:
        db.close()

@app.post("/donations/{donation_id}/reject")
def reject_donation(donation_id: int, payload: RejectDonationIn, admin_user: dict = Depends(get_admin_user)):
    """관리자가 기부를 반려"""
    db = SessionLocal()
    try:
        # 기부 존재 및 상태 확인
        donation = db.execute(
            text("SELECT id, status FROM donations WHERE id=:did"),
            {"did": donation_id}
        ).mappings().first()
        
        if not donation:
            raise HTTPException(404, "기부를 찾을 수 없습니다.")
        
        if donation["status"] != "pending":
            raise HTTPException(400, f"이미 처리된 기부입니다. 현재 상태: {donation['status']}")
        
        # 반려 처리
        now = datetime.now(timezone.utc)
        db.execute(
            text("""
                UPDATE donations 
                SET status='rejected', updated_at=:updated, approved_by=:admin_id, rejection_reason=:reason
                WHERE id=:did
            """),
            {"updated": now, "admin_id": admin_user["id"], "reason": payload.rejection_reason, "did": donation_id}
        )
        db.commit()
        return {"ok": True, "message": "기부가 반려되었습니다."}
    finally:
        db.close()

@app.get("/admin/donations/pending")
def get_pending_donations(limit: int = 50, offset: int = 0, admin_user: dict = Depends(get_admin_user)):
    """관리자용: 승인 대기 중인 기부 목록"""
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT d.id, d.business_id, d.quantity, d.memo, d.donated_at, d.created_at,
                       b.name as business_name, u.username as owner_username
                FROM donations d
                JOIN businesses b ON d.business_id = b.id
                JOIN users u ON b.owner_id = u.id
                WHERE d.status = 'pending'
                ORDER BY d.created_at ASC
                LIMIT :limit OFFSET :offset
            """),
            {"limit": limit, "offset": offset}
        ).mappings().all()
        return rows
    finally:
        db.close()

@app.get("/me/stamps")
def my_stamps(business_id: int, limit: int = 20, offset: int = 0, current_user: dict = Depends(get_current_user)):
    """내 스탬프(= 승인된 기부) 목록: 스탬프 날짜 포함"""
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT id AS stamp_id, donated_at AS stamp_date, quantity, memo
                FROM donations
                WHERE business_id = :bid AND status='approved'
                ORDER BY donated_at DESC
                LIMIT :limit OFFSET :offset
            """),
            {"bid": business_id, "limit": limit, "offset": offset},
        ).mappings().all()
        return rows
    finally:
        db.close()

@app.get("/my/summary")
def my_summary(current_user: dict = Depends(get_current_user)):
    """MyPage 요약: 소유한 각 매장의 기부 통계"""
    db = SessionLocal()
    try:
        rows = db.execute(
            text(
                """
                SELECT b.id AS business_id,
                       b.name AS business_name,
                       COUNT(d.id) AS donation_count,
                       COALESCE(SUM(d.quantity), 0) AS total_quantity,
                       MAX(d.donated_at) AS last_donation_at
                FROM businesses b
                LEFT JOIN donations d
                  ON d.business_id = b.id AND d.status='approved'
                WHERE b.owner_id = :oid
                GROUP BY b.id, b.name
                ORDER BY last_donation_at DESC NULLS LAST, b.id DESC
                """
            ),
            {"oid": current_user["id"]},
        ).mappings().all()
        return rows
    finally:
        db.close()

@app.get("/hall-of-fame")
def hall_of_fame(limit: int = 100, offset: int = 0):
    """명예의 전당: 기부 많이 한 순, 동률이면 최초 기부가 오래된 순"""
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT b.id AS business_id, b.name,
                       COUNT(d.id) AS donation_count,
                       MIN(d.donated_at) AS first_donation_at
                FROM businesses b
                JOIN donations d ON d.business_id = b.id AND d.status='approved'
                GROUP BY b.id, b.name
                ORDER BY donation_count DESC, first_donation_at ASC
                LIMIT :limit OFFSET :offset
            """),
            {"limit": limit, "offset": offset},
        ).mappings().all()
        return rows
    finally:
        db.close()
