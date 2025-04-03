import { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import axios from 'axios';

export default function ClaimForm() {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await axios.post('/api/claims', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Claim submitted successfully!');
    } catch (err) {
      alert('Failed to submit claim: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Submit New Claim
      </Typography>
      
      <TextField
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        fullWidth
        margin="normal"
        required
        inputProps={{ accept: 'application/pdf,image/*' }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting || !file}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Processing...' : 'Submit Claim'}
      </Button>
    </Box>
  );
}