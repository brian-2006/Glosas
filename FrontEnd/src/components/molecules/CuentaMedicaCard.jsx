import { Box, Chip, Stack } from '@mui/material';
import { Card } from '../atoms/Card';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export const CuentaMedicaCard = ({
  cuenta,
  formatDate,
  getEstadoColor,
  onViewGlosas,
  onViewProcedimientos,
  showActions = true,
}) => {
  return (
    <Card>
      <Typography variant="h6" gutterBottom>
        Cuenta Medica #{cuenta.id}
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Paciente:</strong> {cuenta.paciente || cuenta.id_paciente}
        </Typography>
        <Typography variant="body2">
          <strong>Aseguradora:</strong> {cuenta.aseguradora || cuenta.id_aseguradora}
        </Typography>
        <Typography variant="body2">
          <strong>Historia Clinica:</strong> {cuenta.historiaclinica}
        </Typography>
        <Typography variant="body2">
          <strong>Estado:</strong>{' '}
          <Chip
            label={cuenta.estado}
            color={getEstadoColor?.(cuenta.estado) || 'default'}
            size="small"
          />
        </Typography>
        <Typography variant="body2">
          <strong>Fecha:</strong> {formatDate ? formatDate(cuenta.fecha) : cuenta.fecha}
        </Typography>
      </Stack>

      {showActions && (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          {onViewProcedimientos && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewProcedimientos(cuenta)}
            >
              Ver Procedimientos
            </Button>
          )}

          {onViewGlosas && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => onViewGlosas(cuenta.id)}
            >
              Ver Glosa
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
};
