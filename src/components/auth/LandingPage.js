import React from 'react';
import { Box, Typography } from '@mui/material';
import LoginButton from './LoginButton';
import logoname from '../../logoname.png'

function LandingPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <img src={logoname} alt="Logo" style={{ height: 100 }} />
      <Typography variant="h4" gutterBottom>
        Intelligent Document Processing
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please log in to continue
      </Typography>
      <LoginButton />
    </Box>
  );
}

export default LandingPage;
