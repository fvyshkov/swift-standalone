from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class JobState(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"

class FileState(str, enum.Enum):
    INIT = "init"
    ACTIVE = "active"
    SUCCESS = "success"
    ERROR = "error"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = Column(String, default="user@example.com")
    folder_in = Column(String)
    folder_out = Column(String)

    files = relationship("JobFile", back_populates="job", cascade="all, delete-orphan")

    @property
    def state(self):
        """Calculate job state based on file states"""
        if not self.files:
            return JobState.PENDING

        file_states = [f.state for f in self.files]

        # If all files are in final state (success or error), job is finished
        if all(s in [FileState.SUCCESS, FileState.ERROR] for s in file_states):
            return JobState.COMPLETED

        # Otherwise job is processing
        return JobState.PROCESSING

class JobFile(Base):
    __tablename__ = "job_files"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    filename = Column(String)
    filepath = Column(String)
    content = Column(Text)  # Input file content
    content_out = Column(Text)  # Output content (XML wrapped or empty)
    error = Column(Text)  # Error message if any
    state = Column(SQLEnum(FileState), default=FileState.INIT)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)  # When processing finished

    job = relationship("Job", back_populates="files")
