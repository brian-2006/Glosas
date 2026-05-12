import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './pages/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateCuentaMedicaPage } from './pages/CreateCuentaMedicaPage';
import { CuentasMedicasPage } from './pages/CuentasMedicasPage';
import { GlosasPage } from './pages/GlosasPage';
import { AseguradoraDashboard } from './pages/AseguradoraDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/crear-cuenta"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateCuentaMedicaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cuentas"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CuentasMedicasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/glosas"
              element={
                <ProtectedRoute requiredRole="admin">
                  <GlosasPage />
                </ProtectedRoute>
              }
            />

            {/* Aseguradora Routes */}
            <Route
              path="/aseguradora"
              element={
                <ProtectedRoute requiredRole="aseguradora">
                  <AseguradoraDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/aseguradora/cuentas"
              element={
                <ProtectedRoute requiredRole="aseguradora">
                  <CuentasMedicasPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
