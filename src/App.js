import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './process/Home';
import Login from './process/login';
import Registration from './process/Registration';
import AdminLogin from './process/AdminLogin'; 
import CustomerLogin from './process/customerlogin'; 
import AccountCreation from './process/accountcreation'; 
import Loan from './process/loan'; 
import Transactionpage from './process/Transactionpage'; 
import CustomerDetails from './process/customerdetails'; 
import Transactionhistory from './process/Transactionhistory'; 
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null); // To track logged-in user state
  const [loading, setLoading] = useState(true); // Loading state while checking auth status

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Stop loading once we have the user state
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    if (loading) {
      return <div>Loading...</div>; // Show loading spinner while waiting for auth status
    }

    if (!user) {
      navigate('/loginpage'); // Redirect to login if not authenticated
      return null;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/loginpage" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Protected routes for admin and customer */}
        <Route
          path="/admin-page"
          element={
            <ProtectedRoute>
              <AdminLogin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-page"
          element={
            <ProtectedRoute>
              <CustomerLogin />
            </ProtectedRoute>
          }
        />

        {/* Add Create Bank Account route */}
        <Route
          path="/create-account"
          element={
            <ProtectedRoute>
              <AccountCreation />
            </ProtectedRoute>
          }
        />

        {/* Add Money Transfer route */}
        <Route
          path="/transfer-amount"
          element={
            <ProtectedRoute>
              <Transactionpage />
            </ProtectedRoute>
          }
        />

        {/* Add Portfolio route */}
        <Route
          path="/customer-details"
          element={
            <ProtectedRoute>
              <CustomerDetails/>
            </ProtectedRoute>
          }
        />

        {/* Loan route */}
        <Route
          path="/loan-apply"
          element={
            <ProtectedRoute>
              <Loan/>
            </ProtectedRoute>
          }
        />

        {/* Add Transaction History route */}
        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute>
              <Transactionhistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
