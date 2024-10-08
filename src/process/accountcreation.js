import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, CardActions, CircularProgress, Box } from '@mui/material';
import { db, auth } from '../firebaseConfig'; // Import Firebase Firestore and Auth
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AccountCreation = () => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [customerId, setCustomerId] = useState(null); // Customer ID
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Store fetched customer details
  const ifscCode = "PRIYA0510"; // IFSC code for all accounts

  useEffect(() => {
    const fetchLastCustomerId = async () => {
      const lastCustomerDoc = await getDoc(doc(db, 'meta', 'lastCustomerId'));
      if (lastCustomerDoc.exists()) {
        const lastCustomerId = lastCustomerDoc.data().customerId;
        setCustomerId(lastCustomerId + 1); // Set next customer ID
      } else {
        setCustomerId(1); // Start from 1 if no previous ID exists
      }
    };

    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'AccountDetails', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.error('No user details found in accounts database.');
        }
      }
    };

    fetchLastCustomerId();
    fetchUserInfo();
  }, []);

  const handleCreateAccountRequest = async () => {
    if (!aadharNumber || !panNumber || customerId === null || !userInfo) {
      alert("Please fill out all fields and ensure customer details are fetched.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'StatusofAccount', user.uid), {
          aadharNumber,
          panNumber,
          customerId,
          ifscCode,
          status: 'pending',
          userId: user.uid,
          name: userInfo.name,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber
        });
        await setDoc(doc(db, 'meta', 'lastCustomerId'), {
          customerId: customerId // Update Firestore with the new customerId
        });

        alert('Account request submitted! Waiting for admin approval.');
      }
    } catch (error) {
      console.error('Error submitting account request:', error);
      alert('Failed to submit account request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* User Info Card */}
      {userInfo && (
        <Card elevation={5} sx={{ mb: 4, backgroundColor: '#e0f7fa', borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#00796b' }}>
              User Information
            </Typography>
            <Typography>Name: {userInfo.name}</Typography>
            <Typography>Email: {userInfo.email}</Typography>
            <Typography>Phone: {userInfo.phoneNumber}</Typography>
          </CardContent>
        </Card>
      )}

      {/* Account Creation Form */}
      <Card elevation={5} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ mb: 3, color: '#333' }}>
            Request Bank Account Creation
          </Typography>

          <TextField
            label="Aadhar Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            required
            InputProps={{
              style: { borderRadius: '10px' }
            }}
          />
          <TextField
            label="PAN Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            required
            InputProps={{
              style: { borderRadius: '10px' }
            }}
          />
        </CardContent>

        <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAccountRequest}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              paddingY: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Account Request'}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default AccountCreation;
