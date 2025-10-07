import React, { useState, useEffect } from 'react';

const JobList = ({ jobs, onJobClick, selectedJobId }) => {
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animation for processing state
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  const getStateColor = (state) => {
    const colors = {
      pending: '#FFA500',
      processing: '#2196F3',
      completed: '#4CAF50',
      error: '#F44336'
    };
    return colors[state] || '#999';
  };

  const getStateText = (state) => {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      error: 'Error'
    };
    return texts[state] || state;
  };

  const getStateBadgeStyle = (state) => {
    const baseStyle = {
      ...styles.statusBadge,
      backgroundColor: getStateColor(state),
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    };

    return baseStyle;
  };

  const renderStateContent = (state) => {
    if (state === 'processing') {
      return (
        <>
          <span style={styles.spinner}></span>
          {getStateText(state)}
        </>
      );
    }
    return getStateText(state);
  };

  const getFileStats = (job) => {
    const total = job.files?.length || 0;
    const processed = job.files?.filter(f => f.state === 'success' || f.state === 'error').length || 0;
    const errors = job.files?.filter(f => f.state === 'error').length || 0;
    return { total, processed, errors };
  };

  const getRowStyle = (job) => {
    const isSelected = selectedJobId === job.id;
    const isHovered = hoveredJobId === job.id;

    return {
      ...styles.row,
      backgroundColor: isSelected ? '#e3f2fd' : (isHovered ? '#f5f5f5' : 'white'),
    };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Job List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>State</th>
            <th style={styles.th}>Files Total</th>
            <th style={styles.th}>Processed</th>
            <th style={styles.th}>Error</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Folder In</th>
            <th style={styles.th}>Folder Out</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const stats = getFileStats(job);
            return (
              <tr
                key={job.id}
                onClick={() => onJobClick(job)}
                onMouseEnter={() => setHoveredJobId(job.id)}
                onMouseLeave={() => setHoveredJobId(null)}
                style={getRowStyle(job)}
              >
                <td style={styles.td}>{job.id}</td>
                <td style={styles.td}>
                  <span style={getStateBadgeStyle(job.state)}>
                    {renderStateContent(job.state)}
                  </span>
                </td>
                <td style={styles.td}>{stats.total}</td>
                <td style={styles.td}>{stats.processed}</td>
                <td style={styles.td}>{stats.errors}</td>
                <td style={styles.td}>{formatDate(job.created_at)}</td>
                <td style={styles.td}>{job.user}</td>
                <td style={styles.td}>{job.folder_in}</td>
                <td style={styles.td}>{job.folder_out}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    backgroundColor: 'white',
    padding: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: 'white',
    color: '#333',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  spinner: {
    width: '10px',
    height: '10px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  }
};

export default JobList;
