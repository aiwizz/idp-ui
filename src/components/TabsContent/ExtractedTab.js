import React from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { downloadData } from '../../utils/dataUtils';
import { clearExtractedData } from '../../db'; // Import clearExtractedData from db.js

function ExtractedTab({ fields = [], extractedData = [], setExtractedData }) {
  // Define the columns based on the fields array
  const columns = [
    { field: 'fileName', headerName: 'File Name', width: 150 },
    ...fields.map((field) => ({
      field: field.replace(/\s+/g, '').toLowerCase(),
      headerName: field,
      width: 150,
    })),
  ];

  // Map extractedData to DataGrid rows, ensuring valid ids
  const rows = extractedData.map((data, index) => {
    const row = { id: index, fileName: data.fileName }; // Using index as id for simplicity
    fields.forEach((field) => {
      row[field.replace(/\s+/g, '').toLowerCase()] = data[field] || 'N/A';
    });
    return row;
  });

  // Clear data both from the DataGrid and IndexedDB
  const handleClearData = async () => {
    setExtractedData([]); // Clear the rows
    await clearExtractedData(); // Clear the data from IndexedDB
    console.log('Extracted data cleared.');
  };

  const handleDownload = (format) => {
    downloadData(extractedData, fields, format, 'extracted_data');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => handleDownload('csv')} sx={{ mr: 2 }}>
          Download CSV
        </Button>
        <Button variant="outlined" onClick={() => handleDownload('json')} sx={{ mr: 2 }}>
          Download JSON
        </Button>
        <Button variant="outlined" color="error" onClick={handleClearData}>
          Clear Data
        </Button>
      </Box>
      <div style={{ height: 400, width: '90%' }}>
        {/* Keep the DataGrid visible, even when rows are empty */}
        <DataGrid
          rows={rows.length > 0 ? rows : []} // Pass an empty array when rows are cleared
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          noRowsOverlay={() => <p>No data available. Please upload files and extract data.</p>} // Show a message when no rows are present
        />
      </div>
    </Box>
  );
}

export default ExtractedTab;