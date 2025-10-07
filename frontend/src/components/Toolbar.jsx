import React from 'react';

const Toolbar = ({ onAdd, onView, viewMode, onViewFiles, showFilesButton }) => {
  return (
    <div style={styles.toolbar}>
      <button onClick={onAdd} style={styles.button}>
        Add Job
      </button>
      <button
        onClick={onView}
        style={{...styles.button, ...styles.viewButton}}
      >
        {viewMode === 'list' ? 'Job List' : 'View'}
      </button>
      {showFilesButton && (
        <button onClick={onViewFiles} style={styles.button}>
          View Files
        </button>
      )}
    </div>
  );
};

const styles = {
  toolbar: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderBottom: '2px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#2196F3',
  }
};

export default Toolbar;
