import React from 'react';
import { ListItem, Stack, Skeleton, Typography } from '@mui/material';

const LoaderSkeleton = () => {
  return (
    <ListItem disablePadding sx={{ pl: 0, mb: '14px' }}>
      <Stack sx={{ width: '100%' }}>
        <Typography component="div" variant="body1">
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            width="100%"
            height={30}
            sx={{ mb: '4px', fontSize: '1rem' }}
          />

          {/* Meta Information Skeleton */}
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="30%" height={20} />
        </Typography>
      </Stack>
    </ListItem>
  );
};

export { LoaderSkeleton };
