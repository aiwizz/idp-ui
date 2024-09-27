import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { deleteFieldByName } from '../../db';

function FieldsManagementTab({ fields, setFields }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleDialogOpen = (field = '', index = null) => {
    setCurrentField(field); // field is now a string
    setEditIndex(index);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setCurrentField('');
    setEditIndex(null);
    setOpenDialog(false);
  };

  // Ensure we don't add duplicate fields
  const handleFieldSave = () => {
    if (!fields.includes(currentField)) {
      if (editIndex !== null) {
        const updatedFields = [...fields];
        updatedFields[editIndex] = currentField;
        setFields(updatedFields);
      } else {
        setFields([...fields, currentField]);
      }
    }
    handleDialogClose();
  };

  const handleFieldDelete = async(index) => {
    const fieldName = fields[index];
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    await deleteFieldByName(fieldName);
  };

  return (
    <>
      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Please add or edit the fields (data) to be extracted from your documents.
        </Typography>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
        >
          Add Field
        </Button>
        <Table sx={{ mt: 2 }}>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={index}>
                <TableCell>{field}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleDialogOpen(field, index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleFieldDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog for Add/Edit Field */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{editIndex !== null ? 'Edit Field' : 'Add Field'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Field Name"
              fullWidth
              value={currentField}
              onChange={(e) => setCurrentField(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleFieldSave} disabled={!currentField.trim()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default FieldsManagementTab;