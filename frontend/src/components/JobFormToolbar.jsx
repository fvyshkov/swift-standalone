import React from 'react';

const JobFormToolbar = ({ onSave, onCancel }) => {
  return (
    <div style={styles.toolbar}>
      <button
        onClick={onSave}
        style={styles.button}
        title="Save Job"
      >
        <i className="bi bi-floppy" style={styles.icon}></i>
      </button>
      <button
        onClick={onCancel}
        style={styles.button}
        title="Cancel"
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
  }
};

export default JobFormToolbar;
