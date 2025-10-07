import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const FileViewerModal = ({ file, onClose, viewMode = 'input' }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('plaintext');

  useEffect(() => {
    loadFileContent();
  }, [file, viewMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getLanguageFromFilename = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const languageMap = {
      'json': 'json',
      'xml': 'xml',
      'html': 'html',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'css': 'css',
      'scss': 'scss',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'txt': 'plaintext',
    };
    return languageMap[ext] || 'plaintext';
  };

  const getContentForViewMode = () => {
    switch (viewMode) {
      case 'output':
        return file.content_out || 'No output content available';
      case 'error':
        return file.error || 'No error message';
      case 'input':
      default:
        return null; // Will load from API
    }
  };

  const loadFileContent = async () => {
    try {
      setLoading(true);

      // For output and error modes, use content from file object
      const contentFromMode = getContentForViewMode();
      if (contentFromMode !== null) {
        setContent(contentFromMode);
        setLanguage(viewMode === 'output' ? 'xml' : 'plaintext');
        setLoading(false);
        return;
      }

      // For input mode, load from API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await fetch(`${API_URL}/api/files/${file.id}/content`);
      const text = await response.text();
      setContent(text);
      setLanguage(getLanguageFromFilename(file.filename));
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

  const getModalTitle = () => {
    const modeLabel = {
      'input': 'Input',
      'output': 'Output',
      'error': 'Error'
    }[viewMode] || 'Input';
    return `${file.filename} - ${modeLabel}`;
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{getModalTitle()}</h3>
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
          ) : (
            <Editor
              height="600px"
              language={language}
              value={content}
              theme="vs-light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                folding: true,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '1200px',
    height: 'auto',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
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
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  }
};

export default FileViewerModal;
