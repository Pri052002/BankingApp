import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Card, CardContent, Grid, CircularProgress, Box, Paper
} from '@mui/material';
import { auth, db } from '../firebaseConfig'; // Firebase config
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Navigation

const CustomerLogin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null); // Store account info
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = auth.currentUser; // Get the logged-in user
        if (user) {
          const userDoc = await getDoc(doc(db, 'AccountDetails', user.uid));
          if (userDoc.exists()) {
            setUserInfo(userDoc.data());
            const accountDoc = await getDoc(doc(db, 'CreateAccount', user.uid));
            if (accountDoc.exists()) {
              setAccountInfo(accountDoc.data()); // Store bank account info
            } else {
              console.error('No bank account found for this user.');
            }
          } else {
            console.error('No such user document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleViewTransactions = () => navigate('/transaction-history');
  const handleApplyForLoan = () => navigate('/loan-apply');
  const handleMoneyTransfer = () => navigate('/transfer-amount');
  const handleViewPortfolio = () => navigate('/customer-details');
  const handleCreateAccount = () => navigate('/create-account');
  const handleLogout = async () => {
    await auth.signOut(); // Sign out the user
    navigate('/loginpage'); // Redirect to login page
  };

  if (loading) {
    return (
      <Container sx={{ marginTop: '20px', textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Loading user information...</Typography>
      </Container>
    );
  }

  if (!userInfo) {
    return (
      <Container sx={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h6">No user info available.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px' }}>
      {/* Top section with action buttons */}
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewTransactions}
              sx={{
                background: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Transaction History
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApplyForLoan}
              sx={{
                background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2e7d32, #43a047)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Loan Application
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleMoneyTransfer}
              sx={{
                background: 'linear-gradient(135deg, #d32f2f, #e57373)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c62828, #ef5350)',
                  transform: 'scale(1.05)',
                },
              }}
            >
            Money  Transaction
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewPortfolio}
              sx={{
                background: 'linear-gradient(135deg, #f57c00, #ffa726)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ef6c00, #ff9800)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Manage Your Profile
            </Button>
          </Grid>
          {!accountInfo && (
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateAccount}
                sx={{
                  background: 'linear-gradient(135deg, #4527a0, #7e57c2)',
                  color: '#fff',
                  padding: '10px 20px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #311b92, #673ab7)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Create a New Bank Account
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogout}
              sx={{
                background: 'linear-gradient(135deg, #616161, #9e9e9e)',
                color: '#fff',
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #424242, #757575)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bottom section with user and bank account info */}
      <Box sx={{ marginTop: 4 }}>
        {/* User Information Card */}
        <Card sx={{ marginBottom: 3, background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5e35b1' }}>Customer Details</Typography>
            <Typography variant="body1"><strong>Name:</strong> {userInfo.name}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {userInfo.email}</Typography>
            <Typography variant="body1"><strong>Date of Birth:</strong> {userInfo.dob}</Typography>
            <Typography variant="body1"><strong>Phone Number:</strong> {userInfo.phoneNumber}</Typography>
          </CardContent>
        </Card>

        {/* Bank Account Information */}
        {accountInfo ? (
          <Card sx={{ marginBottom: 3, background: 'linear-gradient(135deg, #bbdefb, #90caf9)', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Account Details</Typography>
              <Typography variant="body1"><strong>Account Number:</strong> {accountInfo.accountNumber}</Typography>
              <Typography variant="body1"><strong>IFSC Code:</strong> {accountInfo.ifscCode}</Typography>
              <Typography variant="body1"><strong>Aadhar Number:</strong> {accountInfo.aadharNumber}</Typography>
              <Typography variant="body1"><strong>PAN Number:</strong> {accountInfo.panNumber}</Typography>
              <Typography variant="body1"><strong>Customer ID:</strong> {accountInfo.customerId}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {accountInfo.status}</Typography>
              <Typography variant="body1"><strong>Balance:</strong> ₹{accountInfo.balance}</Typography>
              <Typography variant="body1"><strong>Transfer Limit:</strong> ₹{accountInfo.transferLimit}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            You are yet to create a bank account yet.Create a new bank account!!!!
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default CustomerLogin;
