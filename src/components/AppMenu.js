import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';

function AppMenu({ setIsAuthenticated }) { // Accept setIsAuthenticated as a prop
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);

    if (option === 'Logout') {
      localStorage.clear();
      setIsAuthenticated(false); // Update the authentication state
      navigate('/'); // Navigate to LandingPage
    } else if (option === 'Account') {
      navigate('/account');
    } else if (option === 'Home') {
      navigate('/home');
    }
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenuOpen}
      >
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleMenuClose(null)}>
        <MenuItem onClick={() => handleMenuClose('Home')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          Home
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('Account')}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          My account
        </MenuItem>
        <MenuItem onClick={() => handleMenuClose('Logout')}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default AppMenu;