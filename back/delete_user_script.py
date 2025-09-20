#!/usr/bin/env python3
"""
사용자 삭제 스크립트
사용법: python delete_user_script.py <user_id>
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User, Donation

def delete_user_and_donations(user_id: int):
    db = SessionLocal()
    try:
        # 사용자 확인
        user = db.query(User).get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return
        
        print(f"👤 Found user: {user.name} (ID: {user_id})")
        
        # 기부 기록 수 확인
        donations_count = db.query(Donation).filter(Donation.user_id == user_id).count()
        print(f"📦 Found {donations_count} donations")
        
        # 확인
        confirm = input(f"⚠️  Delete user '{user.name}' and {donations_count} donations? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Cancelled")
            return
        
        # 기부 기록 삭제
        if donations_count > 0:
            db.query(Donation).filter(Donation.user_id == user_id).delete()
            print(f"🗑️  Deleted {donations_count} donations")
        
        # 사용자 삭제
        db.delete(user)
        db.commit()
        
        print(f"✅ User {user_id} deleted successfully")
        
    except Exception as e:
        db.rollback()
        print(f"💥 Error: {e}")
    finally:
        db.close()

def delete_donations_only(user_id: int):
    db = SessionLocal()
    try:
        # 사용자 확인
        user = db.query(User).get(user_id)
        if not user:
            print(f"❌ User {user_id} not found")
            return
        
        print(f"👤 Found user: {user.name} (ID: {user_id})")
        
        # 기부 기록 수 확인
        donations_count = db.query(Donation).filter(Donation.user_id == user_id).count()
        print(f"📦 Found {donations_count} donations")
        
        if donations_count == 0:
            print("ℹ️  No donations to delete")
            return
        
        # 확인
        confirm = input(f"⚠️  Delete {donations_count} donations for user '{user.name}'? (y/N): ")
        if confirm.lower() != 'y':
            print("❌ Cancelled")
            return
        
        # 기부 기록 삭제
        db.query(Donation).filter(Donation.user_id == user_id).delete()
        db.commit()
        
        print(f"✅ Deleted {donations_count} donations")
        
    except Exception as e:
        db.rollback()
        print(f"💥 Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법:")
        print("  python delete_user_script.py <user_id>           # 사용자와 기부기록 모두 삭제")
        print("  python delete_user_script.py <user_id> donations # 기부기록만 삭제")
        sys.exit(1)
    
    try:
        user_id = int(sys.argv[1])
        
        if len(sys.argv) > 2 and sys.argv[2] == "donations":
            delete_donations_only(user_id)
        else:
            delete_user_and_donations(user_id)
            
    except ValueError:
        print("❌ User ID must be a number")
        sys.exit(1)
