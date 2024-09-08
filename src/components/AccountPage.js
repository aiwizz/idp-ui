import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Tooltip } from '@mui/material';
import DriveFolderUploadRoundedIcon from '@mui/icons-material/DriveFolderUpload';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';

function AccountPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const FREE_UPLOADS = 10; // Set the number of free uploads in the /process routes.py  as well

  useEffect(() => {
    
    // Retrieve user data from local storage
    const fullname = localStorage.getItem('fullname');
    const email = localStorage.getItem('email');
    const request_count = localStorage.getItem('request_count');

    if (!fullname || !email) {
      return <Typography variant="h6">Error loading account details.</Typography>;
    }

    if (fullname && email && request_count) {
      setUser({ fullname, email, request_count });
    } else {
      navigate('/');  // Redirect to landing page if user data is not found
    }
  }, [navigate]);

  if (!user) {
    return <Typography variant="h6">You are not logged in.</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      marginTop={-25}
      p={3}
    >
      <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
        {user.fullname.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="h4">{user.fullname}</Typography>
      <Typography variant="h6" color="textSecondary" marginBottom={5}>
        {user.email}
      </Typography>
      <Tooltip title="Uploads Remaining">
        <Badge badgeContent={parseInt(FREE_UPLOADS - user.request_count)} color="primary" showZero>
          <DriveFolderUploadRoundedIcon fontSize="large" />
        </Badge>
      </Tooltip>
    </Box>
    
  );
}

export default AccountPage;

