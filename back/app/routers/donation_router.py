from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user_id
from ..models import Donation
from ..schemas import DonationOut, StampSummary
import os, uuid, shutil

router = APIRouter(prefix="/donations", tags=["donations"])

@router.post("", response_model=DonationOut)
def create_donation(
    item_name: str = Form(...),
    quantity: int = Form(...),
    image: UploadFile | None = File(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    image_url = None
    if image:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(400, "Unsupported image type")
        os.makedirs("uploads", exist_ok=True)
        filename = f"{uuid.uuid4().hex}{ext}"
        path = os.path.join("uploads", filename)
        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/static/{filename}"

    donation = Donation(user_id=user_id, item_name=item_name, quantity=quantity, image_url=image_url, verified=False)
    db.add(donation); db.commit(); db.refresh(donation)
    return donation

@router.get("/me", response_model=list[DonationOut])
def my_donations(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return db.query(Donation).filter(Donation.user_id == user_id).order_by(Donation.created_at.desc()).all()

@router.get("/me/stamps", response_model=StampSummary)
def my_stamps(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    total = db.query(Donation).filter(Donation.user_id == user_id).count()
    verified = db.query(Donation).filter(Donation.user_id == user_id, Donation.verified == True).count()
    return {"total_donations": total, "verified_donations": verified}

@router.post("/{donation_id}/verify", response_model=DonationOut)
def verify_donation(donation_id: int, db: Session = Depends(get_db)):
    d = db.query(Donation).get(donation_id)
    if not d: raise HTTPException(404, "Not found")
    d.verified = True
    db.commit(); db.refresh(d)
    return d
