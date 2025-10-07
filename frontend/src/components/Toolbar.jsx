import React from 'react';

const Toolbar = ({ onAdd, onViewFiles, onDelete, hasSelectedJob }) => {
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
    backgroundColor: 'white',
    color: '#2196F3',
    border: '2px solid white',
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
    backgroundColor: '#B0BEC5',
    color: '#fff',
    cursor: 'not-allowed',
    opacity: 0.5,
  }
};

export default Toolbar;
