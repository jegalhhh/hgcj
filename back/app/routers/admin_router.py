from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from ..deps import get_db
from ..models import Donation, User
from ..schemas import DonationOut
from datetime import datetime
import os

router = APIRouter(prefix="/admin", tags=["admin"])

# 관리자 비밀번호 (환경변수 또는 기본값)
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "admin-secret-2025")

def verify_admin_secret(x_admin_secret: Optional[str] = Header(None)):
    """관리자 권한 확인 (Header 방식)"""
    if not x_admin_secret or x_admin_secret != ADMIN_SECRET:
        raise HTTPException(
            status_code=403, 
            detail="Admin access denied. Provide correct X-Admin-Secret header."
        )
    return True

@router.get("/donations/pending", response_model=List[dict])
def get_pending_donations(
    admin_verified: bool = Depends(verify_admin_secret),
    db: Session = Depends(get_db)
):
    """승인 대기 중인 기부 목록 조회"""
    
    # 미승인 기부 목록을 기부자 정보와 함께 조회
    pending_donations = (
        db.query(Donation, User)
        .join(User, Donation.user_id == User.id)
        .filter(Donation.verified == False)
        .order_by(Donation.created_at.desc())  # 최신순 정렬
        .all()
    )
    
    result = []
    for donation, user in pending_donations:
        result.append({
            "id": donation.id,
            "donor_name": user.name,  # 기부자명
            "donation_date": donation.created_at.isoformat(),  # 기부 일시
            "item_name": donation.item_name,  # 기부 물품
            "quantity": donation.quantity,  # 기부 수량
            "image_url": donation.image_url,  # 기부 사진
            "created_at": donation.created_at,
            "user_id": donation.user_id
        })
    
    return result

@router.post("/donations/{donation_id}/approve")
def approve_donation(
    donation_id: int,
    admin_verified: bool = Depends(verify_admin_secret),
    db: Session = Depends(get_db)
):
    """특정 기부 승인"""
    
    donation = db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.verified == False  # 미승인 상태만 승인 가능
    ).first()
    
    if not donation:
        raise HTTPException(
            status_code=404, 
            detail="Pending donation not found"
        )
    
    # 승인 처리
    donation.verified = True
    db.commit()
    db.refresh(donation)
    
    # 기부자 정보도 함께 반환
    user = db.query(User).get(donation.user_id)
    
    return {
        "message": "Donation approved successfully",
        "donation": {
            "id": donation.id,
            "donor_name": user.name if user else "Unknown",
            "item_name": donation.item_name,
            "quantity": donation.quantity,
            "verified": donation.verified,
            "approved_at": donation.created_at.isoformat()  # 생성 시간을 승인 시간으로 사용
        }
    }

@router.post("/donations/{donation_id}/reject")
def reject_donation(
    donation_id: int,
    admin_verified: bool = Depends(verify_admin_secret),
    db: Session = Depends(get_db)
):
    """특정 기부 거부 (삭제)"""
    
    donation = db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.verified == False
    ).first()
    
    if not donation:
        raise HTTPException(
            status_code=404, 
            detail="Pending donation not found"
        )
    
    # 기부자 정보 미리 저장
    user = db.query(User).get(donation.user_id)
    donor_name = user.name if user else "Unknown"
    
    # 기부 기록 삭제
    db.delete(donation)
    db.commit()
    
    return {
        "message": "Donation rejected and deleted successfully",
        "deleted_donation": {
            "id": donation_id,
            "donor_name": donor_name,
            "item_name": donation.item_name,
            "quantity": donation.quantity
        }
    }

