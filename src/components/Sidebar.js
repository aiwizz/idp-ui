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
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

function Sidebar({
  uploadedFiles,
  setUploadedFiles,
  fields,
  setExtractedData,
  setReviewData,
  handleLogout,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState([]);
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
    setProcessingQueue((prevQueue) => [...prevQueue, ...files]);
  }

  async function processNextFileBatch() {
    setIsProcessing(true);
    const filesToProcess = processingQueue;
    setProcessingQueue([]);

    const token = localStorage.getItem('token');
    try {
      const accountResponse = await axios.get('http://localhost:8000/account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { request_count, payment_method_id } = accountResponse.data;
      const remainingFreeUploads = FREE_UPLOADS - request_count;

      if (remainingFreeUploads > 0 && filesToProcess.length > remainingFreeUploads) {
        setAlertMessage(
          `You have ${remainingFreeUploads} free uploads remaining. Please upload ${remainingFreeUploads} or fewer files.`
        );
        setAlertOpen(true);
        setIsProcessing(false);
        return;
      }

      if (request_count < FREE_UPLOADS) {
        await processFiles(filesToProcess, fields, token);
      } else if (request_count >= FREE_UPLOADS && !payment_method_id) {
        navigate('/payment-setup', { state: { filesToProcess } });
      } else {
        await processFiles(filesToProcess, fields, token);
      }
    } catch (error) {
      console.error('Error during file processing:', error);

      if (error.response && error.response.data && error.response.data.msg && error.response.data.msg.includes('Token has expired')) {
        handleLogout();
        navigate('/', { replace: true });
      } else {
        setAlertMessage(`An error occurred during processing: ${error.message || 'Unknown error occurred'}`);
        setAlertOpen(true);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function processFiles(files, fields, token) {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    fields.forEach((field) => formData.append('fields[]', field));

    try {
      const response = await axios.post('http://localhost:8000/process', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message.includes('processed successfully')) {
        setExtractedData((prevData) => [...prevData, ...response.data.extracted_data]);
        setReviewData((prevData) => [...prevData, ...response.data.review_data]);
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
        console.log('Files processed successfully:', response.data);
      }
    } catch (error) {
      setAlertMessage(`An error occurred during processing: ${error.message || 'Unknown error occurred'}`);
      setAlertOpen(true);
    }
  }

  // Handle file removal
  function handleFileDelete(index) {
    const fileToRemove = uploadedFiles[index];
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));

    if (selectedFile === fileToRemove) {
      setSelectedFile(null);
      setSelectedFileUrl(null);
    }
  }

  // Handle file selection for preview
  function handleFileSelect(file) {
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl);
  }

  // Cleanup file URL when component unmounts
  useEffect(() => {
    return () => {
      if (selectedFileUrl) {
        URL.revokeObjectURL(selectedFileUrl);
      }
    };
  }, [selectedFileUrl]);

  // Render file preview using react-doc-viewer
  function renderFilePreview() {
    if (!selectedFile || !selectedFileUrl) {
      return <Typography color="textSecondary">No file selected or file has no name.</Typography>;
    }

    const docs = [{ uri: selectedFileUrl, fileType: selectedFile.type }];

    return (
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ width: '100%', height: '100%' }}
        config={{ header: { disableHeader: true } }}
        onError={(error) => {
          console.error('DocViewer Error:', error);
          setAlertMessage('Failed to load the document. Please try again.');
          setAlertOpen(true);
        }}
      />
    );
  }

  return (
    <Box sx={{ width: 400, bgcolor: '#f5f5f5', p: 2, borderRight: '1px solid #ddd', height: '100vh', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom color="textSecondary">Upload Documents</Typography>
      <Button variant="contained" component="label">
        {isProcessing ? (
          <>
            <CircularProgress size={20} style={{ marginRight: 8 }} />
            Processing...
          </>
        ) : 'Browse Files'}
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
          <Typography color="textSecondary" sx={{ mt: 1 }}>No files uploaded yet.</Typography>
        ) : (
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem key={index} button selected={selectedFile === file} onClick={() => handleFileSelect(file)}>
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
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen(false)} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;