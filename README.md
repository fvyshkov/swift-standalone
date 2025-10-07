# Job Manager - FastAPI + React SPA

Application for managing jobs with automatic file loading from folders.

## Project Structure

```
swift-standalone/
├── backend/           # FastAPI server
│   ├── main.py       # API endpoints
│   ├── models.py     # SQLAlchemy models
│   ├── schemas.py    # Pydantic schemas
│   ├── database.py   # Database configuration
│   └── requirements.txt
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api/        # API client
│   │   └── types/      # Data types
│   └── package.json
└── data/
    ├── folder_in/    # Input files
    └── folder_out/   # Output files
```

## Features

### Jobs
- **Statuses**: pending, processing, completed, error
- **Fields**: ID, creation date, user, folder_in, folder_out
- When creating a job, all files from folder_in are automatically loaded

### Files
- **Statuses**: init, active, success, error
- **Fields**: ID, filename, path, status, creation date
- Each file is linked to a job
- Created in "init" status by default

### Interface
- **Toolbar**: Icon buttons with tooltips - "Add Job", "Job List", "View Files"
- **Job List**: Table with all jobs, click to select
- **Create Form**: Input paths for folder_in and folder_out (pre-filled from last job)
- **File List**: View files for selected job

## Installation and Running

### Backend (FastAPI)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

Server will be available at http://localhost:8001

### Frontend (React)

```bash
# Navigate to frontend folder (in new terminal)
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Application will be available at http://localhost:3000

## Usage

1. Create test files in `data/folder_in/` folder:
   ```bash
   echo "test 1" > data/folder_in/file1.txt
   echo "test 2" > data/folder_in/file2.txt
   ```

2. Open application in browser: http://localhost:3000

3. Click ➕ icon and enter paths:
   - Folder In: `data/folder_in`
   - Folder Out: `data/folder_out`

4. After job creation, files will be automatically loaded from folder_in

5. Click on a job in the list to select it, then click 📁 icon to view files

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{job_id}` - Get job by ID
- `POST /api/jobs` - Create new job
- `GET /api/jobs/{job_id}/files` - Get job files
- `PATCH /api/files/{file_id}/status` - Update file status

## Database

SQLite database `jobs.db` is created automatically on first run.

Tables:
- `jobs` - jobs
- `job_files` - job files (one-to-many relationship)
