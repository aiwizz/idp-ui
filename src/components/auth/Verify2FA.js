import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import logoname from '../../logoname.png';

function Verify2FA({ setIsAuthenticated }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}  // Get email from state

  const handleVerify2FA = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`http://127.0.0.1:5000/verify_2fa/${email}`, {
        two_factor_code: verificationCode,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('fullname', response.data.fullname);
      localStorage.setItem('email', email);
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
       <img src={logoname} alt="Logo" style={{ height: 50, marginLeft: 100 }} />
        <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 5 }}>
          Verify Authentication Code
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          label="Authentication Code"
          variant="outlined"
          margin="normal"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleVerify2FA}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Verify'}
        </Button>
      </Paper>
    </Box>
  );
}

export default Verify2FA;
