import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

export const getJobs = async () => {
  const response = await axios.get(`${API_BASE_URL}/jobs`);
  return response.data;
};

export const getJob = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axios.post(`${API_BASE_URL}/jobs`, jobData);
  return response.data;
};

export const getJobFiles = async (jobId) => {
  const response = await axios.get(`${API_BASE_URL}/jobs/${jobId}/files`);
  return response.data;
};

export const updateFileStatus = async (fileId, status) => {
  const response = await axios.patch(`${API_BASE_URL}/files/${fileId}/status`, null, {
    params: { status }
  });
  return response.data;
};
