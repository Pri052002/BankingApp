import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; // Ensure this imports your Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Registration = () => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState(''); // Date of Birth
  const [phoneNumber, setPhoneNumber] = useState(''); // Phone Number
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !dob || !phoneNumber || !email || !password) {
      setSnackbarMessage("Please fill out all fields.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'AccountDetails', user.uid), {
        name,
        dob,
        phoneNumber,
        email,
        role: 'customer',
      });

      navigate('/loginpage'); // Adjust the path as needed
    } catch (error) {
      setSnackbarMessage('Registration failed: ' + error.message);
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
        boxShadow: 5,
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
        sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '30px', textTransform: 'uppercase' }}
      >
        Register for an Account
      </Typography>

      {/* Error Alert */}
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar>
      )}

      {/* Registration Form */}
      <Box component="form" sx={{ width: '100%' }}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          InputLabelProps={{ shrink: true }}
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
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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

        {/* Register Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
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
          {loading ? 'Registering...' : 'Register'}
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

export default Registration;
