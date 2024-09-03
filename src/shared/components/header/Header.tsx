import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { APP_KEYS } from '../../consts';

const NAV_ITEMS = [
  {
    name: 'List of Questions',
    path: APP_KEYS.ROUTER_KEYS.QUESTION_LIST_PAGE,
  },
  {
    name: 'Categories/Tags Settings',
    path: APP_KEYS.ROUTER_KEYS.QUESTION_SETTINGS_PAGE,
  },
];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (path: string) => {
    if (location.pathname === path) {
      return;
    }
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 10, }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {NAV_ITEMS.map((item) => (
              <MenuItem
                key={item.name}
                selected={location.pathname === item.path}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  cursor: location.pathname !== item.path ? 'pointer' : 'default',
                  pointerEvents: location.pathname !== item.path ? 'auto' : 'none',
                }}
              >
                <Typography textAlign="center">
                  {item.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Typography
          variant="h6"
          component="div"
          onClick={location.pathname !== '/questions' ? () => navigate('/questions') : undefined}
          sx={{
            cursor: location.pathname !== '/questions' ? 'pointer' : 'default',
          }}
        >
          Memostore App
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
