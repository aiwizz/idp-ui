import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AccountPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    // Retrieve user data from local storage
    const fullname = localStorage.getItem('fullname');
    const email = localStorage.getItem('email');

    if (!fullname || !email) {
      return <Typography variant="h6">Error loading account details.</Typography>;
    }

    if (fullname && email) {
      setUser({ fullname, email });
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
      <Typography variant="h6" color="textSecondary">
        {user.email}
      </Typography>
    </Box>
  );
}

export default AccountPage;

