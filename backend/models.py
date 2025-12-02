# backend/models.py
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    birth_date = Column(Date)

    tracks = relationship(
        "Track",
        back_populates="student",
        cascade="all, delete-orphan",
    )


class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    student_id = Column(Integer, ForeignKey("students.id"))

    student = relationship("Student", back_populates="tracks")
