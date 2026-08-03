from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    store_name: str = Field(..., min_length=2, max_length=160)
    store_type: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=120)
    business_category: str = Field(..., min_length=2, max_length=120)


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=80)


class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    store_name: str | None = Field(default=None, min_length=2, max_length=160)
    store_type: str | None = Field(default=None, min_length=2, max_length=100)
    location: str | None = Field(default=None, min_length=2, max_length=120)
    business_category: str | None = Field(default=None, min_length=2, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6, max_length=80)
    new_password: str = Field(..., min_length=6, max_length=80)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead