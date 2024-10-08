import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Snackbar, CircularProgress, Alert } from '@mui/material';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const Loan = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleApplyForLoan = async () => {
    if (!loanAmount || !loanPurpose) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(''); // Reset error
    try {
      const userId = auth.currentUser.uid;
      await setDoc(doc(db, 'loans', userId), {
        loanAmount,
        loanPurpose,
        status: 'pending', // Default status
        userId,
      });

      setSnackbarMessage('Loan application submitted successfully!');
      setSnackbarOpen(true);
      setLoanAmount('');
      setLoanPurpose('');
    } catch (error) {
      console.error('Error applying for loan:', error);
      setError('Failed to apply for loan: ' + error.message);
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
        padding: '30px',
        boxShadow: 2,
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '30px' }}
      >
        Apply for Loan
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Loan Application Form */}
      <Box component="form" sx={{ mb: 2 }}>
        <TextField
          label="Loan Amount"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
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
          label="Purpose of Loan"
          variant="outlined"
          fullWidth
          margin="normal"
          value={loanPurpose}
          onChange={(e) => setLoanPurpose(e.target.value)}
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
          onClick={handleApplyForLoan}
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
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Apply for Loan'}
        </Button>
      </Box>

      {/* Additional Information */}
      <Box sx={{ mt: 4, padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Loan Information
        </Typography>
        <Typography variant="body1" sx={{ marginTop: '10px' }}>
          - Our loans come with competitive interest rates and flexible repayment plans.<br />
          - You can apply for a loan to meet personal needs, education, home renovation, etc.<br />
          - All applications are processed quickly, with instant approval for eligible applicants.
        </Typography>
      </Box>

      {/* Success Snackbar */}
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

export default Loan;
