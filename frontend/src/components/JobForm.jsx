import React, { useState, useEffect } from 'react';

const JobForm = ({ onSubmit, onCancel, lastJob }) => {
  const [folderIn, setFolderIn] = useState('');
  const [folderOut, setFolderOut] = useState('');

  useEffect(() => {
    if (lastJob) {
      setFolderIn(lastJob.folder_in || '');
      setFolderOut(lastJob.folder_out || '');
    }
  }, [lastJob]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderIn && folderOut) {
      onSubmit({ folder_in: folderIn, folder_out: folderOut });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Create New Job</h2>
        <button onClick={onCancel} style={styles.closeButton} title="Close" type="button">
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Folder In:</label>
          <input
            type="text"
            value={folderIn}
            onChange={(e) => setFolderIn(e.target.value)}
            style={styles.input}
            placeholder="Path to input folder"
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Folder Out:</label>
          <input
            type="text"
            value={folderOut}
            onChange={(e) => setFolderOut(e.target.value)}
            style={styles.input}
            placeholder="Path to output folder"
            required
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  closeButton: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
  },
  submitButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  }
};

export default JobForm;
