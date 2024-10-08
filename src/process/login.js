import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Import Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(''); // Reset error state
    try {
      // Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'AccountDetails', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check user role and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/admin-page'); // Navigate to Admin Dashboard
        } else if (userData.role === 'customer') {
          navigate('/customer-page'); // Navigate to Customer Dashboard
        } else {
          setSnackbarMessage('Login failed: Unknown user role.');
          setSnackbarOpen(true);
        }
      } else {
        setSnackbarMessage('No user data found in the system.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Login failed: ' + error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: '50px',
        padding: '20px',
        boxShadow: 3,
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh', // Center vertically
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '30px' }}
      >
        Login into Your Account
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Login Form */}
      <Box component="form" sx={{ width: '100%' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#3f51b5',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#3f51b5',
              },
              '&:hover fieldset': {
                borderColor: '#1976d2',
              },
            },
          }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            padding: '12px',
            borderRadius: '20px',
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default Login;
