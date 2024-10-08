import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Tooltip, Badge, Button } from '@mui/material';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUpload';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);  // Track errors
  const navigate = useNavigate();
  const FREE_UPLOADS = 4;  // Set the number of free uploads in the /process routes.py as well

  useEffect(() => {
    const token = localStorage.getItem('token');  // Get the token from local storage

    // if token is not found or has expired, redirect to landing page
    if (!token) {
      navigate('/'); 
      return;
    }

    const fetchAccountData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/account', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);  // Set the user data from the API response
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError('Failed to load account details.');
      }
    };

    fetchAccountData();
  }, [navigate]);

  if (error) {
    return <Typography variant="h6">{error}</Typography>;  // Display error message if data fetch fails
  }

  if (!user) {
    return <Typography variant="h6">Loading account details...</Typography>;  // Show loading state
  }

  // Calculate remaining free uploads
  const remainingUploads = Math.max(0, FREE_UPLOADS - user.request_count);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      marginTop={-15}
      p={3}
    >
      <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
        {user.fullname.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="h4">{user.fullname}</Typography>
      <Typography variant="h6" color="textSecondary" marginBottom={5}>
        {user.email}
      </Typography>
      <Tooltip title="Number of Free Uploads Remaining">
        <Badge badgeContent={remainingUploads} color="primary" showZero>
          <DriveFolderUploadRoundedIcon fontSize="large" />
        </Badge>
      </Tooltip>
      <Typography variant="h6" color="textSecondary" marginTop={3}>
        Total Amount Spent: ${user.total_spent || 0}
      </Typography>
      <Typography variant="h6" color="textSecondary" marginTop={1}>
        Current Spending This Month: ${user.current_spending || 0}
      </Typography>
      <Typography variant="h6" color="textSecondary" marginTop={1}>
        Billing Cycle: {user.billing_cycle_start} - {user.billing_cycle_end}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={() => navigate('/payment-setup')}
      >
        Update Payment Method
      </Button>
    </Box>
  );
}

export default AccountPage;