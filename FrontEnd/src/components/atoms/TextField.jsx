import React from 'react';
import { TextField as MuiTextField } from '@mui/material';

export const TextField = ({ label, type = 'text', ...props }) => {
  return (
    <MuiTextField
      fullWidth
      label={label}
      type={type}
      variant="outlined"
      margin="normal"
      {...props}
    />
  );
};
