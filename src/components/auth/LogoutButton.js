import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function LogoutButton() {
  const navigate = useNavigate();  // Initialize useNavigate
  localStorage.removeItem('token');
  navigate('/');

  return (
    <Button variant="contained" color="secondary" onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </Button>
  );
}

export default LogoutButton;
