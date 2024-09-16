import React from 'react';
import {
  Box,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { downloadData } from '../../utils/dataUtils';

function ExtractedTab ({ fields, extractedData }) {
  const columns = [
    { field: 'fileName', headerName: 'File Name', width: 150 },
    ...fields.map((field) => ({
      field: field.split(' ').join('').toLowerCase(),
      headerName: field,
      width: 150,
    }))
  ];

  const rows = extractedData.map((data, index) => {
    const row = { id: index, fileName: data.fileName };
    fields.forEach((field) => {
      row[field.split(' ').join('').toLowerCase()] = data[field];
    });
    return row;
  });

  const handleDownload = (format) => {
    downloadData(extractedData, fields, format, 'extracted_data');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => handleDownload('csv')} sx={{ mr: 2 }}>
          Download CSV
        </Button>
        <Button variant="outlined" onClick={() => handleDownload('json')}>
          Download JSON
        </Button>
      </Box>
      <div style={{ height: 400, width: '90%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </Box>
  );
};
export default ExtractedTab;