import React from 'react';
import { Dialog, SxProps } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  customStyles?: SxProps;
  children: React.ReactNode;
}

const MuiDialog: React.FC<Props> = ({ open, onClose, customStyles, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      disablePortal
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
          maxWidth: '54rem',
          backgroundColor: 'white',
        },
        ...customStyles,
      }}
    >
      {children}
    </Dialog>
  );
};

export { MuiDialog };
