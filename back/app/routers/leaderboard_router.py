from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, asc
from ..deps import get_db
from ..models import Donation, User
from ..schemas import LeaderboardEntry

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/top3", response_model=list[LeaderboardEntry])
def top3(db: Session = Depends(get_db)):
    subq = (
        db.query(
            Donation.user_id,
            func.count(Donation.id).label("cnt"),
            func.min(Donation.created_at).label("first_at")
        )
        .filter(Donation.verified == True)
        .group_by(Donation.user_id)
        .subquery()
    )
    q = (
        db.query(
            User.id.label("user_id"),
            User.name,
            User.profile_image_url,
            subq.c.cnt.label("total_count"),
            subq.c.first_at.label("first_donation_at"),
        )
        .join(subq, subq.c.user_id == User.id)
        .order_by(func.coalesce(subq.c.cnt, 0).desc(), asc(subq.c.first_at))
        .limit(3)
        .all()
    )
    return [
        LeaderboardEntry(
            user_id=row.user_id, name=row.name,
            profile_image_url=row.profile_image_url,
            total_count=row.total_count, first_donation_at=row.first_donation_at
        ) for row in q
    ]

@router.get("/all", response_model=list[LeaderboardEntry])
def all_board(db: Session = Depends(get_db)):
    subq = (
        db.query(
            Donation.user_id,
            func.count(Donation.id).label("cnt"),
            func.min(Donation.created_at).label("first_at")
        )
        .filter(Donation.verified == True)
        .group_by(Donation.user_id)
        .subquery()
    )
    q = (
        db.query(
            User.id.label("user_id"),
            User.name, User.profile_image_url,
            subq.c.cnt.label("total_count"),
            subq.c.first_at.label("first_donation_at"),
        )
        .join(subq, subq.c.user_id == User.id)
        .order_by(func.coalesce(subq.c.cnt, 0).desc(), asc(subq.c.first_at))
        .all()
    )
    return [
        LeaderboardEntry(
            user_id=row.user_id, name=row.name,
            profile_image_url=row.profile_image_url,
            total_count=row.total_count, first_donation_at=row.first_donation_at
        ) for row in q
    ]
