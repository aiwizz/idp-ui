import React, { useState } from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './components/AppBar';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fields, setFields] = useState([]); // State for managing fields

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