import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Tabs, Tab, Alert, CircularProgress } from '@mui/material';
import logoname from '../../logoname.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate


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
  const [loading, setLoading] = useState(false);  // Loading state

  const navigate = useNavigate();  // Initialize useNavigate

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setMessage('');
    setError('');
  };

  const handleLogin = async () => {
    setLoading(true);  // Show spinner when login starts
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', loginData);
      console.log(response);
      setMessage(response.data.message);
      //get the token from the response and store it in local storage
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      //redirect to MainContent component
      navigate('/home');
    } catch (err) {
      setError(err.response.data.message);
    }finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);  // Set loading to true when the request starts
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/register', {
        fullname: registerData.fullname,
        email: registerData.email,
        password: registerData.password,
      });
      console.log(response);
      setMessage(response.data.message);
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }finally {
      setLoading(false);  // Set loading to false when the request finishes
    }
  };

  const handlePasswordRecovery = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/recover_password', { email: recoveryEmail });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response.data.message);  
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
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Login
            </Typography>
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
            >
              Login
            </Button>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Register
            </Typography>
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
              disabled={loading}  // Disable the button when loading
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}  {/*Show spinner or text based on loading state*/}
            </Button>
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Forgot Password
            </Typography>
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
            >
              Recover Password
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default LandingPage;
