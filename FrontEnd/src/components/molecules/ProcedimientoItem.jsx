import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export const ProcedimientoItem = ({
  procedimiento,
  onApprove,
  onReject,
  loading,
}) => {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return 'success';
      case 'rechazado':
        return 'error';
      default:
        return 'warning';
    }
  };

  const isPending = procedimiento.estado === 'pendiente';

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 1,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle1">
          {procedimiento.catalogo_procedimiento?.nombre || 'Sin nombre'}
        </Typography>

        <Typography variant="body2">
          <strong>Valor:</strong> ${procedimiento.valor}
        </Typography>

        <Typography variant="body2">
          <strong>Estado:</strong>{' '}
          <Chip
            label={procedimiento.estado}
            color={getEstadoColor(procedimiento.estado)}
            size="small"
          />
        </Typography>

        {isPending && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => onApprove(procedimiento.id)}
              disabled={loading}
            >
              Aprobar
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => onReject(procedimiento.id)}
              disabled={loading}
            >
              Rechazar
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
