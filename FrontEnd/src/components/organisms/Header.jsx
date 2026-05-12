import React from 'react';
import { AppBar, Toolbar, Box, Button as MuiButton } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../atoms/Typography';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Glosas
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {user.nombre} ({user.rol})
            </Typography>
            <MuiButton color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </MuiButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
