import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          onClick={location.pathname !== '/' ? () => navigate('/') : undefined}
          sx={{
            flexGrow: 1,
            cursor: location.pathname !== '/' ? 'pointer' : 'default',
          }}
        >
          LOGO
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
