import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { downloadData } from '../../utils/dataUtils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ReviewTab({ fields = [], reviewData = [], setReviewData }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDownloadMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDownloadMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = (format) => {
    downloadData(reviewData, fields, format, 'review_data');
    handleDownloadMenuClose();
  };

  // Handle clearing review data
  const handleClearData = () => {
    setReviewData([]);
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
        </Menu>
        <Button variant="outlined" color="error" onClick={handleClearData} sx={{ ml: 2 }}>
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