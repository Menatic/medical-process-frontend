import { Container, Typography, Button, Box } from '@mui/material';
import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Medical Claim Processor
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Streamline your medical claim processing with our AI-powered system.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/auth/login"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button variant="outlined" color="primary" size="large" href="/dashboard">
            View Claims
          </Button>
        </Box>
      </Container>
    </>
  );
}