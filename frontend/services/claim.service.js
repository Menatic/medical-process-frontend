import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for auth token
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Add this at the top of the file
const handleResponse = (response) => {
  if (response.data && response.data.data) {
    return response.data.data;
  }
  return response.data || response;
};

/**
 * Get all claims for the current user
 */
export const getClaims = async () => {
  try {
    const response = await api.get('/claims');
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }
};

/**
 * Upload a new claim document
 */
export const uploadClaim = async (file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post('/claims/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload claim');
  }
};

/**
 * Get details of a specific claim by ID
 * (Alias for getClaimDetails for backward compatibility)
 */
export const getClaimById = async (id) => {
  try {
    const response = await api.get(`/claims/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching claim:', error);
    throw error;
  }
};

/**
 * Get details of a specific claim by ID
 */
export const getClaimDetails = async (id) => {
  try {
    const response = await api.get(`/claims/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching claim details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch claim details');
  }
};

/**
 * Update the status of a claim
 */
export const updateClaimStatus = async (id, status) => {
  try {
    const response = await api.patch(`/claims/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update claim status');
  }
};

export default {
  getClaims,
  uploadClaim,
  getClaimById,
  getClaimDetails,
  updateClaimStatus
};