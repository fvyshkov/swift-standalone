from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class FileStatus(str, enum.Enum):
    INIT = "init"
    ACTIVE = "active"
    SUCCESS = "success"
    ERROR = "error"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(SQLEnum(JobStatus), default=JobStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = Column(String, default="user@example.com")
    folder_in = Column(String)
    folder_out = Column(String)

    files = relationship("JobFile", back_populates="job", cascade="all, delete-orphan")

class JobFile(Base):
    __tablename__ = "job_files"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    filename = Column(String)
    filepath = Column(String)
    status = Column(SQLEnum(FileStatus), default=FileStatus.INIT)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="files")
