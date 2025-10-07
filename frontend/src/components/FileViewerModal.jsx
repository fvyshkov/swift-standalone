import React, { useState, useEffect } from 'react';
import JsonView from '@uiw/react-json-view';

const FileViewerModal = ({ file, onClose }) => {
  const [content, setContent] = useState('');
  const [isJson, setIsJson] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFileContent();
  }, [file]);

  const loadFileContent = async () => {
    try {
      setLoading(true);
      // Read file content from the server
      const response = await fetch(`http://localhost:8001/api/files/${file.id}/content`);
      const text = await response.text();
      setContent(text);

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(text);
        setJsonData(parsed);
        setIsJson(true);
      } catch {
        setIsJson(false);
      }
    } catch (error) {
      console.error('Error loading file:', error);
      setContent('Error loading file content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{file.filename}</h3>
          <div style={styles.actions}>
            <button onClick={handleCopy} style={styles.button} title="Copy to clipboard">
              <i className="bi bi-clipboard"></i>
            </button>
            <button onClick={onClose} style={styles.closeButton} title="Close">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>Loading...</div>
          ) : isJson ? (
            <JsonView
              value={jsonData}
              collapsed={1}
              style={styles.jsonView}
            />
          ) : (
            <pre style={styles.pre}>{content}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ddd',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },
  pre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  jsonView: {
    fontSize: '14px',
    fontFamily: 'monospace',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  }
};

export default FileViewerModal;
