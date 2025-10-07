import React, { useState, useEffect } from 'react';
import { getJobFiles } from '../api/jobs';
import FileToolbar from './FileToolbar';
import FileViewerModal from './FileViewerModal';

const FileList = ({ jobId, onBack }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const [hoveredFileId, setHoveredFileId] = useState(null);
  const [viewMode, setViewMode] = useState('input'); // 'input', 'output', 'error'

  useEffect(() => {
    loadFiles();
  }, [jobId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape - close file list (only when modal is not open)
      if (e.key === 'Escape' && !showViewer) {
        onBack();
        return;
      }

      // Arrow navigation in file list
      if (files.length > 0 && !showViewer) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = files.findIndex(f => f.id === selectedFile?.id);
          const nextIndex = currentIndex < files.length - 1 ? currentIndex + 1 : currentIndex;
          setSelectedFile(files[nextIndex]);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = files.findIndex(f => f.id === selectedFile?.id);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          setSelectedFile(files[prevIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, selectedFile, showViewer, onBack]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await getJobFiles(jobId);
      setFiles(data);
      // Auto-select first file
      if (data.length > 0) {
        setSelectedFile(data[0]);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US');
  };

  const getStateColor = (state) => {
    const colors = {
      init: '#9E9E9E',
      active: '#2196F3',
      success: '#4CAF50',
      error: '#F44336'
    };
    return colors[state] || '#999';
  };

  const getStateText = (state) => {
    const texts = {
      init: 'Init',
      active: 'Active',
      success: 'Success',
      error: 'Error'
    };
    return texts[state] || state;
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleViewFile = () => {
    if (selectedFile) {
      setViewMode('input');
      setShowViewer(true);
    }
  };

  const handleViewOut = () => {
    if (selectedFile && selectedFile.processed_at) {
      setViewMode('output');
      setShowViewer(true);
    }
  };

  const handleViewError = () => {
    if (selectedFile && selectedFile.error) {
      setViewMode('error');
      setShowViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  const canViewOut = selectedFile && selectedFile.content_out;
  const canViewError = selectedFile && selectedFile.error;

  const getRowStyle = (file) => {
    const isSelected = selectedFile?.id === file.id;
    const isHovered = hoveredFileId === file.id;

    return {
      ...styles.row,
      backgroundColor: isSelected ? '#e3f2fd' : (isHovered ? '#f5f5f5' : 'white'),
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading files...</div>;
  }

  return (
    <>
      <FileToolbar
        onViewFile={handleViewFile}
        onViewOut={handleViewOut}
        onViewError={handleViewError}
        onClose={onBack}
        onRefresh={loadFiles}
        hasSelectedFile={selectedFile !== null}
        canViewOut={canViewOut}
        canViewError={canViewError}
      />
      <div style={styles.container}>
        <h2 style={styles.title}>Files for Job #{jobId}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Filename</th>
              <th style={styles.th}>State</th>
              <th style={styles.th}>Error</th>
              <th style={styles.th}>Created At</th>
              <th style={styles.th}>Processed At</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  No files for this job
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  onMouseEnter={() => setHoveredFileId(file.id)}
                  onMouseLeave={() => setHoveredFileId(null)}
                  style={getRowStyle(file)}
                >
                  <td style={styles.td}>{file.id}</td>
                  <td style={styles.td}>{file.filename}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStateColor(file.state)
                      }}
                    >
                      {file.state === 'active' && (
                        <i className="bi bi-arrow-repeat" style={styles.spinner}></i>
                      )}
                      {' '}{getStateText(file.state)}
                    </span>
                  </td>
                  <td style={styles.td}>{file.error ? file.error.substring(0, 50) + '...' : '-'}</td>
                  <td style={styles.td}>{formatDate(file.created_at)}</td>
                  <td style={styles.td}>{file.processed_at ? formatDate(file.processed_at) : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showViewer && selectedFile && (
        <FileViewerModal file={selectedFile} onClose={handleCloseViewer} viewMode={viewMode} />
      )}
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    backgroundColor: 'white',
    padding: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: 'white',
    color: '#333',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
  },
  noData: {
    padding: '40px',
    textAlign: 'center',
    color: '#999',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  }
};

// Add keyframes for spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Ignore if already exists
}

export default FileList;
