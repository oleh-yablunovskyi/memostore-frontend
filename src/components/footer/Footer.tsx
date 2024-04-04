import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        padding: '24px',
        textAlign: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Typography>
        Interview Questions App {year}
      </Typography>
    </Box>
  );
}

export default Footer;
