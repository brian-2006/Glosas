import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Crear Cuenta Médica', path: '/admin/crear-cuenta' },
    { label: 'Cuentas Médicas', path: '/admin/cuentas' },
    { label: 'Glosas', path: '/admin/glosas' },
  ];

  const aseguradoraMenuItems = [
    { label: 'Mi Panel', path: '/aseguradora' },
    { label: 'Mis Cuentas', path: '/aseguradora/cuentas' },
  ];

  const menuItems = user?.rol === 'admin' ? adminMenuItems : aseguradoraMenuItems;

  return (
    <Drawer open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};
