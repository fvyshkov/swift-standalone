# Swift Standalone - Job Management System

FastAPI + React application for managing file processing jobs.

## Features

- Create and manage jobs
- Process files from input to output folders
- Real-time updates via WebSockets
- File content viewer with syntax highlighting
- Error tracking

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, Socket.IO
- **Frontend**: React, Vite, Monaco Editor
- **Database**: SQLite (local) / PostgreSQL (production)

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deploy to Render

### Prerequisites
1. GitHub account
2. Render.com account
3. Push your code to GitHub

### Deployment Steps

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **On Render.com**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Configure Environment Variables** (in Render dashboard):
   
   For **Backend Service**:
   - `FRONTEND_URL`: `https://your-frontend-url.onrender.com`
   - `CORS_ORIGINS`: `https://your-frontend-url.onrender.com`
   
   For **Frontend Service**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com`

4. **Wait for Deploy** (5-10 minutes)

### Manual Setup (Alternative)

If you prefer manual setup instead of Blueprint:

#### Backend
1. New → Web Service
2. Connect repository
3. Settings:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Disk (1GB) at `/opt/render/project/src/data`

#### Frontend
1. New → Static Site
2. Connect repository  
3. Settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

#### Database
1. New → PostgreSQL
2. Name: `swift-standalone-db`
3. Copy connection string
4. Add to Backend service as `DATABASE_URL`

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI app
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # DB connection
│   ├── processor.py      # File processing logic
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── data/                 # File storage (gitignored)
│   ├── folder_in/
│   └── folder_out/
└── render.yaml          # Render.com configuration
```

## Environment Variables

### Backend
- `FRONTEND_URL`: Frontend URL for CORS
- `CORS_ORIGINS`: Comma-separated allowed origins
- `DATABASE_URL`: PostgreSQL connection string (Render provides this)

### Frontend
- `VITE_API_URL`: Backend API URL

## License

MIT
