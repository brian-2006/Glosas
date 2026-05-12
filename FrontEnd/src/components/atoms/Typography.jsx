import React from 'react';
import { Typography as MuiTypography } from '@mui/material';

export const Typography = ({ variant = 'body1', children, ...props }) => {
  return (
    <MuiTypography variant={variant} {...props}>
      {children}
    </MuiTypography>
  );
};
