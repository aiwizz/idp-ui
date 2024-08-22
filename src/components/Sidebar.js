import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Document, Page } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function Sidebar({ uploadedFiles, setUploadedFiles, handleFileRemove, fields }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Handle file upload
  async function handleFileUpload(event) {
    if (fields.length === 0) {
      setAlertMessage(
        'Please add at least one field in Fields Management before processing files.'
      );
      setAlertOpen(true);
      return;
    }

    const files = Array.from(event.target.files);
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (['jpeg', 'jpg', 'png'].includes(fileExtension)) {
          return await convertImageToPdf(file);
        } else if (fileExtension === 'pdf') {
          return file;
        } else {
          alert(
            `Unsupported file format: ${fileExtension.toUpperCase()}. Please upload PDF or image files.`
          );
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

      page.drawImage(image, {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfFile = new File([blob], `${imageFile.name.split('.')[0]}.pdf`, {
        type: 'application/pdf',
      });

      return pdfFile;
    } catch (error) {
      console.error('Error converting image to PDF:', error);
      alert(
        'Failed to convert image to PDF. Please ensure the image is a valid JPEG or PNG.'
      );
      return null;
    }
  }

  // Handle file removal
  function handleFileDelete(index) {
    const fileToRemove = uploadedFiles[index];

    // Remove file from uploadedFiles
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );

    // Clear preview if the removed file was being previewed
    if (selectedFile === fileToRemove) {
      setSelectedFile(null);
      setNumPages(null);
    }
  }

  // Render file preview
  function renderFilePreview() {
    if (!selectedFile || !selectedFile.name) {
      return (
        <Typography color="textSecondary">
          No file selected or file has no name.
        </Typography>
      );
    }

    const fileUrl = URL.createObjectURL(selectedFile);

    return (
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) =>
          console.error('Error while loading document:', error)
        }
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={350}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
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
      <Typography variant="h6" gutterBottom>
        Upload Documents
      </Typography>
      <Button variant="contained" component="label">
        Browse Files
        <input
          type="file"
          hidden
          multiple
          accept=".pdf,.png,.jpeg,.jpg"
          onChange={handleFileUpload}
        />
      </Button>

      {/* Uploaded Files List */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Uploaded Files:</Typography>
        {uploadedFiles.length === 0 ? (
          <Typography color="textSecondary" sx={{ mt: 1 }}>
            No files uploaded yet.
          </Typography>
        ) : (
          <List>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={index}
                button
                selected={selectedFile === file}
                onClick={() => setSelectedFile(file)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleFileDelete(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* File Preview */}
      {selectedFile && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">File Preview:</Typography>
          <Box
            sx={{
              border: '1px solid #ddd',
              p: 2,
              mt: 2,
              borderRadius: 1,
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
          >
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
          <Button
            onClick={() => setAlertOpen(false)}
            variant="contained"
            sx={{
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sidebar;
