import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Tabs, Tab, Alert, CircularProgress } from '@mui/material';
import logoname from '../../logoname.png';
import backgroundImage from '../../background-pic.jpg';  // Make sure to use the correct path to your image file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage({ setIsAuthenticated }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setMessage('');
    setError('');
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/login', loginData);
      if (response.data.two_factor_required) {
        navigate('/verify_2fa', { state: { email: loginData.email } });
      } else {
        localStorage.setItem('fullname', response.data.fullname);
        localStorage.setItem('email', loginData.email);
        setIsAuthenticated(true);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/register', {
        fullname: registerData.fullname,
        email: registerData.email,
        password: registerData.password,
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/recover_password', { email: recoveryEmail });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response.data.message);
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
      sx={{
        backgroundImage: `url(${backgroundImage})`,  // Use the local background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(100px)',
          zIndex: '0',
        }}
      ></Box>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.90)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <img src={logoname} alt="Logo" style={{ height: 50 }} />
        </Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Forgot Password" />
        </Tabs>

        {tabIndex === 0 && (
          <Box>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={registerData.fullname}
              onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
              onClick={handlePasswordRecovery}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Recover Password'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default LandingPage;