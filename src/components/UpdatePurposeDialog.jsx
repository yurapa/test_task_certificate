import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdatePurposeDialog = ({ isOpen, onClose, onConfirm, currentPurpose }) => {
  const [updatedPurpose, setUpdatedPurpose] = useState(currentPurpose);

  const handlePurposeChange = (e) => {
    setUpdatedPurpose(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(updatedPurpose);
    setUpdatedPurpose('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Update Purpose</DialogTitle>
      <DialogContent dividers>
        <TextField
          value={updatedPurpose}
          onChange={handlePurposeChange}
          id="updatedPurpose"
          color="secondary"
          label="New Purpose"
          variant="outlined"
          focused
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button color="secondary" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePurposeDialog;
