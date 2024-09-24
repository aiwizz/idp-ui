import React from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { downloadData } from '../../utils/dataUtils';

function ReviewTab({ fields = [], reviewData = [], setReviewData }) {
  // Handle clearing review data
  const handleClearData = () => {
    setReviewData([]); // Clear only the rows, not the grid
  };

  // Handle downloading the data
  const handleDownload = (format) => {
    downloadData(reviewData, fields, format, 'review_data');
  };

  // Prepare columns for DataGrid
  const columns = [
    { field: 'fileName', headerName: 'File Name', width: 150 },
    ...fields.map((field) => ({
      field: field.replace(/\s+/g, '').toLowerCase(),
      headerName: field,
      width: 150,
    })),
  ];

  // Prepare rows for DataGrid
  const rows = reviewData.map((data, index) => {
    const row = { id: index, fileName: data.fileName };
    fields.forEach((field) => {
      row[field.replace(/\s+/g, '').toLowerCase()] = data[field] || 'N/A';
    });
    return row;
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => handleDownload('csv')} sx={{ mr: 2 }}>
          Download CSV
        </Button>
        <Button variant="outlined" onClick={() => handleDownload('json')}>
          Download JSON
        </Button>
        <Button variant="outlined" color='error' onClick={handleClearData} sx={{ ml: 2 }}>
          Clear Data
        </Button>
      </Box>
      <div style={{ height: 400, width: '90%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </Box>
  );
}

export default ReviewTab;