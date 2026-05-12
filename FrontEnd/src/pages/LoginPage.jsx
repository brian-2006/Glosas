import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/molecules/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleLogin = async (email, password) => {
    const user = await login(email, password);
    if (user.rol === 'admin') {
      navigate('/admin');
    } else {
      navigate('/aseguradora');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </Paper>
      </Container>
    </Box>
  );
};
