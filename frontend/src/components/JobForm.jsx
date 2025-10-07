import React, { useState, useEffect } from 'react';

const JobForm = ({ onSubmit, lastJob }) => {
  const defaultFolderIn = '/Users/fvyshkov/PycharmProjects/swift-standalone/data/folder_in';
  const defaultFolderOut = '/Users/fvyshkov/PycharmProjects/swift-standalone/data/folder_out';

  const [folderIn, setFolderIn] = useState(defaultFolderIn);
  const [folderOut, setFolderOut] = useState(defaultFolderOut);

  useEffect(() => {
    if (lastJob) {
      setFolderIn(lastJob.folder_in || defaultFolderIn);
      setFolderOut(lastJob.folder_out || defaultFolderOut);
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
      <h2 style={styles.title}>Create New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form} id="job-form">
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
  }
};

export default JobForm;
