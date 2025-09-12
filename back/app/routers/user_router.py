from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user_id
from ..models import User
from ..schemas import UserMe

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserMe)
def me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user
