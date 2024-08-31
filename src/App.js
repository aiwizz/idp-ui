import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './components/AppBar';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import LandingPage from './components/auth/LandingPage';
import AccountPage from './components/AccountPage';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ResetPassword from './components/auth/ResetPassword';


function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fields, setFields] = useState([]); // State for managing fields
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate();
  const location = useLocation();  // Get the current route

  useEffect(() => {

    const token = localStorage.getItem('token');
    
    if (location.pathname === '/reset_password') {
      // Do nothing, let the reset password page load
      return;
    }

    if (token) {
      setIsAuthenticated(true);
      if (location.pathname === '/') {
        navigate('/home');
      }
    } else {
      setIsAuthenticated(false);
      if (location.pathname !== '/reset_password') {
        navigate('/');
      }
    }
  }, [navigate, location]);

  const disableBrowse = location.pathname === '/account';  // Disable "Browse Files" on the Account page

  return (
    <Box>
      <Routes>
        {/* Public Routes */}
        <Route path="/reset_password" element={<ResetPassword />} />

        {/* Conditional rendering based on authentication */}
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
            <Route path="/account" element={<AccountPage />} />
          </>
        ) : (
          <Route path="/" element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} />
        )}
      </Routes>
    </Box>
  );
}

export default App;