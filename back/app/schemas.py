from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=6, max_length=64)

class UserLogin(BaseModel):
    name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserMe(BaseModel):
    id: int
    name: str
    profile_image_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class DonationCreate(BaseModel):
    item_name: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1)

class DonationOut(BaseModel):
    id: int
    item_name: str
    quantity: int
    image_url: Optional[str]
    verified: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class LeaderboardEntry(BaseModel):
    user_id: int
    name: str
    profile_image_url: Optional[str]
    total_count: int
    first_donation_at: datetime

class StampSummary(BaseModel):
    total_donations: int
    verified_donations: int
