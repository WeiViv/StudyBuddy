import React from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { handleSignOut } from '../utils/firebase';

export default function SignOutDialog({ open, onClose }) {
  const navigate = useNavigate();

  const confirmSignOut = () => {
    handleSignOut(navigate);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Sign Out</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to sign out?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmSignOut} color="secondary">
          Sign Out
        </Button>
      </DialogActions>
    </Dialog>
  );
}
