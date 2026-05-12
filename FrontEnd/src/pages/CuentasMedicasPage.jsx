import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LayoutAdmin } from '../components/templates/LayoutAdmin';
import { LayoutAseguradora } from '../components/templates/LayoutAseguradora';
import { CuentaMedicaCard } from '../components/molecules/CuentaMedicaCard';
import { Button } from '../components/atoms/Button';
import { Typography } from '../components/atoms/Typography';
import { useAuth } from '../hooks/useAuth';
import { cuentaMedicaService } from '../services/api/cuentaMedicaService';
import { procedimientoService } from '../services/api/procedimientoService';

const ESTADOS_PROCEDIMIENTO = ['pendiente', 'aprobado', 'rechazado'];

export const CuentasMedicasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';
  const Layout = isAdmin ? LayoutAdmin : LayoutAseguradora;

  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCuenta, setSelectedCuenta] = useState(null);
  const [estadoChanges, setEstadoChanges] = useState({});
  const [savingProcedimientoId, setSavingProcedimientoId] = useState(null);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = isAdmin
          ? await cuentaMedicaService.listCuentasMedicas()
          : await cuentaMedicaService.getCuentasMedicasByAseguradora(user.id_aseguradora);

        setCuentas(data);
      } catch (err) {
        setError(err.message || err || 'Error al cargar cuentas medicas');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin || user?.id_aseguradora) {
      fetchCuentas();
    }
  }, [isAdmin, user]);

  const formatDate = (date) => {
    if (!date) {
      return 'Sin fecha';
    }

    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
      case 'revisado':
        return 'success';
      case 'rechazado':
        return 'error';
      case 'pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleViewGlosa = (cuentaId) => {
    navigate(`/admin/glosas?cuenta=${cuentaId}`);
  };

  const handleOpenProcedimientos = (cuenta) => {
    setSelectedCuenta(cuenta);
    setEstadoChanges({});
  };

  const handleCloseProcedimientos = () => {
    setSelectedCuenta(null);
    setEstadoChanges({});
  };

  const handleEstadoChange = (procedimientoId, nuevoEstado) => {
    setEstadoChanges((prev) => ({
      ...prev,
      [procedimientoId]: nuevoEstado,
    }));
  };

  const updateCuentaProcedimiento = (cuenta, procedimientoId, nuevoEstado) => {
    const procedimientos = cuenta.procedimientos.map((item) =>
      item.id === procedimientoId ? { ...item, estado: nuevoEstado } : item
    );
    const estado = procedimientos.some((item) => item.estado === 'pendiente')
      ? 'pendiente'
      : 'revisado';

    return {
      ...cuenta,
      estado,
      procedimientos,
    };
  };

  const handleSaveEstado = async (procedimiento) => {
    const nuevoEstado = estadoChanges[procedimiento.id] || procedimiento.estado;

    try {
      setSavingProcedimientoId(procedimiento.id);
      await procedimientoService.changeProcedimientoState(procedimiento.id, nuevoEstado);

      setCuentas((prev) =>
        prev.map((cuenta) =>
          cuenta.procedimientos.some((item) => item.id === procedimiento.id)
            ? updateCuentaProcedimiento(cuenta, procedimiento.id, nuevoEstado)
            : cuenta
        )
      );

      setSelectedCuenta((prev) =>
        updateCuentaProcedimiento(prev, procedimiento.id, nuevoEstado)
      );

      setEstadoChanges((prev) => {
        const next = { ...prev };
        delete next[procedimiento.id];
        return next;
      });
    } catch (err) {
      setError(err.message || err || 'Error al cambiar estado del procedimiento');
    } finally {
      setSavingProcedimientoId(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container spacing={2}>
        {cuentas.map((cuenta) => (
          <Grid item xs={12} md={6} key={cuenta.id}>
            <CuentaMedicaCard
              cuenta={cuenta}
              formatDate={formatDate}
              getEstadoColor={getEstadoColor}
              onViewGlosas={isAdmin ? handleViewGlosa : undefined}
              onViewProcedimientos={!isAdmin ? handleOpenProcedimientos : undefined}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedCuenta)}
        onClose={handleCloseProcedimientos}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          Procedimientos de Cuenta #{selectedCuenta?.id}
          <IconButton aria-label="Cerrar procedimientos" onClick={handleCloseProcedimientos}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedCuenta && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Paciente:</strong> {selectedCuenta.paciente || selectedCuenta.id_paciente}
                </Typography>
                <Typography variant="body2">
                  <strong>Aseguradora:</strong>{' '}
                  {selectedCuenta.aseguradora || selectedCuenta.id_aseguradora}
                </Typography>
                <Typography variant="body2">
                  <strong>Historia Clinica:</strong> {selectedCuenta.historiaclinica}
                </Typography>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Procedimiento</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="right">Accion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCuenta.procedimientos.map((procedimiento) => {
                      const selectedEstado =
                        estadoChanges[procedimiento.id] || procedimiento.estado;
                      const isSaving = savingProcedimientoId === procedimiento.id;

                      return (
                        <TableRow key={procedimiento.id}>
                          <TableCell>
                            {procedimiento.nombre_procedimiento ||
                              `Procedimiento ${procedimiento.id_catalogoprocedimiento}`}
                          </TableCell>
                          <TableCell align="right">${procedimiento.valor}</TableCell>
                          <TableCell>
                            <Select
                              size="small"
                              value={selectedEstado}
                              onChange={(event) =>
                                handleEstadoChange(procedimiento.id, event.target.value)
                              }
                            >
                              {ESTADOS_PROCEDIMIENTO.map((estado) => (
                                <MenuItem key={estado} value={estado}>
                                  {estado}
                                </MenuItem>
                              ))}
                            </Select>
                            <Chip
                              label={selectedEstado}
                              color={getEstadoColor(selectedEstado)}
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              type="button"
                              size="small"
                              disabled={isSaving || !procedimiento.id}
                              onClick={() => handleSaveEstado(procedimiento)}
                            >
                              {isSaving ? 'Guardando...' : 'Guardar'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
