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

  useEffect(() => {
    loadFiles();
  }, [jobId]);

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

  const getStatusColor = (status) => {
    const colors = {
      init: '#9E9E9E',
      active: '#2196F3',
      success: '#4CAF50',
      error: '#F44336'
    };
    return colors[status] || '#999';
  };

  const getStatusText = (status) => {
    const texts = {
      init: 'Init',
      active: 'Active',
      success: 'Success',
      error: 'Error'
    };
    return texts[status] || status;
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleViewFile = () => {
    if (selectedFile) {
      setShowViewer(true);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  const getRowStyle = (file) => {
    const isSelected = selectedFile?.id === file.id;
    const isHovered = hoveredFileId === file.id;

    return {
      ...styles.row,
      backgroundColor: isSelected ? '#e3f2fd' : (isHovered ? '#f5f5f5' : 'white'),
      fontWeight: isSelected ? 'bold' : 'normal',
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading files...</div>;
  }

  return (
    <>
      <FileToolbar
        onViewFile={handleViewFile}
        onClose={onBack}
        hasSelectedFile={selectedFile !== null}
      />
      <div style={styles.container}>
        <h2 style={styles.title}>Files for Job #{jobId}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Filename</th>
              <th style={styles.th}>Path</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
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
                  <td style={styles.td}>{file.filepath}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(file.status)
                      }}
                    >
                      {getStatusText(file.status)}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(file.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showViewer && selectedFile && (
        <FileViewerModal file={selectedFile} onClose={handleCloseViewer} />
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
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
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
  }
};

export default FileList;
