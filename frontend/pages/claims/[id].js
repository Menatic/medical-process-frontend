import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import { getClaimById } from '../../services/claim.service';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import Header from '../../components/Header';

export default function ClaimDetails() {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchClaim = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getClaimById(id);
        setClaim(data);
      } catch (error) {
        console.error('Error fetching claim:', error);
        setError(error.message || 'Failed to load claim details');
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id, isAuthenticated, router]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !claim) {
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Claim not found'}
        </Alert>
        <Button variant="contained" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Claim Details</Typography>
            <Chip 
              label={claim.status.toUpperCase()} 
              sx={{ 
                fontWeight: 'bold',
                bgcolor: claim.status === 'approved' ? 'success.light' : 
                         claim.status === 'rejected' ? 'error.light' : 'warning.light'
              }}
            />
          </Box>

          <List sx={{ width: '100%' }}>
            {/* Patient Information */}
            <ListItem divider>
              <ListItemText 
                primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Patient Information</Typography>}
                secondary={
                  <>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Name:</strong> {claim.patient_name || claim.patientName || 'Not specified'}
                    </Typography>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>ID:</strong> {claim.patient_id || claim.patientId || 'N/A'}
                    </Typography>
                  </>
                }
              />
            </ListItem>

            {/* Provider Information */}
            <ListItem divider>
              <ListItemText 
                primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Provider Information</Typography>}
                secondary={
                  <>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Name:</strong> {claim.provider_name || 'Not specified'}
                    </Typography>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>ID:</strong> {claim.provider_id || 'N/A'}
                    </Typography>
                  </>
                }
              />
            </ListItem>

            {/* Medical Information */}
            <ListItem divider>
              <ListItemText 
                primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Medical Information</Typography>}
                secondary={
                  <>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Diagnosis:</strong> {claim.diagnosis || 'N/A'}
                    </Typography>
                    {Array.isArray(claim.medications) && claim.medications.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography component="div" sx={{ fontWeight: '500' }}>
                          Medications:
                        </Typography>
                        {claim.medications.map((med, index) => (
                          <Typography key={index} component="div" sx={{ ml: 2 }}>
                            • {med.name} - {med.dosage} ({med.frequency})
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>

            {/* Financial Information */}
            <ListItem>
              <ListItemText 
                primary={<Typography variant="h6" sx={{ fontWeight: 'bold' }}>Financial Information</Typography>}
                secondary={
                  <>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Total Amount:</strong> ${claim.total_amount ? parseFloat(claim.total_amount).toFixed(2) : '0.00'}
                    </Typography>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Insurance Covered:</strong> ${claim.insurance_covered ? parseFloat(claim.insurance_covered).toFixed(2) : '0.00'}
                    </Typography>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Patient Responsibility:</strong> ${claim.patient_responsibility ? parseFloat(claim.patient_responsibility).toFixed(2) : '0.00'}
                    </Typography>
                    <Typography component="div" sx={{ mt: 1 }}>
                      <strong>Service Date:</strong> {claim.service_date || 'N/A'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          </List>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              sx={{ px: 4, py: 1.5 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}