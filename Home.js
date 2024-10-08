// Home.js
import React from 'react';
import { Button, Container, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Navigate to respective login pages
  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleCustomerLogin = () => {
    navigate('/customer-login');
  };

  const handleCustomerRegister = () => {
    navigate('/customer-register');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to XYZ Bank
        </Typography>
        <Typography variant="h6" gutterBottom>
          Manage your accounts securely and efficiently.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 5 }}>
        {/* Admin Login Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: 2, // Added shadow for depth
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)', // Lift effect on hover
              },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Admin Login
            </Typography>
            <Typography variant="body1" gutterBottom>
              Manage customers, banks, and set account limits.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAdminLogin}
              sx={{
                mt: 2, // Margin top for spacing
                '&:hover': {
                  bgcolor: '#1976d2', // Darker on hover
                },
              }}
            >
              Admin Login
            </Button>
          </Box>
        </Grid>

        {/* Customer Login Section */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              p: 3,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h5" gutterBottom>
              Customer Login
            </Typography>
            <Typography variant="body1" gutterBottom>
              Access your account and manage your portfolio.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleCustomerLogin}
              sx={{
                mb: 2,
                '&:hover': {
                  bgcolor: '#d32f2f', // Darker on hover
                },
              }}
            >
              Customer Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCustomerRegister}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)', // Light effect on hover
                },
              }}
            >
              Register as a Customer
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
