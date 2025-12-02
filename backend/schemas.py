# backend/schemas.py
from datetime import date, datetime
from pydantic import BaseModel


# ---------------- ADMIN ----------------

class AdminBase(BaseModel):
    name: str
    email: str
    role: str | None = None


class AdminCreate(AdminBase):
    password: str


class AdminUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    role: str | None = None


class AdminPasswordUpdate(BaseModel):
    current_password: str
    new_password: str


class AdminOut(AdminBase):
    id: int
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True


# ---------------- TRACK ----------------

class TrackBase(BaseModel):
    name: str
    description: str | None = None


class TrackCreate(TrackBase):
    student_id: int | None = None


class TrackOut(TrackBase):
    id: int
    student_id: int | None = None

    class Config:
        from_attributes = True  # pydantic v2


# ---------------- STUDENT ----------------

class StudentBase(BaseModel):
    name: str
    email: str
    phone: str | None = None
    birth_date: date | None = None


class StudentCreate(StudentBase):
    password: str


class StudentUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    birth_date: date | None = None


class StudentOut(StudentBase):
    id: int
    tracks: list[TrackOut] = []

    class Config:
        from_attributes = True
