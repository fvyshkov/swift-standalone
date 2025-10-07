from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from typing import List
import os
from pathlib import Path
import socketio
import zipfile
import shutil

import models
import schemas
from database import engine, get_db
from models import JobState, FileState
from processor import start_job_processing

# Create tables
models.Base.metadata.create_all(bind=engine)

# Get CORS origins from environment variable or use default
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", f"{FRONTEND_URL},http://localhost:3000,http://localhost:5173").split(",")

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=CORS_ORIGINS
)

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio, app)

@app.get("/api/jobs", response_model=List[schemas.Job])
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).order_by(models.Job.created_at.desc()).all()
    return jobs

@app.get("/api/jobs/{job_id}", response_model=schemas.Job)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.post("/api/jobs", response_model=schemas.Job)
async def create_job(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    # Base data directory
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)

    # Create job
    db_job = models.Job(
        folder_in="",  # Will be set after saving files
        folder_out="",  # Will be set after saving files
        user="user@example.com"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    # Create job-specific folders
    job_folder_in = data_dir / "folder_in" / str(db_job.id)
    job_folder_out = data_dir / "folder_out" / str(db_job.id)
    job_folder_in.mkdir(parents=True, exist_ok=True)
    job_folder_out.mkdir(parents=True, exist_ok=True)

    # Update job with actual paths
    db_job.folder_in = str(job_folder_in)
    db_job.folder_out = str(job_folder_out)
    db.commit()

    # Save uploaded files
    for uploaded_file in files:
        # Save file to folder_in
        file_path = job_folder_in / uploaded_file.filename

        # Create subdirectories if needed (preserve folder structure)
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # Save file
        with open(file_path, "wb") as buffer:
            content = await uploaded_file.read()
            buffer.write(content)

        # Read file content for database
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                file_content = f.read()
        except Exception as e:
            print(f"Error reading file {file_path}: {e}")
            file_content = ""

        # Add to database
        db_file = models.JobFile(
            job_id=db_job.id,
            filename=uploaded_file.filename,
            filepath=str(file_path),
            content=file_content,
            state=FileState.INIT
        )
        db.add(db_file)

    db.commit()
    db.refresh(db_job)

    # Start background processing
    start_job_processing(db_job.id, sio)

    return db_job

@app.get("/api/jobs/{job_id}/files", response_model=List[schemas.JobFile])
def get_job_files(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job.files

@app.patch("/api/files/{file_id}/state")
def update_file_state(file_id: int, state: FileState, db: Session = Depends(get_db)):
    db_file = db.query(models.JobFile).filter(models.JobFile.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    db_file.state = state
    db.commit()
    db.refresh(db_file)
    return db_file

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}

@app.get("/api/files/{file_id}/content", response_class=PlainTextResponse)
def get_file_content(file_id: int, db: Session = Depends(get_db)):
    db_file = db.query(models.JobFile).filter(models.JobFile.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    # Return content from database
    return db_file.content or ""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8001)
