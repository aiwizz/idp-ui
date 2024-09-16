import React from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';
import { downloadData } from '../../utils/dataUtils';

function ReviewTab ({ fields, reviewData }) {
  
  function handleDownload (format) {
    downloadData(reviewData, fields, format, 'review_data');
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            {fields.map((field, index) => (
              <TableCell key={index}>{field}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reviewData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.fileName}</TableCell>
              {fields.map((field, idx) => (
                <TableCell key={idx}>{data[field] || 'N/A'}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
export default ReviewTab;