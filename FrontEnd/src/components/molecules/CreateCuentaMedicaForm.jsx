import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { TextField } from '../atoms/TextField';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import { aseguradoraService } from '../../services/api/aseguradoraService';
import { pacienteService } from '../../services/api/pacienteService';
import { procedimientoService } from '../../services/api/procedimientoService';

export const CreateCuentaMedicaForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    id_paciente: '',
    id_aseguradora: '',
    historiaclinica: '',
    procedimientos: [],
  });

  const [pacientes, setPacientes] = useState([]);
  const [aseguradoras, setAseguradoras] = useState([]);
  const [catalogoProcedimientos, setCatalogoProcedimientos] = useState([]);
  const [selectedProcedimientoId, setSelectedProcedimientoId] = useState('');
  const [procedimientoValor, setProcedimientoValor] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pacientesData, aseguradorasData, procedimientosData] = await Promise.all([
          pacienteService.listPacientes(),
          aseguradoraService.listAseguradoras(),
          procedimientoService.ListNameProcedimiento(),
        ]);

        setPacientes(pacientesData);
        setAseguradoras(aseguradorasData);
        setCatalogoProcedimientos(procedimientosData);
      } catch {
        setError('Error cargando datos');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProcedimiento = () => {
    const procedimientoId = Number(selectedProcedimientoId);
    const valor = Number(procedimientoValor);

    if (!procedimientoId || !valor || valor <= 0) {
      setError('Selecciona un procedimiento y escribe un valor mayor a cero');
      return;
    }

    const alreadyAdded = formData.procedimientos.some(
      (procedimiento) => procedimiento.id_catalogoprocedimiento === procedimientoId
    );

    if (alreadyAdded) {
      setError('Este procedimiento ya fue agregado');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      procedimientos: [
        ...prev.procedimientos,
        {
          id_catalogoprocedimiento: procedimientoId,
          valor,
        },
      ],
    }));
    setSelectedProcedimientoId('');
    setProcedimientoValor('');
    setError(null);
  };

  const handleRemoveProcedimiento = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      procedimientos: prev.procedimientos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const getProcedimientoLabel = (procedimientoId) => {
    const procedimiento = catalogoProcedimientos.find((item) => item.id === procedimientoId);

    if (!procedimiento) {
      return `Procedimiento ${procedimientoId}`;
    }

    return `${procedimiento.codigocatalogo} - ${procedimiento.nombre}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      if (formData.procedimientos.length === 0) {
        setError('Agrega al menos un procedimiento');
        return;
      }

      await onSubmit({
        ...formData,
        id_paciente: Number(formData.id_paciente),
        id_aseguradora: Number(formData.id_aseguradora),
      });
      setFormData({
        id_paciente: '',
        id_aseguradora: '',
        historiaclinica: '',
        procedimientos: [],
      });
      setSelectedProcedimientoId('');
      setProcedimientoValor('');
    } catch (err) {
      setError(err.message || 'Error al crear cuenta medica');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Crear Nueva Cuenta Medica
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Box>
          <Select
            label="Paciente"
            name="id_paciente"
            value={formData.id_paciente}
            onChange={handleChange}
            options={pacientes.map((p) => ({ value: p.id, label: p.nombre }))}
            required
          />

          <Select
            label="Aseguradora"
            name="id_aseguradora"
            value={formData.id_aseguradora}
            onChange={handleChange}
            options={aseguradoras.map((a) => ({ value: a.id, label: a.nombre }))}
            required
          />

          <TextField
            label="Historia Clinica"
            name="historiaclinica"
            value={formData.historiaclinica}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
        </Box>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Procedimientos
          </Typography>

          <Select
            label="Procedimiento"
            value={selectedProcedimientoId}
            onChange={(event) => setSelectedProcedimientoId(event.target.value)}
            options={catalogoProcedimientos.map((procedimiento) => ({
              value: procedimiento.id,
              label: `${procedimiento.codigocatalogo} - ${procedimiento.nombre}`,
            }))}
          />

          <TextField
            label="Valor"
            type="number"
            value={procedimientoValor}
            onChange={(event) => setProcedimientoValor(event.target.value)}
            inputProps={{ min: 1, step: 1 }}
          />

          <Button
            type="button"
            variant="outlined"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handleAddProcedimiento}
          >
            Agregar procedimiento
          </Button>

          <Divider sx={{ my: 2 }} />

          {formData.procedimientos.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay procedimientos agregados.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {formData.procedimientos.map((procedimiento, index) => (
                <Box
                  key={`${procedimiento.id_catalogoprocedimiento}-${index}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 1,
                    alignItems: 'center',
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">
                      {getProcedimientoLabel(procedimiento.id_catalogoprocedimiento)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Valor: ${procedimiento.valor}
                    </Typography>
                  </Box>
                  <IconButton
                    aria-label="Quitar procedimiento"
                    color="error"
                    onClick={() => handleRemoveProcedimiento(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Creando...' : 'Crear Cuenta Medica'}
      </Button>
    </Box>
  );
};
