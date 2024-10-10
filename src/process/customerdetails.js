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
  TextField,
  Button,
  Snackbar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import CloseIcon from '@mui/icons-material/Close';

const CustomerDetails = () => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const accountRef = doc(db, 'CreateAccount', userId);
        const accountSnap = await getDoc(accountRef);
        
        if (accountSnap.exists()) {
          const data = accountSnap.data();
          setAccountDetails(data);
          setFormData(data); // Initialize form data with account details
        } else {
          console.error('No accounts found for this user.');
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const accountRef = doc(db, 'CreateAccount', userId);
      await updateDoc(accountRef, formData);
      setSnackbarMessage('Account updated successfully!');
      setSnackbarOpen(true);
      setAccountDetails(formData); // Update the displayed account details
      setOpenModal(true); // Open success modal
    } catch (error) {
      console.error('Error updating account details:', error);
      setSnackbarMessage('Failed to update account details.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 6 }}>
      {loading ? (
        <Typography variant="h6" sx={{ color: '#757575' }}>Loading...</Typography>
      ) : (
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            backgroundColor: '#fffbea',
            borderRadius: 4,
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: '#424242', fontWeight: 'bold', marginBottom: 4 }}
          >
            Account Overview
          </Typography>
          {accountDetails && (
            <>
              <TableContainer component={Paper} sx={{ backgroundColor: '#f9fbe7' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff59d' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Field</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Aadhar Number</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          name="aadharNumber"
                          value={formData.aadharNumber || ''}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PAN Number</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          name="panNumber"
                          value={formData.panNumber || ''}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Balance</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>₹{accountDetails.balance}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Transfer Limit</TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          name="transferLimit"
                          type="number"
                          value={formData.transferLimit || ''}
                          onChange={handleChange}
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpdate}
                sx={{
                  mt: 4,
                  backgroundColor: '#ff6f00',
                  '&:hover': { backgroundColor: '#e65100' },
                  fontWeight: 'bold',
                  paddingY: 2,
                  borderRadius: 4,
                  textTransform: 'none',
                }}
              >
                Update Account
              </Button>
            </>
          )}
        </Paper>
      )}

      {/* Modal for Success Confirmation */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs">
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
              Update Successful
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#616161' }}>
            Your account details have been updated successfully.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{
              backgroundColor: '#00c853',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#00b347' },
              borderRadius: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
};

export default CustomerDetails;
