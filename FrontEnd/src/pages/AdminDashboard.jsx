import { useEffect, useState } from 'react';
import { Alert, Box, Grid, MenuItem, Select as MuiSelect } from '@mui/material';
import { LayoutAdmin } from '../components/templates/LayoutAdmin';
import { Card } from '../components/atoms/Card';
import { TextField } from '../components/atoms/TextField';
import { Button } from '../components/atoms/Button';
import { Typography } from '../components/atoms/Typography';
import { useCuentasMedicas } from '../hooks/useCuentasMedicas';
import { authService } from '../services/api/authService';
import { aseguradoraService } from '../services/api/aseguradoraService';
import { pacienteService } from '../services/api/pacienteService';

export const AdminDashboard = () => {
  const { cuentas, loading } = useCuentasMedicas();
  const [aseguradoras, setAseguradoras] = useState([]);
  const [status, setStatus] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'admin',
    id_aseguradora: '',
  });
  const [aseguradoraForm, setAseguradoraForm] = useState({ nombre: '' });
  const [pacienteForm, setPacienteForm] = useState({ nombre: '', documento: '' });

  useEffect(() => {
    const fetchAseguradoras = async () => {
      try {
        const data = await aseguradoraService.listAseguradoras();
        setAseguradoras(data);
      } catch {
        setStatus({ severity: 'error', message: 'Error cargando aseguradoras' });
      }
    };

    fetchAseguradoras();
  }, []);

  const showSuccess = (message) => {
    setStatus({ severity: 'success', message });
  };

  const showError = (message) => {
    setStatus({ severity: 'error', message });
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        rol: userForm.rol,
        id_aseguradora:
          userForm.rol === 'aseguradora' ? Number(userForm.id_aseguradora) : null,
      };

      await authService.createUser(payload);
      setUserForm({
        name: '',
        email: '',
        password: '',
        rol: 'admin',
        id_aseguradora: '',
      });
      showSuccess('Usuario creado correctamente');
    } catch (error) {
      showError(error.message || error || 'Error al crear usuario');
    }
  };

  const handleCreateAseguradora = async (event) => {
    event.preventDefault();

    try {
      await aseguradoraService.createAseguradora(aseguradoraForm.nombre);
      setAseguradoraForm({ nombre: '' });
      const data = await aseguradoraService.listAseguradoras();
      setAseguradoras(data);
      showSuccess('Aseguradora creada correctamente');
    } catch (error) {
      showError(error.message || error || 'Error al crear aseguradora');
    }
  };

  const handleCreatePaciente = async (event) => {
    event.preventDefault();

    try {
      await pacienteService.createPaciente({
        nombre: pacienteForm.nombre,
        documento: Number(pacienteForm.documento),
      });
      setPacienteForm({ nombre: '', documento: '' });
      showSuccess('Paciente creado correctamente');
    } catch (error) {
      showError(error.message || error || 'Error al crear paciente');
    }
  };

  return (
    <LayoutAdmin>
      <Grid container spacing={3}>
        {status && (
          <Grid item xs={12}>
            <Alert severity={status.severity} onClose={() => setStatus(null)}>
              {status.message}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6">Total Cuentas</Typography>
            <Typography variant="h4" color="primary">
              {cuentas.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6">Pendientes</Typography>
            <Typography variant="h4" color="warning.main">
              {cuentas.filter((c) => c.estado === 'pendiente').length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6">Revisadas</Typography>
            <Typography variant="h4" color="success.main">
              {cuentas.filter((c) => c.estado === 'revisado').length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6">Aseguradoras</Typography>
            <Typography variant="h4" color="primary">
              {aseguradoras.length}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card title="Crear Usuario">
            <Box component="form" onSubmit={handleCreateUser}>
              <TextField
                label="Nombre"
                value={userForm.name}
                onChange={(event) => setUserForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
              <TextField
                label="Password"
                type="password"
                value={userForm.password}
                onChange={(event) =>
                  setUserForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required
              />
              <MuiSelect
                fullWidth
                value={userForm.rol}
                onChange={(event) =>
                  setUserForm((prev) => ({
                    ...prev,
                    rol: event.target.value,
                    id_aseguradora: '',
                  }))
                }
                sx={{ mt: 2 }}
              >
                <MenuItem value="admin">admin</MenuItem>
                <MenuItem value="aseguradora">aseguradora</MenuItem>
              </MuiSelect>
              {userForm.rol === 'aseguradora' && (
                <MuiSelect
                  fullWidth
                  value={userForm.id_aseguradora}
                  onChange={(event) =>
                    setUserForm((prev) => ({ ...prev, id_aseguradora: event.target.value }))
                  }
                  displayEmpty
                  required
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="" disabled>
                    Selecciona aseguradora
                  </MenuItem>
                  {aseguradoras.map((aseguradora) => (
                    <MenuItem key={aseguradora.id} value={aseguradora.id}>
                      {aseguradora.nombre}
                    </MenuItem>
                  ))}
                </MuiSelect>
              )}
              <Button type="submit" fullWidth sx={{ mt: 2 }}>
                Crear Usuario
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card title="Crear Aseguradora">
            <Box component="form" onSubmit={handleCreateAseguradora}>
              <TextField
                label="Nombre"
                value={aseguradoraForm.nombre}
                onChange={(event) => setAseguradoraForm({ nombre: event.target.value })}
                required
              />
              <Button type="submit" fullWidth sx={{ mt: 2 }}>
                Crear Aseguradora
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card title="Crear Paciente">
            <Box component="form" onSubmit={handleCreatePaciente}>
              <TextField
                label="Nombre"
                value={pacienteForm.nombre}
                onChange={(event) =>
                  setPacienteForm((prev) => ({ ...prev, nombre: event.target.value }))
                }
                required
              />
              <TextField
                label="Documento"
                type="number"
                value={pacienteForm.documento}
                onChange={(event) =>
                  setPacienteForm((prev) => ({ ...prev, documento: event.target.value }))
                }
                required
              />
              <Button type="submit" fullWidth sx={{ mt: 2 }}>
                Crear Paciente
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card title="Ultimas Cuentas Medicas">
            <Typography variant="body2">
              {loading ? 'Cargando...' : `Total: ${cuentas.length} cuentas medicas`}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </LayoutAdmin>
  );
};
