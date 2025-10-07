import React, { useState } from 'react';

const JobForm = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
    } else {
      alert('Please select a ZIP file');
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
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
    } else {
      alert('Please select a ZIP file');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form} id="job-form">
        <div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneActive : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          <i className="bi bi-cloud-upload" style={styles.uploadIcon}></i>
          {selectedFile ? (
            <div>
              <p style={styles.fileName}>{selectedFile.name}</p>
              <p style={styles.fileSize}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p style={styles.dropText}>Drag & drop ZIP file here</p>
              <p style={styles.orText}>or click to browse</p>
            </div>
          )}
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
  }
};

export default JobForm;
