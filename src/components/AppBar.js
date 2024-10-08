import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import logo from '../logo-white.png';
import AppMenu from './AppMenu';

function CustomAppBar({ setIsAuthenticated }) { 
    
   return (
        <AppBar position="sticky">
            <Toolbar>
                {/* Logo on the left */}
                <Box sx={{ flexGrow: 1 }}>
                    <img src={logo} alt="Logo" style={{ height: 80 }} />
                </Box>
                {/* Hamburger menu on the right */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AppMenu setIsAuthenticated={setIsAuthenticated} />
                </Box>
            </Toolbar>
        </AppBar>
   );
}

export default CustomAppBar;
