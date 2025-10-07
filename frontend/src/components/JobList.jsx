import React from 'react';

const JobList = ({ jobs, onJobClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      processing: '#2196F3',
      completed: '#4CAF50',
      error: '#F44336'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      error: 'Error'
    };
    return texts[status] || status;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Job List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Created At</th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Folder In</th>
            <th style={styles.th}>Folder Out</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => onJobClick(job)}
              style={styles.row}
            >
              <td style={styles.td}>{job.id}</td>
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(job.status)
                  }}
                >
                  {getStatusText(job.status)}
                </span>
              </td>
              <td style={styles.td}>{formatDate(job.created_at)}</td>
              <td style={styles.td}>{job.user}</td>
              <td style={styles.td}>{job.folder_in}</td>
              <td style={styles.td}>{job.folder_out}</td>
            </tr>
          ))}
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
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
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
  }
};

export default JobList;
