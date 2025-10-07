import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import JobFormToolbar from './components/JobFormToolbar';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import FileList from './components/FileList';
import { getJobs, createJob, deleteJob } from './api/jobs';

function App() {
  const [jobs, setJobs] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'files'
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+S / Ctrl+S - save form
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (viewMode === 'add') {
          handleSaveForm();
        }
      }

      // Escape - close forms (not file list, as file viewer modal handles its own escape)
      if (e.key === 'Escape') {
        if (viewMode === 'add') {
          handleCancelForm();
        }
      }

      // Arrow navigation in job list
      if (viewMode === 'list' && jobs.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = jobs.findIndex(j => j.id === selectedJob?.id);
          const nextIndex = currentIndex < jobs.length - 1 ? currentIndex + 1 : currentIndex;
          setSelectedJob(jobs[nextIndex]);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = jobs.findIndex(j => j.id === selectedJob?.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          setSelectedJob(jobs[prevIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, jobs, selectedJob]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      // Auto-select first job if available and in list view
      if (data.length > 0 && viewMode === 'list') {
        setSelectedJob(data[0]);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      alert('Failed to load jobs. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = () => {
    setViewMode('add');
  };

  const handleCancelForm = () => {
    setViewMode('list');
  };

  const handleSaveForm = () => {
    const form = document.getElementById('job-form');
    if (form) {
      form.requestSubmit();
    }
  };

  const handleSubmitJob = async (jobData) => {
    try {
      const newJob = await createJob(jobData);
      await loadJobs();
      setSelectedJob(newJob);
      setViewMode('list');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error creating job. Check folder paths.');
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleViewFiles = () => {
    if (selectedJob) {
      setViewMode('files');
    }
  };

  const handleDeleteJob = async () => {
    if (selectedJob) {
      try {
        await deleteJob(selectedJob.id);
        await loadJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job.');
      }
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    // Keep the selected job when returning from files view
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {viewMode === 'list' && (
        <>
          <Toolbar
            onAdd={handleAddJob}
            onViewFiles={handleViewFiles}
            onDelete={handleDeleteJob}
            hasSelectedJob={selectedJob !== null}
          />
          <JobList
            jobs={jobs}
            onJobClick={handleJobClick}
            selectedJobId={selectedJob?.id}
          />
        </>
      )}
      {viewMode === 'add' && (
        <>
          <JobFormToolbar
            onSave={handleSaveForm}
            onCancel={handleCancelForm}
          />
          <JobForm
            onSubmit={handleSubmitJob}
            lastJob={jobs.length > 0 ? jobs[0] : null}
          />
        </>
      )}
      {viewMode === 'files' && selectedJob && (
        <FileList
          jobId={selectedJob.id}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '20px',
    color: '#666',
  }
};

export default App;
