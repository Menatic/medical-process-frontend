import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { uploadClaim } from '../../services/claim.service';
import api from '../../services/api';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import Header from '../../components/Header';

export default function UploadClaim() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPEG, or PNG file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
        setError('Please select a file to upload');
        return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
        const formData = new FormData();
        formData.append('document', file);

        console.log('Uploading file:', file.name, file.type, file.size);
        
        const response = await api.post('/claims/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 60000 // Increased timeout for AI processing
        });

        console.log('Upload response:', response.data);

        if (response.data.success) {
            setSuccess('Claim uploaded successfully! Redirecting...');
            setTimeout(() => router.push('/dashboard'), 2000);
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    } catch (err) {
        console.error('Full error details:', err);
        let errorMsg = 'Upload failed';
        
        if (err.response) {
            errorMsg = `Error ${err.response.status}: ${err.response.data?.message || 'Unknown server error'}`;
        } else if (err.message.includes('timeout')) {
            errorMsg = 'Request timed out - try again';
        } else if (err.message.includes('Network Error')) {
            errorMsg = 'Network error - check your connection';
        }
        
        setError(errorMsg);
    } finally {
        setLoading(false);
    }
};

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Upload Medical Claim
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <input
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" fullWidth sx={{ mb: 2 }}>
                {file ? file.name : 'Select File'}
              </Button>
            </label>
            
            {file && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!file || loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload Claim'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}