from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from models import JobState, FileState

class JobFileBase(BaseModel):
    filename: str
    filepath: str

class JobFileCreate(JobFileBase):
    pass

class JobFile(JobFileBase):
    id: int
    job_id: int
    state: FileState
    content: Optional[str] = None
    content_out: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    folder_in: str
    folder_out: str

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    state: JobState
    created_at: datetime
    user: str
    files: List[JobFile] = []

    class Config:
        from_attributes = True
