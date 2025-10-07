import React from 'react';

const FileToolbar = ({ onViewFile, onViewOut, onViewError, onClose, onRefresh, hasSelectedFile, canViewOut, canViewError }) => {
  return (
    <div style={styles.toolbar}>
      <button
        onClick={onViewFile}
        style={{
          ...styles.button,
          ...(hasSelectedFile ? {} : styles.disabledButton)
        }}
        title="View Input File"
        disabled={!hasSelectedFile}
      >
        <i className="bi bi-eye" style={styles.icon}></i>
      </button>
      <button
        onClick={onViewOut}
        style={{
          ...styles.button,
          ...(canViewOut ? {} : styles.disabledButton)
        }}
        title="View Output File"
        disabled={!canViewOut}
      >
        <i className="bi bi-file-earmark-text" style={styles.icon}></i>
      </button>
      <button
        onClick={onViewError}
        style={{
          ...styles.button,
          ...(canViewError ? {} : styles.disabledButton)
        }}
        title="View Error"
        disabled={!canViewError}
      >
        <i className="bi bi-exclamation-triangle" style={styles.icon}></i>
      </button>
      <button
        onClick={onRefresh}
        style={styles.button}
        title="Refresh"
      >
        <i className="bi bi-arrow-clockwise" style={styles.icon}></i>
      </button>
      <button
        onClick={onClose}
        style={styles.button}
        title="Close"
      >
        <i className="bi bi-x-lg" style={styles.icon}></i>
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

export default FileToolbar;
