import React, { useState } from 'react';

const JobForm = ({ onSubmit }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles) {
      onSubmit(selectedFiles);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  // Get folder name from first file path
  const getFolderName = () => {
    if (!selectedFiles || selectedFiles.length === 0) return '';
    const firstFile = selectedFiles[0];
    // Try to extract folder name from webkitRelativePath
    if (firstFile.webkitRelativePath) {
      const parts = firstFile.webkitRelativePath.split('/');
      return parts[0]; // First part is folder name
    }
    return 'uploaded-files';
  };

  const folderIn = selectedFiles ? `data/folder_in/${getFolderName()}` : '';
  const folderOut = selectedFiles ? `data/folder_out/${getFolderName()}` : '';

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form} id="job-form">
        <div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneActive : {}),
            ...(selectedFiles ? { padding: '30px 20px' } : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFiles && document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            multiple
            webkitdirectory=""
            directory=""
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {!selectedFiles ? (
            <>
              <i className="bi bi-folder2-open" style={styles.uploadIcon}></i>
              <p style={styles.dropText}>Select folder with files</p>
              <p style={styles.orText}>or drag & drop files here</p>
            </>
          ) : (
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={styles.selectedInfo}>
                <i className="bi bi-check-circle-fill" style={styles.checkIcon}></i>
                <span>{selectedFiles.length} files selected ({(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            </div>
          )}
        </div>

        {selectedFiles && (
          <div style={styles.pathsContainer}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Folder In:</label>
              <input
                type="text"
                value={folderIn}
                readOnly
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Folder Out:</label>
              <input
                type="text"
                value={folderOut}
                readOnly
                style={styles.input}
              />
            </div>
          </div>
        )}
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
  dropZone: {
    border: '3px dashed #ddd',
    borderRadius: '8px',
    padding: '60px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: '#fafafa',
  },
  dropZoneActive: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  fileInput: {
    display: 'none',
  },
  uploadIcon: {
    fontSize: '48px',
    color: '#2196F3',
    marginBottom: '20px',
  },
  dropText: {
    fontSize: '18px',
    color: '#333',
    margin: '10px 0',
    fontWeight: 'bold',
  },
  orText: {
    fontSize: '14px',
    color: '#999',
    margin: '5px 0',
  },
  fileName: {
    fontSize: '16px',
    color: '#333',
    margin: '10px 0',
    fontWeight: 'bold',
  },
  fileSize: {
    fontSize: '14px',
    color: '#666',
    margin: '5px 0',
  },
  pathsContainer: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    color: '#666',
  },
  selectedInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
  },
  checkIcon: {
    fontSize: '24px',
    color: '#4CAF50',
  }
};

export default JobForm;
