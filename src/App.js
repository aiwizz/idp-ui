import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CustomAppBar from './components/AppBar';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import LandingPage from './components/auth/LandingPage';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fields, setFields] = useState([]); // State for managing fields

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <Box>
          <CustomAppBar />
          <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
            <Sidebar
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              fields={fields}
              setFields={setFields}
            />
            <MainContent
              uploadedFiles={uploadedFiles}
              fields={fields}
              setFields={setFields}
            />
          </Box>
    </Box>
  );
}

export default App;