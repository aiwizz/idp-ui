import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ExtractedTab from './TabsContent/ExtractedTab';
import ReviewTab from './TabsContent/ReviewTab';
import FieldsManagementTab from './TabsContent/FieldsManagementTab';


function MainContent({ uploadedFiles, fields, setFields }) {
  
  const [tabIndex, setTabIndex] = useState(0);
  const [extractedData, setExtractedData] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Mock function to simulate data extraction
  const processFiles = () => {
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
        <Tab label="Fields Management" />
        <Tab label="Extracted" />
        <Tab label="Review" />
      </Tabs>
      {tabIndex === 0 && <FieldsManagementTab fields={fields} setFields={setFields} />}
      {tabIndex === 1 && <ExtractedTab fields={fields} extractedData={extractedData} />}
      {tabIndex === 2 && <ReviewTab fields={fields} reviewData={reviewData} />}
    </Box>
  );
};

export default MainContent;
