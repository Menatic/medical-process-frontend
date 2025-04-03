import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { useRouter } from 'next/router';

export default function ClaimCard({ claim }) {
  const router = useRouter();

  // Clean and normalize the claim data
  const cleanedClaim = cleanClaimData(claim);

  return (
    <Card sx={{ minWidth: 275, mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {cleanedClaim.patient_name || cleanedClaim.patientName}
        </Typography>
        <Typography sx={{ my: 1 }} color="text.secondary">
          <strong>Provider:</strong> {cleanedClaim.provider_name || cleanedClaim.providerName}
        </Typography>
        <Typography sx={{ mb: 1 }} color="text.secondary">
          <strong>Amount:</strong> ${cleanedClaim.total_amount || cleanedClaim.totalAmount}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StatusChip status={cleanedClaim.status} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push(`/claims/${claim.id}`)}
            fullWidth
            sx={{ py: 1 }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// Status Chip Component
function StatusChip({ status }) {
  const statusColors = {
    pending: { bgcolor: 'warning.light', color: 'warning.contrastText' },
    approved: { bgcolor: 'success.light', color: 'success.contrastText' },
    rejected: { bgcolor: 'error.light', color: 'error.contrastText' }
  };

  return (
    <Chip 
      label={status?.toUpperCase() || 'UNKNOWN'}
      sx={{ 
        ...statusColors[status] || {},
        fontWeight: 'bold'
      }}
    />
  );
}

// Data cleaning utility
export function cleanClaimData(claim) {
  if (!claim) return {};
  
  return {
    ...claim,
    patient_name: cleanTextField(claim.patient_name || claim.patientName),
    provider_name: cleanTextField(claim.provider_name || claim.providerName),
    total_amount: cleanAmountField(claim.total_amount || claim.totalAmount),
    status: claim.status || 'pending'
  };
}

function cleanTextField(text) {
  if (!text) return 'Not specified';
  return text.toString()
    .replace(/Patient ID/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanAmountField(amount) {
  const num = parseFloat(amount) || 0;
  return num.toFixed(2);
}