import React from 'react';
import { Box, Button, useTheme } from '@mui/material';

interface Props {
  onUpdateClick: () => void;
  onDeleteClick: () => void;
}

const UpdateDeleteButtons: React.FC<Props> = ({ onUpdateClick, onDeleteClick }) => {
  const theme = useTheme();

  return (
    <Box display="flex" gap={2} mt="44px">
      <Button
        color="primary"
        variant="contained"
        onClick={onUpdateClick}
        sx={{ minWidth: '200px', fontWeight: theme.typography.fontWeightBold }}
      >
        Update
      </Button>

      <Button
        color="error"
        variant="outlined"
        onClick={onDeleteClick}
        sx={{ minWidth: '200px', fontWeight: theme.typography.fontWeightBold }}
      >
        Delete
      </Button>
    </Box>
  );
};

export { UpdateDeleteButtons };
