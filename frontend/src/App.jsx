import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
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

  const handleViewList = () => {
    setViewMode('list');
    // Auto-select first job when returning to list
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  };

  const handleSubmitJob = async (jobData) => {
    try {
      await createJob(jobData);
      await loadJobs();
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
    if (selectedJob && window.confirm(`Delete job #${selectedJob.id}?`)) {
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
      <Toolbar
        onAdd={handleAddJob}
        onView={handleViewList}
        viewMode={viewMode}
        onViewFiles={handleViewFiles}
        onDelete={handleDeleteJob}
        hasSelectedJob={selectedJob !== null}
      />
      {viewMode === 'list' && (
        <JobList
          jobs={jobs}
          onJobClick={handleJobClick}
          selectedJobId={selectedJob?.id}
        />
      )}
      {viewMode === 'add' && (
        <JobForm
          onSubmit={handleSubmitJob}
          onCancel={handleViewList}
          lastJob={jobs.length > 0 ? jobs[0] : null}
        />
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
