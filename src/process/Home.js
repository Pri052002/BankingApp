import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="xl"
      sx={{
        textAlign: 'center',
        marginTop: '100px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: 3,
        backgroundColor: '#ffffff',
        background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
        minHeight: '100vh',
        paddingBottom: '40px',
      }}
    >
      {/* Hero Section */}
      <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        Welcome to PD Bank
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: '#555', marginBottom: '20px' }}>
        A revolutionary banking platform that offers a seamless and user-friendly experience.
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/register')}
          sx={{
            marginRight: 2,
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Register
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/loginpage')}
          sx={{
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '16px',
            border: '2px solid #1976d2',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              border: '2px solid #1565c0',
            },
          }}
        >
          Login
        </Button>
      </Box>

      {/* Info Section */}
      <Box
        sx={{
          marginTop: 4,
          padding: '30px',
          borderRadius: '8px',
          backgroundColor: '#e8eaf6',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Experience Modern Banking
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', marginTop: 2 }}>
          Experience secure and efficient banking solutions tailored to your needs. 
          Our platform provides you with tools to manage your finances effectively, 
          from checking your balance to applying for loans with ease.
        </Typography>
      </Box>

      {/* Key Features */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Key Features</Typography>
        <Grid container spacing={4} sx={{ marginTop: 4 }}>
          {/* Feature 1 */}
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Secure Banking</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: 2 }}>
                Our platform ensures all your financial data is encrypted and protected.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Instant Transactions</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: 2 }}>
                Transfer money seamlessly between accounts in seconds, anytime, anywhere.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Easy Loan Application</Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: 2 }}>
                Apply for loans effortlessly and get quick approvals for your needs.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          marginTop: 6,
          padding: '30px',
          borderRadius: '8px',
          backgroundColor: '#bbdefb',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Ready to take control of your financial future?
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', marginTop: 2 }}>
          Join PD Bank today and start managing your money smarter, safer, and faster.
        </Typography>
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{
              padding: '12px 24px',
              borderRadius: '20px',
              fontSize: '16px',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Join Now
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
