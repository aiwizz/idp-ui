import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ExtractedTab from './TabsContent/ExtractedTab';
import ReviewTab from './TabsContent/ReviewTab';
import FieldsManagementTab from './TabsContent/FieldsManagementTab';

function MainContent({ uploadedFiles }) {
  
  const [tabIndex, setTabIndex] = useState(0);
  const [fields, setFields] = useState([]);
  const [extractedData, setExtractedData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Mock function to simulate data extraction
  const processFiles = () => {
    if (fields.length === 0) {
      setAlertMessage('Please add at least one field in Fields Management before processing files.');
      setAlertOpen(true);
      return;
    }

    const extracted = uploadedFiles.map((file) => {
      const data = { fileName: file.name };
      fields.forEach((field) => {
        data[field] = 'Sample Data'; // Replace with actual extraction logic
      });
      return data;
    });

    setExtractedData(extracted);
    // Simulate some files failing to process
    setReviewData(extracted.slice(0, 1));
  };

  React.useEffect(() => {
    if (uploadedFiles.length > 0) {
      processFiles();
    }
  }, [uploadedFiles, fields]);

  return (
    <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Extracted" />
        <Tab label="Review" />
        <Tab label="Fields Management" />
      </Tabs>

      {tabIndex === 0 && <ExtractedTab fields={fields} extractedData={extractedData} />}
      {tabIndex === 1 && <ReviewTab fields={fields} reviewData={reviewData} />}
      {tabIndex === 2 && <FieldsManagementTab fields={fields} setFields={setFields} />}

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAlertOpen(false)}
            variant="contained"
            component="label"
            sx={{
                transition: 'background-color 0.3s',
                '&:hover': {
                backgroundColor: '#1976d2',
                },
            }}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainContent;
