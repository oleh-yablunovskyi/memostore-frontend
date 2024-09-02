import React from 'react';
import { Dialog, SxProps } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  customStyles?: SxProps;
  children: React.ReactNode;
}

const MuiDialog: React.FC<Props> = ({ open, onClose, maxWidth = false, customStyles, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      disablePortal
      maxWidth={maxWidth}
      sx={{
        '& .MuiPaper-root': {
          width: '100%',
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
