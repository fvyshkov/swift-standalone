import React from 'react';

const Toolbar = ({ onAdd, onView, viewMode, onViewFiles, hasSelectedJob }) => {
  return (
    <div style={styles.toolbar}>
      <button
        onClick={onAdd}
        style={styles.button}
        title="Add Job"
      >
        <span style={styles.icon}>➕</span>
      </button>
      <button
        onClick={onView}
        style={{...styles.button, ...styles.viewButton}}
        title={viewMode === 'list' ? 'Job List' : 'View List'}
      >
        <span style={styles.icon}>📋</span>
      </button>
      <button
        onClick={onViewFiles}
        style={{
          ...styles.button,
          ...styles.filesButton,
          ...(hasSelectedJob ? {} : styles.disabledButton)
        }}
        title="View Files"
        disabled={!hasSelectedJob}
      >
        <span style={styles.icon}>📁</span>
      </button>
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
    padding: '12px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  icon: {
    lineHeight: '1',
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  filesButton: {
    backgroundColor: '#FF9800',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  }
};

export default Toolbar;
