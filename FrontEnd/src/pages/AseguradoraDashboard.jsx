import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Alert } from '@mui/material';
import { LayoutAseguradora } from '../components/templates/LayoutAseguradora';
import { Card } from '../components/atoms/Card';
import { Typography } from '../components/atoms/Typography';
import { useAuth } from '../hooks/useAuth';
import { cuentaMedicaService } from '../services/api/cuentaMedicaService';

export const AseguradoraDashboard = () => {
  const { user } = useAuth();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        setLoading(true);
        const data = await cuentaMedicaService.getCuentasMedicasByAseguradora(
          user.id_aseguradora
        );
        setCuentas(data);
      } catch (err) {
        setError(err.message || 'Error al cargar cuentas');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id_aseguradora) {
      fetchCuentas();
    }
  }, [user]);

  if (loading) {
    return (
      <LayoutAseguradora>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </LayoutAseguradora>
    );
  }

  if (error) {
    return (
      <LayoutAseguradora>
        <Alert severity="error">{error}</Alert>
      </LayoutAseguradora>
    );
  }

  return (
    <LayoutAseguradora>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card title={`Bienvenido, ${user?.nombre}`}>
            <Typography variant="body1">
              Total de cuentas médicas asignadas: {cuentas.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </LayoutAseguradora>
  );
};
