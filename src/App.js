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
import { loadFields, saveFields, loadExtractedData, saveExtractedData, clearIndexedDB } from './db';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [fields, setFields] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [emailFor2FA, setEmailFor2FA] = useState('');

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

  // Load fields and extracted data from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFields = await loadFields();
        if (savedFields.length > 0) {
          console.log('Loaded fields from IndexedDB:', savedFields);
          setFields(savedFields);
        }

        const savedExtractedData = await loadExtractedData();
        if (savedExtractedData.length > 0) {
          console.log('Loaded extractedData from IndexedDB:', savedExtractedData);
          setExtractedData(savedExtractedData);
        }
      } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Save fields and extracted data to IndexedDB when they change
  useEffect(() => {
    const saveData = async () => {
      if (isAuthenticated) {
        try {
          if (fields.length > 0) {
            await saveFields(fields);
          }

          if (extractedData.length > 0) {
            await saveExtractedData(extractedData);
          }
        } catch (error) {
          console.error('Error saving data to IndexedDB:', error);
        }
      }
    };
    saveData();
  }, [fields, extractedData, isAuthenticated]);

  // Check token validity and handle authentication state
  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://127.0.0.1:5000/account', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/');
        }
      } catch (error) {
        console.error('Token is expired or invalid. Redirecting to login...', error);
        setIsAuthenticated(false);
        navigate('/');
      }
    };

    if (
      location.pathname !== '/' &&
      location.pathname !== '/reset_password' &&
      location.pathname !== '/verify_2fa'
    ) {
      checkTokenValidity();
    }
  }, [location, navigate]);

  const handleLogout = async () => {
    try {
      await clearIndexedDB();
      setFields([]);
      setExtractedData([]);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Box>
      <Routes>
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/verify_2fa"
          element={<Verify2FA email={emailFor2FA} setIsAuthenticated={setIsAuthenticated} />}
        />

        {isAuthenticated ? (
          <>
            <Route
              path="/home"
              element={
                <>
                  <CustomAppBar setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
                  <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                    <Sidebar
                      uploadedFiles={uploadedFiles}
                      setUploadedFiles={setUploadedFiles}
                      fields={fields}
                      setExtractedData={setExtractedData}
                    />
                    <MainContent
                      uploadedFiles={uploadedFiles}
                      fields={fields}
                      setFields={setFields}
                      extractedData={extractedData}
                      setExtractedData={setExtractedData}
                    />
                  </Box>
                </>
              }
            />
            <Route
              path="/account"
              element={
                <>
                  <CustomAppBar setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
                  <AccountPage />
                </>
              }
            />
            <Route
              path="/payment-setup"
              element={
                <>
                  <CustomAppBar setIsAuthenticated={setIsAuthenticated} handleLogout={handleLogout} />
                  <Elements stripe={stripePromise}>
                    <PaymentSetup />
                  </Elements>
                </>
              }
            />
          </>
        ) : (
          <Route
            path="/"
            element={<LandingPage setIsAuthenticated={setIsAuthenticated} setEmailFor2FA={setEmailFor2FA} />}
          />
        )}
      </Routes>
    </Box>
  );
}

export default App;