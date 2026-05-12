import React from 'react';
import { Card as MuiCard, CardContent, CardHeader } from '@mui/material';

export const Card = ({ title, children, ...props }) => {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};
