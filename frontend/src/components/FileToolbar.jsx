import React from 'react';

const FileToolbar = ({ onViewFile, onClose, hasSelectedFile }) => {
  return (
    <div style={styles.toolbar}>
      <button
        onClick={onViewFile}
        style={{
          ...styles.button,
          ...(hasSelectedFile ? {} : styles.disabledButton)
        }}
        title="View File"
        disabled={!hasSelectedFile}
      >
        <i className="bi bi-eye" style={styles.icon}></i>
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

export default FileToolbar;
