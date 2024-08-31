import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography, Avatar } from '@mui/material';

function AccountPage() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
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
      <Avatar src={user.picture} alt={user.name} sx={{ width: 100, height: 100, mb: 2 }} />
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="h6" color="textSecondary">
        {user.email}
      </Typography>
      {/* Add more user details as needed */}
    </Box>
  );
}

export default AccountPage;
