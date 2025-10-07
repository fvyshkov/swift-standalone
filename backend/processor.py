import threading
import time
import random
import shutil
from pathlib import Path
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from models import FileState, JobState
import asyncio
from datetime import datetime

def process_job_files(job_id: int, sio=None):
    """Background processor for job files with 5-second delay and 50/50 success/error rate"""
    db = SessionLocal()
    try:
        job = db.query(models.Job).filter(models.Job.id == job_id).first()
        if not job:
            return

        folder_out = Path(job.folder_out)
        folder_out.mkdir(parents=True, exist_ok=True)

        files = db.query(models.JobFile).filter(models.JobFile.job_id == job_id).all()

        for file in files:
            # Set file to active
            file.state = FileState.ACTIVE
            db.commit()

            # Notify clients
            if sio:
                asyncio.run(sio.emit('job_updated', {'job_id': job_id}))

            # Wait 5 seconds to simulate processing
            time.sleep(5)

            # 50/50 chance of success or error
            success = random.choice([True, False])

            source_path = Path(file.filepath)
            dest_path = folder_out / file.filename

            # Always copy the source file to output folder
            try:
                shutil.copy2(source_path, dest_path)
            except Exception as copy_error:
                print(f"Error copying file {file.filename}: {copy_error}")

            if success:
                # Success - wrap content in XML
                xml_content = f'<result>{file.content}</result>'
                file.content_out = xml_content
                file.error = None
                file.state = FileState.SUCCESS
            else:
                # Error - write error message
                error_message = f"Error processing file: {file.filename}\nSimulated error for demonstration purposes."
                file.content_out = None
                file.error = error_message
                file.state = FileState.ERROR

                # Create error file in output folder
                error_file_path = folder_out / f"{source_path.stem}_error.txt"
                with open(error_file_path, 'w') as f:
                    f.write(error_message)

            # Set processed timestamp
            file.processed_at = datetime.utcnow()
            db.commit()

            # Notify clients
            if sio:
                asyncio.run(sio.emit('job_updated', {'job_id': job_id}))

        # Job state is now calculated automatically from file states

    except Exception as e:
        print(f"Error processing job {job_id}: {e}")
    finally:
        db.close()


def start_job_processing(job_id: int, sio=None):
    """Start job processing in a background thread"""
    thread = threading.Thread(target=process_job_files, args=(job_id, sio))
    thread.daemon = True
    thread.start()
