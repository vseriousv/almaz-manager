'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OutlineServer } from '@/types/server';
import { getServersConfig, syncServersConfig } from '@/lib/utils/server-config';
import AddServerDialog from '@/components/add-server-dialog';
import { 
  Box, 
  Button, 
  Container, 
  Divider,
  Paper, 
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  KeyboardArrowRight as ArrowRightIcon, 
  Key as KeyIcon, 
  Computer as ServerIcon
} from '@mui/icons-material';
import { useLocalization } from '@/lib/utils/i18n';

export default function ServerList() {
  const [servers, setServers] = useState<OutlineServer[]>([]);
  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const theme = useTheme();
  const { t } = useLocalization();

  // Loading the list of servers when the component is mounted
  useEffect(() => {
    // Synchronize data with the server, then load it
    const loadServers = async () => {
      // Synchronization with the server
      try {
        console.log("Starting to load and synchronize servers");
        await syncServersConfig();
        // Get updated data
        const config = await getServersConfig();
        console.log("Loaded servers:", config.servers);
        setServers(config.servers);
      } catch (error) {
        console.error("Error loading servers:", error);
      }
    };

    loadServers();
  }, []);

  // Update the server list after adding a new one
  const handleServerAdded = async (server: OutlineServer) => {
    console.log("Added new server:", server);
    
    // Instead of simply adding to the local state, reload data from the server
    try {
      console.log("Loading updated server list after addition");
      
      // Wait a bit before making the API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Synchronization with the server
      await syncServersConfig();
      // Get updated data
      const config = await getServersConfig();
      console.log("Loaded servers after addition:", config.servers);
      setServers(config.servers);
    } catch (error) {
      console.error("Error reloading servers after adding:", error);
      // If reload failed, just add to the current state
      setServers(prev => [...prev, server]);
    }
    
    setIsAddServerDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            {t('servers.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('servers.manage')}
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setIsAddServerDialogOpen(true)}
        >
          {t('servers.add')}
        </Button>
      </Box>

      {servers.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            bgcolor: 'background.default',
            borderStyle: 'dashed',
            borderWidth: 2
          }}
        >
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: '50%',
              bgcolor: theme.palette.primary.main + '10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image 
              src="/android-chrome-192x192.png" 
              alt="Almaz Logo"
              width={40} 
              height={40}
              style={{ borderRadius: '4px' }}
            />
          </Box>
          <Typography variant="h6" textAlign="center" color="text.secondary" mb={3}>
            {t('servers.noServers')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddServerDialogOpen(true)}
          >
            {t('servers.addFirst')}
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {servers.map((server, index) => (
              <ListItem
                key={server.id}
                component={Link}
                href={`/server/${server.id}`}
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: index < servers.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    <ServerIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" fontWeight="medium">
                      {server.name}
                    </Typography>
                  }
                  secondary={
                    <Typography component="div" variant="body2">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <KeyIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" component="span">
                            {server.count_keys !== undefined ? 
                              t('servers.keyCount', { count: server.count_keys }) : 
                              t('servers.keyCount', { count: server.keys?.length || 0 })
                            }
                          </Typography>
                        </Box>
                        
                        {server.port && (
                          <Chip 
                            size="small" 
                            label={t('servers.port', { port: server.port })} 
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        )}
                      </Box>
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="Manage">
                    <ArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <AddServerDialog 
        isOpen={isAddServerDialogOpen} 
        onClose={() => setIsAddServerDialogOpen(false)} 
        onServerAdded={handleServerAdded}
      />
    </Container>
  );
} 