import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from '@mui/material';
import Header from '../../components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Basic client-side validation
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        email, 
        password 
      });
      
      setSuccess(response.data.message || 'User registered successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Signup failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5 }}
            >
              Sign Up
            </Button>
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Already have an account?{' '}
              <Button href="/auth/login" color="primary">
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}