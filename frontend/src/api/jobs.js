import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const getJobs = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/jobs`);
  return response.data;
};

export const getJob = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}`);
  return response.data;
};

export const createJob = async (files) => {
  const formData = new FormData();

  // If files is an array, append each file
  if (Array.isArray(files)) {
    files.forEach(file => {
      formData.append('files', file);
    });
  } else {
    // Single file (for backward compatibility)
    formData.append('files', files);
  }

  const response = await axios.post(`${API_BASE_URL}/api/jobs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getJobFiles = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/api/jobs/${jobId}/files`);
  return response.data;
};

export const updateFileStatus = async (fileId, status) => {
  const response = await axios.patch(`${API_BASE_URL}/api/files/${fileId}/status`, null, {
    params: { status }
  });
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await axios.delete(`${API_BASE_URL}/api/jobs/${jobId}`);
  return response.data;
};
