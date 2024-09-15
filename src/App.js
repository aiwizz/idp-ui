import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './components/AppBar';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import LandingPage from './components/auth/LandingPage';
import AccountPage from './components/AccountPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ResetPassword from './components/auth/ResetPassword';
import Verify2FA from './components/auth/Verify2FA';
import PaymentSetup from './components/PaymentSetup'; 
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fields, setFields] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [emailFor2FA, setEmailFor2FA] = useState('');

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  
  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        // Make an API call to verify token
        const response = await axios.get('http://127.0.0.1:5000/account', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/');
        }
      } catch (error) {
        console.error('Token is expired or invalid. Redirecting to login...');
        setIsAuthenticated(false);
        navigate('/');
      }
    };

    if (location.pathname !== '/' && location.pathname !== '/reset_password' && location.pathname !== '/verify_2fa') {
      checkTokenValidity();
    }
  }, [location, navigate]);

  const disableBrowse = location.pathname === '/account';

  return (
    <Box>
      <Routes>
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/verify_2fa" element={<Verify2FA email={emailFor2FA} setIsAuthenticated={setIsAuthenticated} />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/home" element={
              <>
                <CustomAppBar setIsAuthenticated={setIsAuthenticated} /> {/* Pass setIsAuthenticated */}
                <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                  <Sidebar
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    fields={fields}
                    disableBrowse={disableBrowse}
                  />
                  <MainContent
                    uploadedFiles={uploadedFiles}
                    fields={fields}
                    setFields={setFields}
                  />
                </Box>
              </>
            } />
            <Route path="/account" element={
                <><CustomAppBar setIsAuthenticated={setIsAuthenticated} /><AccountPage /></>}
            />
            <Route path="/payment-setup" element={
              <>
                <CustomAppBar setIsAuthenticated={setIsAuthenticated} />
                <Elements stripe={stripePromise}>
                  <PaymentSetup />
                </Elements>
              </>
            } />
          </>
        ) : (
          <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} setEmailFor2FA={setEmailFor2FA} />} />
        )}
      </Routes>
    </Box>
  );
}

export default App;