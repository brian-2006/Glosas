import { useState } from 'react';
import { Grid, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LayoutAdmin } from '../components/templates/LayoutAdmin';
import { CreateCuentaMedicaForm } from '../components/molecules/CreateCuentaMedicaForm';
import { cuentaMedicaService } from '../services/api/cuentaMedicaService';

export const CreateCuentaMedicaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await cuentaMedicaService.createCuentaMedica(formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/cuentas'), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ¡Cuenta médica creada exitosamente! Redireccionando...
            </Alert>
          )}
          <CreateCuentaMedicaForm onSubmit={handleCreate} loading={loading} />
        </Grid>
      </Grid>
    </LayoutAdmin>
  );
};
