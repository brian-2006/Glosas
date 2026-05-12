import { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { LayoutAdmin } from '../components/templates/LayoutAdmin';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Typography } from '../components/atoms/Typography';
import { glosaService } from '../services/api/glosaService';

export const GlosasPage = () => {
  const [searchParams] = useSearchParams();
  const [glosas, setGlosas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGlosa, setSelectedGlosa] = useState(null);

  useEffect(() => {
    const fetchGlosas = async () => {
      try {
        setLoading(true);
        const data = await glosaService.getGlosas();
        setGlosas(data);
        const cuentaId = Number(searchParams.get('cuenta'));

        if (cuentaId) {
          const glosaByCuenta = data.find((glosa) => glosa.id_cuentamedica === cuentaId);

          if (glosaByCuenta) {
            setSelectedGlosa(glosaByCuenta);
          }
        }
      } catch (err) {
        setError(err.message || 'Error al cargar glosas');
      } finally {
        setLoading(false);
      }
    };
    fetchGlosas();
  }, [searchParams]);

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
        return 'success';
      case 'rechazado':
        return 'error';
      case 'objetado':
        return 'warning';
      case 'pendiente':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleOpenDetail = (glosa) => {
    setSelectedGlosa(glosa);
  };

  const handleCloseDetail = () => {
    setSelectedGlosa(null);
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </LayoutAdmin>
    );
  }

  if (error) {
    return (
      <LayoutAdmin>
        <Alert severity="error">{error}</Alert>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <Grid container spacing={2}>
        {glosas.map((glosa) => (
          <Grid item xs={12} md={6} key={glosa.id_glosa}>
            <Card title={`Glosa #${glosa.id_glosa}`}>
              <Typography variant="body2">
                <strong>Estado:</strong>{' '}
                <Chip
                  label={glosa.estado}
                  color={getEstadoColor(glosa.estado)}
                  size="small"
                />
              </Typography>
              <Typography variant="body2">
                <strong>Valor Aprobado:</strong> ${glosa.valoraprobado}
              </Typography>
              <Typography variant="body2">
                <strong>Paciente:</strong> {glosa.paciente}
              </Typography>
              <Typography variant="body2">
                <strong>Aseguradora:</strong> {glosa.aseguradora}
              </Typography>
              <Typography variant="body2">
                <strong>Fecha:</strong> {formatDate(glosa.fecha)}
              </Typography>

              <Button
                type="button"
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => handleOpenDetail(glosa)}
              >
                Detalle
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedGlosa)}
        onClose={handleCloseDetail}
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
          Detalle de Glosa #{selectedGlosa?.id_glosa}
          <IconButton aria-label="Cerrar detalle" onClick={handleCloseDetail}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedGlosa && (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 1,
                  mb: 3,
                }}
              >
                <Typography variant="body2">
                  <strong>Paciente:</strong> {selectedGlosa.paciente}
                </Typography>
                <Typography variant="body2">
                  <strong>Aseguradora:</strong> {selectedGlosa.aseguradora}
                </Typography>
                <Typography variant="body2">
                  <strong>Estado:</strong>{' '}
                  <Chip
                    label={selectedGlosa.estado}
                    color={getEstadoColor(selectedGlosa.estado)}
                    size="small"
                  />
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong> {formatDate(selectedGlosa.fecha)}
                </Typography>
                <Typography variant="body2">
                  <strong>Valor Aprobado:</strong> ${selectedGlosa.valoraprobado}
                </Typography>
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Procedimiento</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedGlosa.procedimientos?.map((procedimiento, index) => (
                      <TableRow key={`${procedimiento.nombre_procedimiento}-${index}`}>
                        <TableCell>{procedimiento.nombre_procedimiento}</TableCell>
                        <TableCell align="right">${procedimiento.valor}</TableCell>
                        <TableCell>
                          <Chip
                            label={procedimiento.estado}
                            color={getEstadoColor(procedimiento.estado)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </LayoutAdmin>
  );
};
