import { useState } from 'react';
import { Box, IconButton, Container } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Header } from '../organisms/Header';
import { Sidebar } from '../organisms/Sidebar';

export const LayoutAseguradora = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: 3,
            mt: 1,
          }}
        >
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ mb: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
