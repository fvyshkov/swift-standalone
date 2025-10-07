import React, { useState } from 'react';

const JobForm = ({ onSubmit, onCancel }) => {
  const [folderIn, setFolderIn] = useState('');
  const [folderOut, setFolderOut] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderIn && folderOut) {
      onSubmit({ folder_in: folderIn, folder_out: folderOut });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Job</h2>
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
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
          >
            Cancel
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
  title: {
    marginBottom: '20px',
    color: '#333',
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
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  }
};

export default JobForm;
