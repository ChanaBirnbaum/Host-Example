import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';

interface HostLayoutProps {
  children: ReactNode;
  services?: { name: string; path: string }[]; // לשימוש בצד הניווט
}

const drawerWidth = 240;

const Layout: React.FC<HostLayoutProps> = ({ children, services = [] }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            מערכת מארחת - Host
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {services.map((service) => (
              <ListItem button key={service.name} onClick={() => window.location.href = service.path}>
                <ListItemText primary={service.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* תוכן */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
          marginTop: '64px', // גובה ה־AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
