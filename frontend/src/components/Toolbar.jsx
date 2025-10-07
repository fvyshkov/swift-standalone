import React from 'react';

const Toolbar = ({ onAdd, onView, viewMode, onViewFiles, onDelete, hasSelectedJob }) => {
  return (
    <div style={styles.toolbar}>
      <button
        onClick={onAdd}
        style={styles.button}
        title="Add Job"
      >
        <i className="bi bi-plus-circle" style={styles.icon}></i>
      </button>
      <button
        onClick={onView}
        style={styles.button}
        title={viewMode === 'list' ? 'Job List' : 'View List'}
      >
        <i className="bi bi-list-ul" style={styles.icon}></i>
      </button>
      <button
        onClick={onViewFiles}
        style={{
          ...styles.button,
          ...(hasSelectedJob ? {} : styles.disabledButton)
        }}
        title="View Files"
        disabled={!hasSelectedJob}
      >
        <i className="bi bi-folder" style={styles.icon}></i>
      </button>
      <button
        onClick={onDelete}
        style={{
          ...styles.button,
          ...(hasSelectedJob ? {} : styles.disabledButton)
        }}
        title="Delete Job"
        disabled={!hasSelectedJob}
      >
        <i className="bi bi-trash" style={styles.icon}></i>
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
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  icon: {
    lineHeight: '1',
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    color: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.6,
  }
};

export default Toolbar;
