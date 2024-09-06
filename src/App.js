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

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fields, setFields] = useState([]); // State for managing fields
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate();
  const location = useLocation();
  const [emailFor2FA, setEmailFor2FA] = useState(''); // Store email for 2FA verification

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (location.pathname === '/reset_password' || location.pathname === '/verify_2fa') {
      return; // Allow access to reset password and 2FA pages without being authenticated
    }

    if (token) {
      setIsAuthenticated(true);
      if (location.pathname === '/') {
        navigate('/home');
      }
    } else {
      setIsAuthenticated(false);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [navigate, location]);

  const disableBrowse = location.pathname === '/account'; // Disable "Browse Files" on the Account page

  return (
    <Box>
      <Routes>
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/verify_2fa" element={<Verify2FA email={emailFor2FA} setIsAuthenticated={setIsAuthenticated} />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/home" element={
              <>
                <CustomAppBar />
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
                <><CustomAppBar /><AccountPage /></>} 
            />
            
          </>
        ) : (
          <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} setEmailFor2FA={setEmailFor2FA} />} />
        )}
      </Routes>
    </Box>
  );
}

export default App;
