import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook


function AppMenu() {
  const { logout } = useAuth0(); // Destructure the logout function from useAuth0
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    
    if (option === 'Logout') {
      logout({ returnTo: window.location.origin });
    } else if (option === 'Account') {
      navigate('/account');
    } else if (option === 'Home') {
      navigate('/');
    }
    
    // You can handle other options like 'Account' here
    console.log(option);
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
              <IconButton
              edge="end"
              color="inherit"
              aria-label="home"
              sx={{ ml: 2 }}
              size='small'
              >
                <HomeIcon />
                 Home
              </IconButton>
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose('Account')}>
            <ListItemIcon>
              <IconButton
              edge="end"
              color="inherit"
              aria-label="account"
              sx={{ ml: 2 }}
              size='small'
              >
                <AccountCircle />
                 My account
              </IconButton>
            </ListItemIcon>
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose('Logout')}>
            <ListItemIcon>
              <IconButton
              edge="end"
              color="inherit"
              aria-label="logout"
              sx={{ ml: 2 }}
              size='small'
              >
                <Logout />
                 Logout
              </IconButton>
            </ListItemIcon>
          </MenuItem>
      </Menu>
    </>
  );
}

export default AppMenu;
