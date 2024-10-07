import React from 'react';
import { Box, CircularProgress, } from '@mui/material';

interface Props {
  minContainerHeight?: string;
}

const Loader: React.FC<Props> = ({ minContainerHeight = '400px' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: minContainerHeight,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export { Loader };
