import { useState, useEffect } from 'react';
import { cuentaMedicaService } from '../services/api/cuentaMedicaService';

export const useCuentasMedicas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCuentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cuentaMedicaService.listCuentasMedicas();
      setCuentas(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createCuenta = async (cuentaData) => {
    try {
      setError(null);
      const newCuenta = await cuentaMedicaService.createCuentaMedica(cuentaData);
      setCuentas([...cuentas, newCuenta]);
      return newCuenta;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  return { cuentas, loading, error, fetchCuentas, createCuenta };
};
