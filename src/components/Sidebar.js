import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function Sidebar({
  uploadedFiles,
  setUploadedFiles,
  handleFileRemove,
  fields,
  disableBrowse,
  setExtractedData,
  setReviewData, // Accept setReviewData as a prop
  handleLogout
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // New state variable
  const [processingQueue, setProcessingQueue] = useState([]); // Processing queue
  const navigate = useNavigate();

  const FREE_UPLOADS = 4;

  useEffect(() => {
    if (!isProcessing && processingQueue.length > 0) {
      processNextFileBatch();
    }
  }, [processingQueue, isProcessing]);

  // Handle file upload
  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);

    if (fields.length === 0) {
      setAlertMessage(
        'Please add at least one field in Fields Management before processing files.'
      );
      setAlertOpen(true);
      return;
    }
    // Add files to the processing queue
    setProcessingQueue((prevQueue) => [...prevQueue, ...files]);
  }

  async function processNextFileBatch() {
    setIsProcessing(true);
    const filesToProcess = processingQueue;
    setProcessingQueue([]);
  
    const token = localStorage.getItem('token');
    try {
      const accountResponse = await axios.get('http://127.0.0.1:8000/account', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { request_count, payment_method_id } = accountResponse.data;
  
      if (request_count < FREE_UPLOADS) {
        await processFiles(filesToProcess, fields, token);
      } else if (request_count >= FREE_UPLOADS && !payment_method_id) {
        navigate('/payment-setup', { state: { filesToProcess } });
      } else {
        await processFiles(filesToProcess, fields, token);
      }
    } catch (error) {
      console.error('Error during file processing:', error);
  
      // Add a check to see if error.response exists
      if (error.response && error.response.data && error.response.data.msg && error.response.data.msg.includes('Token has expired')) {
        handleLogout(); // Call handleLogout to clear the session
        navigate('/', { replace: true });
      } else {
        // Handle cases where error.response is undefined or doesn't have the expected structure
        setAlertMessage(`An error occurred during processing: ${error.message || 'Unknown error occurred'}`);
        setAlertOpen(true);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function processFiles(files, fields, token) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    fields.forEach((field) => {
      formData.append('fields[]', field);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/process', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message.includes('processed successfully')) {
        setExtractedData((prevData) => [...prevData, ...response.data.extracted_data]);
        setReviewData((prevData) => [...prevData, ...response.data.review_data]); // Set reviewData
        await processFileUpload(files);
        console.log('Files processed successfully:', response.data);
      }
    } catch (error) {
      setAlertMessage(`An error occurred during processing: ${error.message || 'Unknown error occurred'}`);
      setAlertOpen(true);
    }
  }

  async function processFileUpload(files) {
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (['jpeg', 'jpg', 'png'].includes(fileExtension)) {
          return await convertImageToPdf(file);
        } else if (fileExtension === 'pdf') {
          return file;
        } else {
          alert(`Unsupported file format: ${fileExtension.toUpperCase()}. Please upload PDF or image files.`);
          return null;
        }
      })
    );

    const validFiles = processedFiles.filter((file) => file !== null);

    setUploadedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  }

  // Convert image to PDF
  async function convertImageToPdf(imageFile) {
    try {
      const pdfDoc = await PDFDocument.create();
      const imageBytes = await imageFile.arrayBuffer();
      let image;
      const fileExtension = imageFile.name.split('.').pop().toLowerCase();

      if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (fileExtension === 'png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error('Unsupported image format');
      }

      const { width: imageWidth, height: imageHeight } = image.scale(1);
      const page = pdfDoc.addPage([imageWidth, imageHeight]);
      page.drawImage(image, { x: 0, y: 0, width: imageWidth, height: imageHeight });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfFile = new File([blob], `${imageFile.name.split('.')[0]}.pdf`, { type: 'application/pdf' });

      return pdfFile;
    } catch (error) {
      alert('Failed to convert image to PDF. Please ensure the image is a valid JPEG or PNG.');
      return null;
    }
  }

  // Handle file removal
  function handleFileDelete(index) {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    if (selectedFile === fileToRemove) {
      setSelectedFile(null);
    }
  }

  // Render file preview
  function renderFilePreview() {
    if (!selectedFile || !selectedFile.name) {
      return <Typography color="textSecondary">No file selected or file has no name.</Typography>;
    }

    const fileUrl = URL.createObjectURL(selectedFile);

    return (
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) => console.error('Error while loading document:', error)}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={350} renderTextLayer={false} renderAnnotationLayer={false} />
        ))}
      </Document>
    );
  }

  return (
    <Box
      sx={{
        width: 400,
        bgcolor: '#f5f5f5',
        p: 2,
        borderRight: '1px solid #ddd',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom color="textSecondary">
        Upload Documents
      </Typography>
      <Button variant="contained" component="label">
        {isProcessing ? (
          <>
            <CircularProgress size={20} style={{ marginRight: 8 }} />
            Processing...
          </>
        ) : (
          'Browse Files'
        )}
        <input type="file" hidden multiple accept=".pdf,.png,.jpeg,.jpg" onChange={handleFileUpload} />
      </Button>
      {isProcessing && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Find extracted data in <b>"EXTRACTED"</b> tab{'\n'}
          and files that need human review in <b>"REVIEW"</b> tab.{'\n'}
          You can upload more files in the queue while processing is running.
        </Typography>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Uploaded Files:</Typography>
        {uploadedFiles.length === 0 ? (
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            No files uploaded yet.
          </Typography>
        ) : (
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index} button selected={selectedFile === file} onClick={() => setSelectedFile(file)}>
                <ListItemText primary={file.name} />
                <IconButton edge="end" onClick={() => handleFileDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {selectedFile && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">File Preview:</Typography>
          <Box sx={{ border: '1px solid #ddd', p: 2, mt: 2, borderRadius: 1, maxHeight: '50vh', overflowY: 'auto' }}>
            {renderFilePreview()}
          </Box>
        </Box>
      )}

      {/* Alert Dialog */}
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;