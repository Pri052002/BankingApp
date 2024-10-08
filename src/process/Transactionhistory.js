import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  TextField,
  Grid,
  Box,
  Button,
} from '@mui/material';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userId = auth.currentUser.uid;

  const [filterType, setFilterType] = useState(''); // For filtering transaction types
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const transactionsQuery = query(
      collection(db, 'TransactionDetails'),
      where('senderId', '==', userId) // Fetch transactions where the user is the sender
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(transactionsQuery, async (querySnapshot) => {
      const transactionsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const transaction = { id: doc.id, ...doc.data() };
          
          // Fetch sender's name
          const senderDoc = await getDocs(query(collection(db, 'CreateAccount'), where('userId', '==', transaction.senderId)));
          const recipientDoc = await getDocs(query(collection(db, 'CreateAccount'), where('userId', '==', transaction.recipientId)));

          const senderName = senderDoc.empty ? 'Unknown' : senderDoc.docs[0].data().name;
          const recipientName = recipientDoc.empty ? 'Unknown' : recipientDoc.docs[0].data().name;

          return {
            ...transaction,
            senderName,
            recipientName,
          };
        })
      );

      setTransactions(transactionsData);
      setFilteredTransactions(transactionsData); // Set initial filtered transactions
      setLoading(false); // Set loading to false after fetching data
    }, (error) => {
      console.error('Error fetching transactions:', error);
      setSnackbarMessage('Failed to fetch transaction history.');
      setSnackbarOpen(true);
      setLoading(false); // Set loading to false on error
    });

    // Cleanup function to unsubscribe from listener
    return () => unsubscribe();
  }, [userId]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setFilterType(value);

    // Filter transactions based on selected type
    const filtered = transactions.filter((transaction) =>
      transaction.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  const clearFilter = () => {
    setFilterType('');
    setFilteredTransactions(transactions); // Reset filter to show all transactions
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '50px', padding: '20px', boxShadow: 5, borderRadius: '8px', backgroundColor: '#fff' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={80} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '20px' }}>
            Transaction History
          </Typography>

          {/* Filter Section */}
          <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Filter by Type"
                variant="outlined"
                fullWidth
                value={filterType}
                onChange={handleFilterChange}
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  '& .MuiInputBase-input': { padding: '10px' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ height: '100%', marginTop: '8px' }}
                onClick={clearFilter}
              >
                Clear Filter
              </Button>
            </Grid>
          </Grid>

          {/* No transactions found */}
          {filteredTransactions.length === 0 ? (
            <Typography>No transactions found.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: '8px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Sender Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Recipient Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.senderName}</TableCell>
                      <TableCell>{transaction.recipientName}</TableCell>
                      <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

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

export default TransactionHistory;
