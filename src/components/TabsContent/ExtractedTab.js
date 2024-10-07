import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DataGrid } from '@mui/x-data-grid';
import { downloadData } from '../../utils/dataUtils';
import { clearExtractedData } from '../../db';

function ExtractedTab({ fields = [], extractedData = [], setExtractedData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleDownloadMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleDownloadMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDownload = (format) => {
    downloadData(extractedData, fields, format, 'extracted_data');
    handleDownloadMenuClose();
  };

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
    const row = { id: index, fileName: data.fileName };
    fields.forEach((field) => {
      row[field.replace(/\s+/g, '').toLowerCase()] = data[field] || 'N/A';
    });
    return row;
  });

  // Clear data both from the DataGrid and IndexedDB
  const handleClearData = async () => {
    setExtractedData([]);
    await clearExtractedData();
    console.log('Extracted data cleared.');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleDownloadMenuOpen}
          sx={{ mr: 2 }}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Download As...
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDownloadMenuClose}
        >
          <MenuItem onClick={() => handleDownload('csv')}>CSV</MenuItem>
          <MenuItem onClick={() => handleDownload('json')}>JSON</MenuItem>
          <MenuItem onClick={() => handleDownload('xlsx')}>XLSX</MenuItem>
          <MenuItem onClick={() => handleDownload('pdf')}>PDF</MenuItem>
          <MenuItem onClick={() => handleDownload('xml')}>XML</MenuItem>
          <MenuItem onClick={() => handleDownload('sql')}>SQL</MenuItem>
        </Menu>
        <Button variant="outlined" color="error" onClick={handleClearData}>
          Clear Data
        </Button>
      </Box>
      <div style={{ height: 400, width: '90%' }}>
        <DataGrid
          rows={rows.length > 0 ? rows : []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          noRowsOverlay={() => <p>No data available. Please upload files and extract data.</p>}
        />
      </div>
    </Box>
  );
}

export default ExtractedTab;