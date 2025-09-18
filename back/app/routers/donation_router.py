from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..deps import get_db, get_current_user_id
from ..models import Donation
from ..schemas import DonationOut, StampSummary
import os, uuid, shutil

router = APIRouter(prefix="/donations", tags=["donations"])

@router.post("", response_model=DonationOut)
async def create_donation(
    item_name: str = Form(...),
    quantity: int = Form(...),
    image: UploadFile | None = File(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    print(f"=== DONATION START ===")
    print(f"Image provided: {image is not None}")
    if image:
        print(f"Image filename: {image.filename}")
        print(f"Image content_type: {image.content_type}")
    
    image_url = None
    if image:
        try:
            print(f"🖼️ Processing image: {image.filename}")
            
            # 파일 확장자 확인
            ext = os.path.splitext(image.filename)[1].lower()
            print(f"📁 File extension: {ext}")
            
            if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
                raise HTTPException(400, "Unsupported image type")
            
            # 파일 크기 확인
            image.file.seek(0, 2)
            file_size = image.file.tell()
            image.file.seek(0)
            
            print(f"📏 Image size: {file_size} bytes ({file_size/1024:.1f}KB)")
            
            if file_size > 5 * 1024 * 1024:  # 5MB로 증가
                raise HTTPException(400, f"File too large: {file_size/1024:.1f}KB (max 5MB)")
            
            # 이미지 압축 및 리사이즈
            print("🔄 Starting image processing...")
            import base64
            from PIL import Image
            import io
            
            # 원본 이미지 읽기
            file_content = await image.read()
            print(f"📖 Read {len(file_content)} bytes from file")
            
            # PIL로 이미지 열기
            pil_image = Image.open(io.BytesIO(file_content))
            print(f"🖼️ Original image: {pil_image.size} ({pil_image.mode})")
            
            # RGB로 변환 (RGBA나 다른 모드 대응)
            if pil_image.mode in ('RGBA', 'LA', 'P'):
                pil_image = pil_image.convert('RGB')
            
            # 이미지 리사이즈 (최대 1920x1920)
            max_size = 1920
            if pil_image.width > max_size or pil_image.height > max_size:
                pil_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                print(f"📐 Resized to: {pil_image.size}")
            
            # 압축된 이미지를 바이트로 변환
            output = io.BytesIO()
            # JPEG로 저장 (압축률 높음)
            pil_image.save(output, format='JPEG', quality=85, optimize=True)
            compressed_content = output.getvalue()
            print(f"🗜️ Compressed: {len(compressed_content)} bytes ({len(compressed_content)/1024:.1f}KB)")
            
            # Base64 인코딩
            base64_content = base64.b64encode(compressed_content).decode('utf-8')
            print(f"📝 Base64 encoded: {len(base64_content)} characters")
            
            # Base64 길이 제한 (5MB * 1.33 = 약 6.7MB Base64)
            if len(base64_content) > 6700000:  # 약 6.7MB Base64
                raise HTTPException(400, f"Image too large after encoding: {len(base64_content)} chars")
            
            image_url = f"data:image/jpeg;base64,{base64_content}"  # 항상 JPEG로 저장
            print(f"✅ Image URL created: data:image/{ext[1:]};base64,[{len(base64_content)} chars]")
            
        except HTTPException as he:
            print(f"❌ HTTP Exception: {he.detail}")
            raise
        except Exception as e:
            print(f"💥 Unexpected error: {str(e)}")
            print(f"Error type: {type(e)}")
            raise HTTPException(500, f"Image processing failed: {str(e)}")
    else:
        print("📷 No image provided")
    
    print(f"💾 Saving donation with image_url: {image_url[:50] + '...' if image_url else 'None'}")

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
