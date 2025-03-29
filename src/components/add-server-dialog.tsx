'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OutlineServer } from '@/types/server';
import { addServer, parseAccessFileConfig } from '@/lib/utils/server-config';
import { useLocalization } from '@/lib/utils/i18n';
import { useServerStore } from '@/stores/server-store';
import { logger } from '@/lib/utils/logger';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  FormHelperText,
  FormControl
} from '@mui/material';

// Validation schema for the server addition form
const formSchema = z.object({
  name: z.string().min(1, 'Server name is required'),
  apiUrl: z.string().url('Enter a valid URL').min(1, 'API URL is required'),
  certSha256: z.string().min(1, 'Fingerprint of the certificate is required'),
  port: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Schema for JSON import
const jsonImportSchema = z.object({
  jsonConfig: z.string().min(1, 'JSON configuration is required'),
});

// Schema for configuration file import
const fileImportSchema = z.object({
  fileContent: z.string().min(1, 'File content is required'),
});

interface AddServerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onServerAdded: (server: OutlineServer) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function AddServerDialog({ isOpen, onClose, onServerAdded }: AddServerDialogProps) {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState(0);
  const addServerToStore = useServerStore((state) => state.addServer);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Form for manual input
  const { 
    register: registerManual, 
    handleSubmit: handleManualSubmit, 
    formState: { errors: manualErrors, isSubmitting: isManualSubmitting },
    reset: resetManual
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      apiUrl: '',
      certSha256: '',
      port: '',
    },
  });

  // Form for importing from access.txt file
  const { 
    register: registerFile, 
    handleSubmit: handleFileSubmit, 
    formState: { errors: fileErrors, isSubmitting: isFileSubmitting },
    reset: resetFile
  } = useForm<z.infer<typeof fileImportSchema>>({
    resolver: zodResolver(fileImportSchema),
  });

  // Form for importing from JSON
  const { 
    register: registerJson, 
    handleSubmit: handleJsonSubmit, 
    formState: { errors: jsonErrors, isSubmitting: isJsonSubmitting },
    reset: resetJson
  } = useForm<z.infer<typeof jsonImportSchema>>({
    resolver: zodResolver(jsonImportSchema),
  });

  // Manual input form submission handler
  const onManualSubmit = async (data: FormValues) => {
    logger.info("Adding server (manual input):", data);
    const port = data.port ? parseInt(data.port, 10) : undefined;
    
    try {
      // Use the function from the store
      const server = await addServerToStore(data.name, data.apiUrl, data.certSha256, port);
      logger.info("Server added:", server);
      
      // Check synchronization with the server
      try {
        // Wait a bit before making an API request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Make a request to the server to verify the save
        const response = await fetch('/api/servers');
        const responseData = await response.json();
        logger.debug("Checking server save:", responseData);
      } catch (error) {
        logger.error("Error checking synchronization:", error);
      }
      
      onServerAdded(server);
      resetManual();
      onClose();
    } catch (error) {
      logger.error("Error adding server:", error);
    }
  };

  // File import handler
  const onFileSubmit = async (data: z.infer<typeof fileImportSchema>) => {
    const parsedConfig = parseAccessFileConfig(data.fileContent);
    
    if (parsedConfig) {
      try {
        const server = await addServerToStore(
          `Server ${Date.now()}`, // Generate a name based on the timestamp
          parsedConfig.apiUrl,
          parsedConfig.certSha256
        );
        onServerAdded(server);
        resetFile();
        onClose();
      } catch (error) {
        logger.error("Error importing server from file:", error);
      }
    }
  };

  // JSON import handler
  const onJsonSubmit = async (data: z.infer<typeof jsonImportSchema>) => {
    try {
      const jsonData = JSON.parse(data.jsonConfig);
      
      if (jsonData.apiUrl && jsonData.certSha256) {
        // Almaz Manager format
        const server = await addServerToStore(
          jsonData.name || `Server ${Date.now()}`, 
          jsonData.apiUrl,
          jsonData.certSha256,
          jsonData.port
        );
        onServerAdded(server);
      }
      resetJson();
      onClose();
    } catch (error) {
      logger.error('Error parsing JSON:', error);
    }
  };

  // Clear forms when closing
  const handleDialogClose = () => {
    resetManual();
    resetFile();
    resetJson();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('servers.add.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('servers.add.description')}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="server addition method tabs">
            <Tab label={t('servers.add.manualTab')} {...a11yProps(0)} />
            <Tab label={t('servers.add.fileTab')} {...a11yProps(1)} />
            <Tab label={t('servers.add.jsonTab')} {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <form onSubmit={handleManualSubmit(onManualSubmit)}>
            <TextField
              margin="dense"
              label={t('servers.add.name')}
              fullWidth
              variant="outlined"
              {...registerManual('name')}
              error={!!manualErrors.name}
              helperText={manualErrors.name?.message}
              placeholder={t('servers.add.namePlaceholder')}
            />
            <TextField
              margin="dense"
              label={t('servers.add.apiUrl')}
              fullWidth
              variant="outlined"
              {...registerManual('apiUrl')}
              error={!!manualErrors.apiUrl}
              helperText={manualErrors.apiUrl?.message}
              placeholder={t('servers.add.apiUrlPlaceholder')}
            />
            <TextField
              margin="dense"
              label={t('servers.add.certSha256')}
              fullWidth
              variant="outlined"
              {...registerManual('certSha256')}
              error={!!manualErrors.certSha256}
              helperText={manualErrors.certSha256?.message}
              placeholder={t('servers.add.certSha256Placeholder')}
            />
            <TextField
              margin="dense"
              label={t('servers.add.port')}
              fullWidth
              variant="outlined"
              type="number"
              inputProps={{ min: 1, max: 65535 }}
              {...registerManual('port')}
              error={!!manualErrors.port}
              helperText={manualErrors.port?.message}
              placeholder={t('servers.add.portPlaceholder')}
            />
          </form>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <form onSubmit={handleFileSubmit(onFileSubmit)} id="file-form">
            <FormControl error={!!fileErrors.fileContent} fullWidth>
              <TextField
                label={t('servers.add.fileContent')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                {...registerFile('fileContent')}
                placeholder="apiUrl,certSha256"
                error={!!fileErrors.fileContent}
                helperText={fileErrors.fileContent?.message || t('servers.add.fileFormat')}
              />
            </FormControl>
          </form>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <form onSubmit={handleJsonSubmit(onJsonSubmit)} id="json-form">
            <FormControl error={!!jsonErrors.jsonConfig} fullWidth>
              <TextField
                label={t('servers.add.jsonConfig')}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                {...registerJson('jsonConfig')}
                placeholder='{"apiUrl": "https://...", "certSha256": "..."}'
                error={!!jsonErrors.jsonConfig}
                helperText={jsonErrors.jsonConfig?.message}
              />
            </FormControl>
          </form>
        </TabPanel>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleDialogClose}>
          {t('ui.cancel')}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={
            activeTab === 0 
              ? handleManualSubmit(onManualSubmit) 
              : activeTab === 1 
                ? handleFileSubmit(onFileSubmit) 
                : handleJsonSubmit(onJsonSubmit)
          }
          disabled={
            (activeTab === 0 && isManualSubmitting) || 
            (activeTab === 1 && isFileSubmitting) || 
            (activeTab === 2 && isJsonSubmitting)
          }
        >
          {t('ui.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 