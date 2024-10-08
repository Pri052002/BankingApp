import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { db } from '../firebaseConfig';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminLogin = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchPendingAccounts = async () => {
      try {
        const pendingAccountsCollection = collection(db, 'StatusofAccount');
        const pendingAccountsSnapshot = await getDocs(pendingAccountsCollection);
        const pendingAccountsData = pendingAccountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingAccounts(pendingAccountsData);
      } catch (error) {
        console.error('Error fetching pending accounts:', error);
        setSnackbarMessage('Failed to fetch pending accounts.');
        setSnackbarOpen(true);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchPendingAccounts();
  }, []);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const bankAccountsCollection = collection(db, 'CreateAccount');
        const bankAccountsSnapshot = await getDocs(bankAccountsCollection);
        const allCustomersData = bankAccountsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllCustomers(allCustomersData);
      } catch (error) {
        console.error('Error fetching customer accounts:', error);
        setSnackbarMessage('Failed to fetch customer accounts.');
        setSnackbarOpen(true);
      }
    };

    fetchAllCustomers();
  }, []);

  const generateUniqueAccountNumber = async () => {
    let isUnique = false;
    let newAccountNumber = '';

    while (!isUnique) {
      newAccountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const accountsQuery = await getDocs(collection(db, 'CreateAccount'));
      const existingAccount = accountsQuery.docs.find(
        (doc) => doc.data().accountNumber === newAccountNumber
      );
      if (!existingAccount) {
        isUnique = true;
      }
    }

    return newAccountNumber;
  };

  const handleApproveAccount = async (account) => {
    setLoadingAccounts(true);
    try {
      const generatedAccountNumber = await generateUniqueAccountNumber();

      await setDoc(doc(db, 'CreateAccount', account.id), {
        ...account,
        accountNumber: generatedAccountNumber,
        balance: 100000,
        status: 'approved',
      });

      await deleteDoc(doc(db, 'StatusofAccount', account.id));

      setSnackbarMessage(`Account approved and created for ${account.name}`);
      setPendingAccounts((prevAccounts) =>
        prevAccounts.filter((acc) => acc.id !== account.id)
      );
    } catch (error) {
      console.error('Error approving account:', error);
      setSnackbarMessage('Failed to approve account.');
    } finally {
      setLoadingAccounts(false);
      setSnackbarOpen(true);
    }
  };

  const handleRejectAccount = async (accountId) => {
    setLoadingAccounts(true);
    try {
      await deleteDoc(doc(db, 'StatusofAccount', accountId));
      setPendingAccounts((prevAccounts) =>
        prevAccounts.filter((acc) => acc.id !== accountId)
      );
      setSnackbarMessage('Account rejected successfully.');
    } catch (error) {
      console.error('Error rejecting account:', error);
      setSnackbarMessage('Failed to reject account.');
    } finally {
      setLoadingAccounts(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        Admin Page
      </Typography>

      {/* Layout with Grid */}
      <Grid container spacing={4}>
        {/* Pending Accounts Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#00796b', fontWeight: 'bold' }}>
              Customer Accounts for Approval
              </Typography>
              {loadingAccounts ? (
                <CircularProgress />
              ) : pendingAccounts.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableRow>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Aadhar</TableCell>
                        <TableCell>PAN</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>{account.customerId}</TableCell>
                          <TableCell>{account.name}</TableCell>
                          <TableCell>{account.email}</TableCell>
                          <TableCell>{account.phoneNumber}</TableCell>
                          <TableCell>{account.aadharNumber}</TableCell>
                          <TableCell>{account.panNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleApproveAccount(account)}
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRejectAccount(account.id)}
                            >
                              Reject
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No accounts are available for approval Currently .</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* All Customer Accounts Section */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#00796b', fontWeight: 'bold' }}>
                All Customer Accounts
              </Typography>
              {allCustomers.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableRow>
                        <TableCell>Account Number</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Aadhar</TableCell>
                        <TableCell>PAN</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.accountNumber}</TableCell>
                          <TableCell>{customer.customerId}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phoneNumber}</TableCell>
                          <TableCell>{customer.aadharNumber}</TableCell>
                          <TableCell>{customer.panNumber}</TableCell>
                          <TableCell>₹{customer.balance}</TableCell>
                          <TableCell>{customer.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No customer accounts found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default AdminLogin;
