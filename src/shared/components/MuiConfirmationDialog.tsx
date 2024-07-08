import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface Porps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
}

const MuiConfirmDialog: React.FC<Porps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content = 'Are you sure?',
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && (
        <DialogTitle>{title}</DialogTitle>
      )}

      <DialogContent>
        {content}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelButtonText}
        </Button>
        <Button onClick={onConfirm} color="primary">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { MuiConfirmDialog };
