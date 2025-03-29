'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OutlineServer, OutlineKey } from '@/types/server';
import { getServersConfig, updateServer, deleteServer } from '@/lib/utils/server-config';
import { OutlineApiClient } from '@/lib/utils/outline-api';
import { useLocalization } from '@/lib/utils/i18n';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Paper,
  Divider,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Stack,
  Pagination,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Badge,
  ListItemIcon
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  DeleteOutline as TrashIcon,
  ArrowBack as ArrowLeftIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Computer as ServerIcon,
  Key as KeyIcon,
  AccessTime as ClockIcon,
  NetworkCheck as NetworkIcon,
  Shield as ShieldIcon,
  Error as AlertCircleIcon,
  KeyboardArrowLeft as ChevronLeftIcon,
  Check as CheckIcon,
  OpenInNew as ExternalLinkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Group as GroupIcon
} from '@mui/icons-material';

interface ServerDetailProps {
  serverId: string;
}

export default function ServerDetail({ serverId }: ServerDetailProps) {
  const router = useRouter();
  const [server, setServer] = useState<OutlineServer | null>(null);
  const [keys, setKeys] = useState<OutlineKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();
  
  // States for dialogs and forms
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [isEditServerDialogOpen, setIsEditServerDialogOpen] = useState(false);
  const [isDeleteServerDialogOpen, setIsDeleteServerDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [editServerName, setEditServerName] = useState('');
  const [editServerPort, setEditServerPort] = useState<string>('');
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [isEditingServer, setIsEditingServer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // States for pagination
  const [page, setPage] = useState(1);
  const [totalKeys, setTotalKeys] = useState(0);
  const keysPerPage = 9; // Number of keys per page

  // State for grouping
  const [isGrouped, setIsGrouped] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [allKeys, setAllKeys] = useState<OutlineKey[]>([]); // All keys for grouping
  const [isLoadingAllKeys, setIsLoadingAllKeys] = useState(false);

  // Loading server data
  useEffect(() => {
    const loadServerData = async () => {
      try {
        const config = await getServersConfig();
        if (config && config.servers) {
          const foundServer = config.servers.find((s) => s.id === serverId);
          
          if (foundServer) {
            setServer(foundServer);
            setEditServerName(foundServer.name);
            setEditServerPort(foundServer.port?.toString() || '');
            loadKeys(foundServer);
          } else {
            setError(t('error.serverNotFound'));
            setLoading(false);
          }
        } else {
          setError('Configuration is empty or invalid');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading server configuration:', error);
        setError('Failed to load server configuration');
        setLoading(false);
      }
    };
    
    loadServerData();
  }, [serverId, t]);

  // Reset the copy indicator
  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => {
        setCopiedKey(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copiedKey]);

  // Loading server keys with pagination
  const loadKeys = async (server: OutlineServer) => {
    setError(null);
    if (page === 1) setLoading(true);
    else setRefreshing(true);
    
    try {
      const offset = (page - 1) * keysPerPage;
      console.log(`Loading keys for page ${page}, offset=${offset}, limit=${keysPerPage}`);
      
      // Create API client
      const client = new OutlineApiClient(server);
      
      // Get keys with pagination
      const result = await client.getKeys(keysPerPage, offset);
      console.log(`Loaded ${result.keys.length} keys out of ${result.total}`);
      
      setKeys(result.keys);
      setTotalKeys(result.total);
      
      // Update count_keys field and save updated server
      if (server.count_keys !== result.total) {
        const updatedServer = {
          ...server,
          count_keys: result.total
        };
        setServer(updatedServer);
        await updateServer(server.id, updatedServer);
        console.log(`Updated count_keys field: ${result.total}`);
      }
      
      return result;
    } catch (error) {
      console.error("Error loading keys:", error);
      setError("Failed to load keys");
      return { keys: [], total: 0 };
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Page change handler
  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  // Effect for loading keys when page changes
  useEffect(() => {
    if (server) {
      loadKeys(server);
    }
  }, [server, page]);

  // Adding a new key
  const handleAddKey = async () => {
    if (!server) return;
    
    try {
      setIsAddingKey(true);
      const client = new OutlineApiClient(server);
      
      // Create a new key with name
      const newKeyName = `Key ${new Date().toLocaleDateString()}`;
      const newKey = await client.createKey(newKeyName);
      
      // Update the list of keys and server
      const updatedKeys = [...keys, newKey];
      setKeys(updatedKeys);
      
      // Update total count
      const newTotal = totalKeys + 1;
      setTotalKeys(newTotal);
      
      // Update server with new count_keys
      const updatedServer = {
        ...server,
        count_keys: newTotal
      };
      await updateServer(server.id, updatedServer);
      setServer(updatedServer);
      
      // If we are using grouping and all keys are loaded, add the new key to the full list too
      if (allKeys.length > 0) {
        setAllKeys([...allKeys, newKey]);
      }
      
      setNewKeyName('');
      setIsAddKeyDialogOpen(false);
    } catch (error) {
      console.error("Error adding key:", error);
      setError("Failed to add key");
      setIsAddingKey(false);
    }
  };

  // Deleting a key
  const handleDeleteKey = async (keyId: string) => {
    if (!server) return;
    
    try {
      const deletingKeyId = keyId;
      const client = new OutlineApiClient(server);
      
      // Delete the key
      await client.deleteKey(keyId);
      
      // Update the list of keys and server
      const updatedKeys = keys.filter(key => key.id !== keyId);
      setKeys(updatedKeys);
      
      // Update total count
      const newTotal = totalKeys - 1;
      setTotalKeys(newTotal);
      
      // Update server with new count_keys
      const updatedServer: OutlineServer = {
        ...server,
        count_keys: newTotal
      };
      await updateServer(server.id, updatedServer);
      setServer(updatedServer);
      
      // If we are using grouping and all keys are loaded, delete the key from the full list too
      if (allKeys.length > 0) {
        setAllKeys(allKeys.filter((key) => key.id !== keyId));
      }
    } catch (error) {
      console.error('Error deleting key:', error);
      setError(t('error.deleteKeyFailed'));
    }
  };

  // Copy key link
  const handleCopyAccessUrl = (keyId: string, accessUrl: string) => {
    navigator.clipboard.writeText(accessUrl)
      .then(() => {
        setCopiedKey(keyId);
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        setError(t('error.copyFailed'));
      });
  };

  // Update server settings
  const handleUpdateServer = async () => {
    if (!server) return;
    
    setIsEditingServer(true);
    setError(null); // Reset previous error
    
    try {
      const apiClient = new OutlineApiClient(server);
      
      // Update name if it changed
      if (editServerName !== server.name) {
        try {
          await apiClient.setServerName(editServerName);
          console.log("Server name successfully updated");
        } catch (nameError: any) {
          console.error("Error updating server name:", nameError);
          throw new Error(`Error updating server name: ${nameError.message || "Unknown error"}`);
        }
      }
      
      // Update port if it changed
      const newPort = editServerPort ? parseInt(editServerPort, 10) : undefined;
      if (newPort && (newPort !== server.port)) {
        try {
          await apiClient.setServerPort(newPort);
          console.log("Server port successfully updated");
        } catch (portError: any) {
          console.error("Error updating server port:", portError);
          throw new Error(`Error updating server port: ${portError.message || "Unknown error"}`);
        }
      }
      
      // Update local server data
      const updatedServer = {
        ...server,
        name: editServerName,
        port: newPort,
      };
      
      setServer(updatedServer);
      await updateServer(server.id, updatedServer);
      setIsEditServerDialogOpen(false);
      console.log("Server settings successfully updated");
    } catch (err: any) {
      console.error('Error updating server:', err);
      setError(`Failed to update server settings: ${err.message || "Unknown error"}`);
    } finally {
      setIsEditingServer(false);
    }
  };

  // Delete server
  const handleDeleteServer = () => {
    if (!server) return;
    
    deleteServer(server.id);
    router.push('/');
  };

  // Format data limit size
  const formatDataLimit = (bytes: number) => {
    const GB = bytes / (1024 * 1024 * 1024);
    return `${GB.toFixed(2)} GB`;
  };

  // Format creation date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      // Check that the date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  // Load all keys for grouping
  const loadAllKeys = async (server: OutlineServer) => {
    if (allKeys.length > 0) return; // If keys are already loaded, don't load again
    
    setIsLoadingAllKeys(true);
    try {
      console.log("Loading all keys for grouping");
      const client = new OutlineApiClient(server);
      const allServerKeys = await client.getAllKeys();
      console.log(`Loaded a total of ${allServerKeys.length} keys`);
      setAllKeys(allServerKeys);
      
      // Update count_keys if the count is different
      if (server.count_keys !== allServerKeys.length) {
        const updatedServer = {
          ...server,
          count_keys: allServerKeys.length
        };
        setServer(updatedServer);
        await updateServer(server.id, updatedServer);
        console.log(`Updated count_keys field when loading all keys: ${allServerKeys.length}`);
      }
    } catch (error) {
      console.error("Error loading all keys:", error);
      // If failed to load all keys, we'll use the current page
    } finally {
      setIsLoadingAllKeys(false);
    }
  };

  // Toggle grouping
  const handleToggleGrouping = async () => {
    const newGroupedState = !isGrouped;
    setIsGrouped(newGroupedState);
    
    // When enabling grouping, load all keys if they are not loaded yet
    if (newGroupedState && server && allKeys.length === 0) {
      await loadAllKeys(server);
    }
  };

  // Toggle group display
  const handleToggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Group keys by name
  const getGroupedKeys = () => {
    // Use all keys for grouping if they are loaded
    const keysToGroup = allKeys.length > 0 ? allKeys : keys;
    
    if (!keysToGroup.length) return {};
    
    // Group keys by name
    const grouped: Record<string, OutlineKey[]> = {};
    
    keysToGroup.forEach(key => {
      const name = key.name.trim();
      if (!grouped[name]) {
        grouped[name] = [];
      }
      grouped[name].push(key);
    });
    
    // Sort by number of keys (from highest to lowest)
    return Object.fromEntries(
      Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)
    );
  };

  if (loading && !server) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="text.secondary">{t('ui.loadingServer')}</Typography>
        </Box>
      </Box>
    );
  }

  if (error && !server) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 10, 
          textAlign: 'center' 
        }}>
          <Box sx={{ 
            bgcolor: 'error.light', 
            p: 2, 
            borderRadius: '50%', 
            mb: 2
          }}>
            <AlertCircleIcon sx={{ fontSize: 40, color: 'error.main' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" mb={1}>Error</Typography>
          <Typography color="text.secondary" mb={3} maxWidth="md">{error}</Typography>
          <Button 
            variant="contained" 
            startIcon={<ChevronLeftIcon />} 
            onClick={() => router.push('/')}
          >
            Back to server list
          </Button>
        </Box>
      </Container>
    );
  }

  if (!server) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 10, 
          textAlign: 'center' 
        }}>
          <Box sx={{ 
            bgcolor: 'action.hover', 
            p: 2, 
            borderRadius: '50%', 
            mb: 2
          }}>
            <ServerIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" mb={1}>Server not found</Typography>
          <Typography color="text.secondary" mb={3} maxWidth="md">
            The requested server does not exist or has been deleted
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ChevronLeftIcon />} 
            onClick={() => router.push('/')}
          >
            Back to server list
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={4}>
        {/* Page header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { md: 'center' }, 
          justifyContent: 'space-between', 
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <IconButton 
              sx={{ 
                borderRadius: '50%', 
                border: '1px solid', 
                borderColor: 'divider',
                p: 1
              }}
              onClick={() => router.push('/')}
            >
              <ArrowLeftIcon fontSize="small" />
            </IconButton>
            
            <Box>
              <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <ServerIcon sx={{ color: 'primary.main', display: { xs: 'none', sm: 'inline' } }} />
                {server.name}
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => loadKeys(server)}
              disabled={loading}
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setIsEditServerDialogOpen(true)}
              sx={{ minWidth: 120 }}
            >
              Settings
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<TrashIcon />}
              onClick={handleDeleteServer}
              sx={{ minWidth: 120 }}
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Keys section */}
        <Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { sm: 'center' }, 
            justifyContent: 'space-between', 
            mb: 2,
            gap: 2
          }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                <KeyIcon sx={{ color: 'primary.main' }} />
                {t('keys.title')}
                <Chip 
                  label={totalKeys} 
                  size="small" 
                  variant="outlined" 
                  sx={{ ml: 1, bgcolor: 'action.hover' }} 
                />
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {t('keys.manage')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isGrouped}
                    onChange={handleToggleGrouping}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GroupIcon fontSize="small" />
                    <Typography variant="body2">{t('keys.groups.group')}</Typography>
                  </Box>
                }
                sx={{ mr: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setIsAddKeyDialogOpen(true)}
              >
                {t('keys.add')}
              </Button>
            </Box>
          </Box>

          {/* Keys section content */}
          {loading && page === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography color="text.secondary">{t('keys.loading')}</Typography>
              </Box>
            </Box>
          ) : error ? (
            <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                    <AlertCircleIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      {t('keys.loadError')}
                    </Typography>
                  </Box>
                }
              />
              <CardContent>
                <Typography>{error}</Typography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />}
                  onClick={() => loadKeys(server)}
                  fullWidth
                >
                  {t('keys.tryAgain')}
                </Button>
              </CardActions>
            </Card>
          ) : keys.length === 0 && totalKeys === 0 ? (
            <Paper 
              variant="outlined" 
              sx={{ 
                borderStyle: 'dashed', 
                borderWidth: 2, 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                bgcolor: 'background.default'
              }}
            >
              <Typography variant="h6" textAlign="center" color="text.secondary" fontWeight="normal" mb={1}>
                This server has no access keys
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                Create access keys so your users can connect to the VPN
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setIsAddKeyDialogOpen(true)}
              >
                Create first key
              </Button>
            </Paper>
          ) : isGrouped ? (
            // Grouped display of keys
            <>
              {isLoadingAllKeys ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} sx={{ mb: 2 }} />
                    <Typography color="text.secondary">Loading all keys for grouping...</Typography>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={() => { 
                        setAllKeys([]); // Reset current keys
                        loadAllKeys(server);
                      }}
                      disabled={isLoadingAllKeys}
                    >
                      Refresh all keys
                    </Button>
                  </Box>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <List sx={{ bgcolor: 'background.paper' }}>
                      {Object.entries(getGroupedKeys()).map(([groupName, groupKeys]) => {
                        const isExpanded = expandedGroups[groupName] || false;
                        
                        return (
                          <Box key={groupName}>
                            <ListItem 
                              onClick={() => handleToggleGroup(groupName)}
                              disablePadding
                              sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider',
                                bgcolor: isExpanded ? 'action.hover' : 'transparent',
                                '&:hover': {
                                  bgcolor: 'action.hover'
                                },
                                p: 1.5,
                                cursor: 'pointer'
                              }}
                            >
                              <ListItemText 
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ShieldIcon fontSize="small" color="primary" />
                                    <Typography fontWeight="bold">{groupName}</Typography>
                                    <Badge 
                                      badgeContent={groupKeys.length} 
                                      color="primary"
                                      sx={{ ml: 1 }}
                                    />
                                  </Box>
                                } 
                              />
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItem>
                            
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <List sx={{ bgcolor: 'action.hover' }}>
                                {groupKeys.map((key) => (
                                  <ListItem
                                    key={key.id}
                                    sx={{
                                      borderBottom: '1px solid',
                                      borderColor: 'divider',
                                      px: 3
                                    }}
                                    secondaryAction={
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                          variant="contained"
                                          size="small"
                                          startIcon={copiedKey === key.id ? <CheckIcon /> : <CopyIcon />}
                                          onClick={() => handleCopyAccessUrl(key.id, key.accessUrl)}
                                        >
                                          {copiedKey === key.id ? t('action.copied') : t('action.copy')}
                                        </Button>
                                        <IconButton
                                          edge="end"
                                          color="error"
                                          onClick={() => handleDeleteKey(key.id)}
                                        >
                                          <TrashIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    }
                                  >
                                    <ListItemIcon>
                                      <KeyIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography fontWeight="medium">
                                          ID: {key.id}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography component="div" variant="body2">
                                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" component="span">
                                              Port: {key.port}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" component="span">
                                              Method: {key.method}
                                            </Typography>
                                            {key.dataLimit && (
                                              <Typography variant="body2" color="text.secondary" component="span">
                                                Limit: {formatDataLimit(key.dataLimit.bytes)}
                                              </Typography>
                                            )}
                                          </Box>
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </Collapse>
                          </Box>
                        );
                      })}
                    </List>
                  </Box>
                </>
              )}
              
              {/* Group information */}
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                {isLoadingAllKeys ? 
                  "Loading groups..." : 
                  `Keys grouped by ${Object.keys(getGroupedKeys()).length} groups (${allKeys.length || keys.length} keys)`
                }
              </Typography>
            </>
          ) : (
            <>
              <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <List>
                  {keys.map((key) => (
                    <ListItem
                      key={key.id}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        px: 3,
                        py: 1.5
                      }}
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={copiedKey === key.id ? <CheckIcon /> : <CopyIcon />}
                            onClick={() => handleCopyAccessUrl(key.id, key.accessUrl)}
                          >
                            {copiedKey === key.id ? t('action.copied') : t('action.copy')}
                          </Button>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <TrashIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>
                        <ShieldIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight="medium">
                            {key.name}
                          </Typography>
                        }
                        secondary={
                          <Typography component="div" variant="body2">
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, md: 2 }, mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" component="span">
                                ID: {key.id}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="span">
                                Port: {key.port}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" component="span">
                                Method: {key.method}
                              </Typography>
                              {key.dataLimit && (
                                <Typography variant="body2" color="text.secondary" component="span">
                                  Limit: {formatDataLimit(key.dataLimit.bytes)}
                                </Typography>
                              )}
                            </Box>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
              
              {refreshing && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  zIndex: 2
                }}>
                  <CircularProgress />
                </Box>
              )}
              
              {/* Pagination */}
              {!isGrouped && keys.length > 0 && totalKeys > keysPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={Math.ceil(totalKeys / keysPerPage)} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                    disabled={refreshing}
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
              
              {/* Count information */}
              {!isGrouped && keys.length > 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Showing {keys.length} of {totalKeys} keys on page {page} of {Math.ceil(totalKeys / keysPerPage)}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Stack>

      {/* Dialog for adding a key */}
      <Dialog open={isAddKeyDialogOpen} onClose={() => setIsAddKeyDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add new access key</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Create a new access key for users
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Key name"
              size="small"
              name="name"
              placeholder="Example: User 1"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              helperText="Set a clear name so you can easily identify the key owner"
              disabled={isAddingKey}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setIsAddKeyDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddKey} 
            disabled={isAddingKey || !newKeyName.trim()}
            startIcon={isAddingKey ? <CircularProgress size={20} /> : <AddIcon />}
          >
            {isAddingKey ? 'Creating...' : 'Create key'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for server settings - adding extended server information */}
      <Dialog open={isEditServerDialogOpen} onClose={() => setIsEditServerDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Server settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Server configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              API URL
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
              {server.apiUrl}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Fingerprint
            </Typography>
            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all', mb: 2 }}>
              {server.certSha256}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Current port for new keys
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {server.port || 'Default'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Change settings
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Server name"
              size="small"
              value={editServerName}
              onChange={(e) => setEditServerName(e.target.value)}
              placeholder="Example: My VPN server"
              disabled={isEditingServer}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Port for new keys"
              type="number"
              size="small"
              value={editServerPort}
              onChange={(e) => setEditServerPort(e.target.value)}
              placeholder="Example: 12345"
              inputProps={{ min: 1, max: 65535 }}
              helperText="Port will be used for all new keys"
              disabled={isEditingServer}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setIsEditServerDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateServer} 
            disabled={isEditingServer || !editServerName.trim()}
            startIcon={isEditingServer ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isEditingServer ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting server */}
      <Dialog open={isDeleteServerDialogOpen} onClose={() => setIsDeleteServerDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Delete server</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this server? This action cannot be undone.
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 3 }}>
            <AlertTitle>Warning</AlertTitle>
            Deleting the server from the application will not affect the operation of the server itself, 
            but you will lose the ability to manage it through this application.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setIsDeleteServerDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteServer}
            startIcon={<TrashIcon />}
          >
            Delete server
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 