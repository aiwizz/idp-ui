import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ExtractedTab from './TabsContent/ExtractedTab';
import ReviewTab from './TabsContent/ReviewTab';
import FieldsManagementTab from './TabsContent/FieldsManagementTab';

function MainContent({ uploadedFiles, fields, setFields, extractedData, setExtractedData }) {
  const savedTabIndex = localStorage.getItem('tabIndex') ? parseInt(localStorage.getItem('tabIndex'), 10) : 0;
  const [tabIndex, setTabIndex] = useState(savedTabIndex);
  const [reviewData, setReviewData] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    localStorage.setItem('tabIndex', newValue);
  };

  return (
    <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Fields Management" />
        <Tab label="Extracted" />
        <Tab label="Review" />
      </Tabs>
      {tabIndex === 0 && <FieldsManagementTab fields={fields} setFields={setFields} />}
      {tabIndex === 1 && (
        <ExtractedTab fields={fields} extractedData={extractedData} />
      )}
      {tabIndex === 2 && (
        <ReviewTab fields={fields} reviewData={reviewData} />
      )}
    </Box>
  );
}

export default MainContent;