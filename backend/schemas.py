# backend/schemas.py
from datetime import date
from pydantic import BaseModel


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
