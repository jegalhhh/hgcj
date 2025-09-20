from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user_id
from ..models import User, Donation
from ..schemas import UserMe

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserMe)
def me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """특정 사용자와 관련된 모든 데이터 삭제"""
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    # 사용자의 모든 기부 기록 삭제 (cascade로 자동 삭제되지만 명시적으로)
    donations_count = db.query(Donation).filter(Donation.user_id == user_id).count()
    db.query(Donation).filter(Donation.user_id == user_id).delete()
    
    # 사용자 삭제
    db.delete(user)
    db.commit()
    
    return {
        "message": f"User {user_id} deleted successfully",
        "deleted_donations": donations_count
    }

@router.delete("/{user_id}/donations")
def delete_user_donations(user_id: int, db: Session = Depends(get_db)):
    """특정 사용자의 모든 기부 기록만 삭제"""
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    donations_count = db.query(Donation).filter(Donation.user_id == user_id).count()
    db.query(Donation).filter(Donation.user_id == user_id).delete()
    db.commit()
    
    return {
        "message": f"All donations for user {user_id} deleted successfully",
        "deleted_donations": donations_count
    }
