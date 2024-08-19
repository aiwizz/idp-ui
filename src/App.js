import React, { useState } from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './components/AppBar';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const supportedFormats = ['pdf', 'png', 'jpeg', 'jpg', 'tiff', 'tif'];

    const unsupportedFiles = files.filter(
      (file) => !supportedFormats.includes(file.name.split('.').pop().toLowerCase())
    );

    if (unsupportedFiles.length > 0) {
      alert(
        `Unsupported file(s) detected: ${unsupportedFiles
          .map((file) => file.name)
          .join(', ')}. Please upload files in supported formats: ${supportedFormats.join(
          ', '
        )}.`
      );
    }

    const supportedFiles = files.filter(
      (file) => supportedFormats.includes(file.name.split('.').pop().toLowerCase())
    );

    setUploadedFiles((prevFiles) => [...prevFiles, ...supportedFiles]);
  };

  const handleFileRemove = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <CustomAppBar />
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Sidebar
          uploadedFiles={uploadedFiles}
          handleFileUpload={handleFileUpload}
          handleFileRemove={handleFileRemove}
        />
        <MainContent uploadedFiles={uploadedFiles} />
      </Box>
    </Box>
  );
};

export default App;