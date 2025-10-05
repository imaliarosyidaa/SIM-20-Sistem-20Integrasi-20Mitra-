import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type AlertProps = {
  open: boolean;
  title: string;
  content: string;
  handleClose: () => void;
  handleConfirm: () => void;
}

export const AlertDialog: React.FC<AlertProps> = ({ content, handleClose, title, handleConfirm, ...rest }) => (
  <Dialog
    open={open}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    {...rest}
  >
    <DialogTitle id="alert-dialog-title">
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Tidak</Button>
      <Button onClick={() => {
        if (handleConfirm) handleConfirm();
        handleClose();
      }} autoFocus>
        Ya
      </Button>
    </DialogActions>
  </Dialog>
)
