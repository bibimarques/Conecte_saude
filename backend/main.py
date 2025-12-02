# backend/main.py
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
import models
import schemas


# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Conecte Saude API")


# CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ADMIN ----------------

@app.post("/admin/", response_model=schemas.AdminOut, status_code=status.HTTP_201_CREATED)
def create_admin(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    """Create a new admin"""
    existing = db.query(models.Admin).filter(models.Admin.email == admin.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An admin with this email already exists."
        )

    db_admin = models.Admin(**admin.dict())
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


@app.get("/admin/", response_model=List[schemas.AdminOut])
def list_admins(db: Session = Depends(get_db)):
    """Return all admins"""
    return db.query(models.Admin).all()


@app.get("/admin/{admin_id}", response_model=schemas.AdminOut)
def get_admin(admin_id: int, db: Session = Depends(get_db)):
    """Get one admin by ID"""
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found.")
    return admin


@app.put("/admin/{admin_id}", response_model=schemas.AdminOut)
def update_admin(admin_id: int, data: schemas.AdminUpdate, db: Session = Depends(get_db)):
    """Update admin profile"""
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found.")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(admin, field, value)

    db.commit()
    db.refresh(admin)
    return admin


@app.put("/admin/{admin_id}/password")
def update_admin_password(admin_id: int, data: schemas.AdminPasswordUpdate, db: Session = Depends(get_db)):
    """Update admin password"""
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found.")

    # Verify current password
    if admin.password != data.current_password:
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    admin.password = data.new_password
    db.commit()
    return {"message": "Password updated successfully."}


@app.delete("/admin/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin(admin_id: int, db: Session = Depends(get_db)):
    """Delete an admin"""
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found.")

    db.delete(admin)
    db.commit()
    return None


# ---------------- STUDENTS ----------------

@app.post("/students/", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    """Create a new student"""
    existing = db.query(models.Student).filter(models.Student.email == student.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A student with this email already exists."
        )

    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@app.get("/students/", response_model=List[schemas.StudentOut])
def list_students(db: Session = Depends(get_db)):
    """Return all students"""
    return db.query(models.Student).all()


@app.get("/students/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Get one student by ID"""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    return student


@app.put("/students/{student_id}", response_model=schemas.StudentOut)
def update_student(student_id: int, data: schemas.StudentUpdate, db: Session = Depends(get_db)):
    """Update a student"""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


@app.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Delete a student"""
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    db.delete(student)
    db.commit()
    return None


# ---------------- TRACKS ----------------

@app.post("/tracks/", response_model=schemas.TrackOut, status_code=status.HTTP_201_CREATED)
def create_track(track: schemas.TrackCreate, db: Session = Depends(get_db)):
    """Create a track, optionally associated with a student"""
    # Verify student exists if student_id is provided
    if track.student_id is not None:
        student = db.query(models.Student).filter(models.Student.id == track.student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")

    db_track = models.Track(**track.dict())
    db.add(db_track)
    db.commit()
    db.refresh(db_track)
    return db_track


@app.get("/tracks/", response_model=List[schemas.TrackOut])
def list_tracks(db: Session = Depends(get_db)):
    """List all tracks"""
    return db.query(models.Track).all()


@app.get("/tracks/{track_id}", response_model=schemas.TrackOut)
def get_track(track_id: int, db: Session = Depends(get_db)):
    """Get one track by ID"""
    track = db.query(models.Track).filter(models.Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found.")
    return track


@app.delete("/tracks/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_track(track_id: int, db: Session = Depends(get_db)):
    """Delete a track"""
    track = db.query(models.Track).filter(models.Track.id == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Track not found.")

    db.delete(track)
    db.commit()
    return None


# Root route
@app.get("/")
def root():
    return {"message": "Conecte Saude API is running!"}
