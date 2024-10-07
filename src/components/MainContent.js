import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import ExtractedTab from './TabsContent/ExtractedTab';
import ReviewTab from './TabsContent/ReviewTab';
import FieldsManagementTab from './TabsContent/FieldsManagementTab';
import { loadReviewData, saveReviewData } from '../db'; // IndexedDB review data handling

function MainContent({ fields, setFields, extractedData, setExtractedData, reviewData, setReviewData }) {
  const savedTabIndex = localStorage.getItem('tabIndex') ? parseInt(localStorage.getItem('tabIndex'), 10) : 0;
  const [tabIndex, setTabIndex] = useState(savedTabIndex);

  // Load review data from IndexedDB when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedReviewData = await loadReviewData();
        if (savedReviewData.length > 0) {
          setReviewData(savedReviewData);
        }
      } catch (error) {
        console.error('Error loading reviewData from IndexedDB:', error);
      }
    };
    loadData();
  }, []);

  // Save review data to IndexedDB whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await saveReviewData(reviewData);
      } catch (error) {
        console.error('Error saving reviewData to IndexedDB:', error);
      }
    };
    saveData();
  }, [reviewData]);

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
        <ExtractedTab fields={fields} extractedData={extractedData} setExtractedData={setExtractedData} />
      )}
      {tabIndex === 2 && (
        <ReviewTab fields={fields} reviewData={reviewData} setReviewData={setReviewData} />
      )}
    </Box>
  );
}

export default MainContent;