import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { getClaims } from '../services/claim.service';
import { getToken } from '../utils/auth';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid
} from '@mui/material';
import Header from '../components/Header';

export default function Dashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await getClaims();
      
      // Ensure we're working with an array
      const claimsData = Array.isArray(data) ? data : [];
      
      // Normalize data structure with proper fallbacks
      const normalizedClaims = claimsData.map(claim => ({
        id: claim.id,
        patient_name: claim.patient_name || claim.patientName || 'Unknown',
        provider_name: claim.provider_name || claim.providerName || 'Unknown',
        diagnosis: claim.diagnosis || 'N/A',
        status: claim.status || 'pending',
        total_amount: claim.total_amount || claim.totalAmount || '0.00',
        created_at: claim.created_at || claim.createdAt || new Date().toISOString()
      }));
      
      setClaims(normalizedClaims);
      setError(null);
    } catch (err) {
      console.error('Claims fetch error:', err);
      setError(err.response?.data?.message || err.message);
      
      if (err.response?.status === 401) {
        logout();
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else {
        fetchClaims();
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const handleNewClaim = () => {
    router.push('/claims/upload');
  };

  const handleRefresh = () => {
    fetchClaims();
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Typography variant="h4" component="h1">
              Welcome, {user?.username || 'User'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Medical Claims Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNewClaim}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              New Claim
            </Button>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Refresh'}
            </Button>
          </Grid>
        </Grid>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
            action={
              error.includes('token') && (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={() => router.push('/auth/login')}
                >
                  Login Again
                </Button>
              )
            }
          >
            {error.includes('token') ? 'Session expired. Please login again.' : error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        ) : claims.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '300px',
            textAlign: 'center'
          }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No claims found
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleNewClaim}
            >
              Upload Your First Claim
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="claims table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow 
                    key={claim.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{claim.patient_name}</TableCell>
                    <TableCell>{claim.provider_name}</TableCell>
                    <TableCell>{claim.diagnosis || 'N/A'}</TableCell>
                    <TableCell>
                      <Box 
                        component="span"
                        sx={{
                          p: '4px 8px',
                          borderRadius: 1,
                          backgroundColor: 
                            claim.status === 'approved' ? 'success.light' :
                            claim.status === 'rejected' ? 'error.light' : 'warning.light',
                          color: 'common.white'
                        }}
                      >
                        {claim.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ${claim.total_amount ? parseFloat(claim.total_amount).toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(`/claims/${claim.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
}