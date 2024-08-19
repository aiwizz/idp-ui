import React, { useState } from 'react';
import { Box, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Document, Page } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';
import { pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

function Sidebar() {
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (['jpeg', 'jpg', 'png'].includes(fileExtension)) {
          return await convertImageToPdf(file);
        }
        return file;
      })
    );
    setUploadedFiles((prevFiles) => [...prevFiles, ...processedFiles]);
  };

  async function convertImageToPdf (imageFile) {
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

        // Set the page size to exactly match the image dimensions
        const page = pdfDoc.addPage([imageWidth, imageHeight]);

        // Draw the image on the page
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: imageWidth,
            height: imageHeight,
        });

        // Save the PDF without adding any extra pages
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfFile = new File([blob], `${imageFile.name.split('.')[0]}.pdf`, {
            type: 'application/pdf',
        });

        return pdfFile;
    } catch (error) {
        console.error('Error converting image to PDF:', error);
        alert('Failed to convert image to PDF. Please ensure the image is a valid JPEG or PNG.');
        return null;
    }
  };


  function handleFileRemove (index) {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    if (selectedFile === uploadedFiles[index]) {
      setSelectedFile(null);
    }
  };

  function renderFilePreview() {
    if (!selectedFile || !selectedFile.name) {
      return <Typography>No file selected or file has no name.</Typography>;
    }

    const fileUrl = URL.createObjectURL(selectedFile);

    return (
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={400} />
        ))}
      </Document>
    );
  };

  return (
    <Box
      sx={{
        width: 400,
        bgcolor: '#f5f5f5',
        p: 2,
        borderRight: '1px solid #ddd',
        height: 'auto',
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
          accept=".pdf,.png,.jpeg,.jpg,.tiff,.tif"
          onChange={handleFileUpload}
        />
      </Button>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">Uploaded Files:</Typography>
        <List>
          {uploadedFiles.map((file, index) => (
            <ListItem
              key={index}
              onClick={() => setSelectedFile(file)}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleFileRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Preview Section */}
      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">File Preview:</Typography>
          <Box sx={{ border: '1px solid #ddd', p: 2, mt: 1 }}>
            {renderFilePreview()}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
