import React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';

function AppMenu() {
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (option) => {
    setAnchorEl(null);
    // Handle menu options like 'Account' and 'Logout' here
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