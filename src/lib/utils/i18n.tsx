'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// Types for localization
export type Locale = 'en';
export type Translations = {
  [key: string]: {
    [locale in Locale]: string;
  };
};

// Translations for the application
export const translations: Translations = {
  // Common phrases
  'app.title': {
    en: 'Almaz Manager',
  },
  'app.footer': {
    en: '© {year} Almaz Manager',
  },
  
  // Navigation
  'nav.backToServers': {
    en: 'Back to server list',
  },
  'nav.servers': {
    en: 'Servers',
  },
  'nav.about': {
    en: 'About',
  },
  
  // Actions
  'action.add': {
    en: 'Add',
  },
  'action.edit': {
    en: 'Edit',
  },
  'action.delete': {
    en: 'Delete',
  },
  'action.save': {
    en: 'Save',
  },
  'action.cancel': {
    en: 'Cancel',
  },
  'action.confirm': {
    en: 'Confirm',
  },
  'action.refresh': {
    en: 'Refresh',
  },
  'action.settings': {
    en: 'Settings',
  },
  'action.copy': {
    en: 'Copy',
  },
  'action.copied': {
    en: 'Copied',
  },
  
  // Servers
  'servers.title': {
    en: 'My servers',
  },
  'servers.manage': {
    en: 'Manage your Almaz VPN servers and access keys',
  },
  'servers.add': {
    en: 'Add server',
  },
  'servers.noServers': {
    en: 'No servers added',
  },
  'servers.addFirst': {
    en: 'Add first server',
  },
  'servers.delete.title': {
    en: 'Delete server',
  },
  'servers.delete.confirm': {
    en: 'Are you sure you want to delete this server? This action cannot be undone.',
  },
  'servers.delete.warning': {
    en: 'Deleting the server from the application will not affect the operation of the Outline server itself, but you will lose the ability to manage it through this application.',
  },
  'servers.settings.title': {
    en: 'Server settings',
  },
  'servers.settings.config': {
    en: 'Server configuration',
  },
  'servers.settings.changeSettings': {
    en: 'Change settings',
  },
  'servers.settings.apiUrl': {
    en: 'API URL',
  },
  'servers.settings.fingerprint': {
    en: 'Fingerprint',
  },
  'servers.settings.currentPort': {
    en: 'Current port for new keys',
  },
  'servers.settings.default': {
    en: 'Default',
  },
  'servers.settings.serverName': {
    en: 'Server name',
  },
  'servers.settings.serverNamePlaceholder': {
    en: 'Example: My VPN server',
  },
  'servers.settings.port': {
    en: 'Port for new keys',
  },
  'servers.settings.portPlaceholder': {
    en: 'Example: 12345',
  },
  'servers.settings.portHelp': {
    en: 'Port will be used for all new keys',
  },
  'servers.keyCount': {
    en: '{count} keys',
  },
  'servers.port': {
    en: 'Port: {port}',
  },
  
  // Keys
  'keys.title': {
    en: 'Access keys',
  },
  'keys.manage': {
    en: 'Manage access keys for your users',
  },
  'keys.add': {
    en: 'Add key',
  },
  'keys.add.title': {
    en: 'Add new key',
  },
  'keys.add.description': {
    en: 'Create a new access key for users',
  },
  'keys.add.manualTab': {
    en: 'Manually',
  },
  'keys.add.fileTab': {
    en: 'From file',
  },
  'keys.add.jsonTab': {
    en: 'From JSON',
  },
  'keys.add.name': {
    en: 'Server name',
  },
  'keys.add.namePlaceholder': {
    en: 'My Almaz server',
  },
  'keys.add.apiUrl': {
    en: 'API URL',
  },
  'keys.add.apiUrlPlaceholder': {
    en: 'https://your-server-domain:port/...',
  },
  'keys.add.certSha256': {
    en: 'Certificate fingerprint (SHA-256)',
  },
  'keys.add.certSha256Placeholder': {
    en: 'ABCDEF0123456789...',
  },
  'keys.add.port': {
    en: 'Port (optional)',
  },
  'keys.add.portPlaceholder': {
    en: '12345',
  },
  'keys.name': {
    en: 'Key name',
  },
  'keys.namePlaceholder': {
    en: 'Example: User 1',
  },
  'keys.nameHelp': {
    en: 'Set a clear name so you can easily identify the key owner',
  },
  'keys.id': {
    en: 'ID',
  },
  'keys.port': {
    en: 'Port',
  },
  'keys.method': {
    en: 'Method',
  },
  'keys.limit': {
    en: 'Limit',
  },
  'keys.none': {
    en: 'This server has no access keys',
  },
  'keys.createFirst': {
    en: 'Create first key',
  },
  'keys.deleteConfirm': {
    en: 'Are you sure you want to delete this key?',
  },
  'keys.loading': {
    en: 'Loading keys...',
  },
  'keys.creating': {
    en: 'Creating...',
  },
  'keys.createKey': {
    en: 'Create key',
  },
  'keys.loadError': {
    en: 'Loading error',
  },
  'keys.loadingError': {
    en: 'Failed to load access keys. Check your connection to the server.',
  },
  'keys.tryAgain': {
    en: 'Try again',
  },
  'keys.showingCount': {
    en: 'Showing {shown} of {total} keys on page {page} of {pages}',
  },
  'keys.groups.group': {
    en: 'Group',
  },
  'keys.groups.loading': {
    en: 'Loading all keys for grouping...',
  },
  'keys.groups.refreshAll': {
    en: 'Refresh all keys',
  },
  'keys.groups.info': {
    en: 'Keys grouped by {groupCount} groups ({keyCount} keys)',
  },
  
  // Errors
  'error.title': {
    en: 'Error',
  },
  'error.serverNotFound': {
    en: 'Server not found',
  },
  'error.serverNotFoundDesc': {
    en: 'The requested server does not exist or has been deleted',
  },
  'error.addKeyFailed': {
    en: 'Failed to create key',
  },
  'error.deleteKeyFailed': {
    en: 'Failed to delete key',
  },
  'error.copyFailed': {
    en: 'Failed to copy link',
  },
  'error.updateServerFailed': {
    en: 'Failed to update server settings',
  },
  
  // UI components
  'ui.language': {
    en: 'Language',
  },
  'ui.theme': {
    en: 'Theme',
  },
  'ui.close': {
    en: 'Close',
  },
  'ui.loading': {
    en: 'Loading...',
  },
  'ui.loadingServer': {
    en: 'Loading server...',
  },
  'ui.loadingGroups': {
    en: 'Loading groups...',
  },
  'ui.saving': {
    en: 'Saving...',
  },
  'ui.refreshing': {
    en: 'Refreshing...',
  },
  'servers.add.title': {
    en: 'Add Almaz Server',
  },
  'servers.add.description': {
    en: 'Add a new Almaz server to manage',
  },
  'servers.add.manualTab': {
    en: 'Manually',
  },
  'servers.add.fileTab': {
    en: 'From file',
  },
  'servers.add.jsonTab': {
    en: 'From JSON',
  },
  'servers.add.name': {
    en: 'Server name',
  },
  'servers.add.namePlaceholder': {
    en: 'My Almaz server',
  },
  'servers.add.apiUrl': {
    en: 'API URL',
  },
  'servers.add.apiUrlPlaceholder': {
    en: 'https://your-server-domain:port/...',
  },
  'servers.add.certSha256': {
    en: 'Certificate fingerprint (SHA-256)',
  },
  'servers.add.certSha256Placeholder': {
    en: 'ABCDEF0123456789...',
  },
  'servers.add.port': {
    en: 'Port (optional)',
  },
  'servers.add.portPlaceholder': {
    en: '12345',
  },
  'servers.add.fileContent': {
    en: 'Access.txt file content',
  },
  'servers.add.fileFormat': {
    en: 'Format: apiUrl,certSha256',
  },
  'servers.add.jsonConfig': {
    en: 'JSON configuration',
  },
  'ui.cancel': {
    en: 'Cancel',
  },
  'ui.add': {
    en: 'Add',
  },
  'ui.save': {
    en: 'Save',
  },
  'ui.delete': {
    en: 'Delete',
  },
  'ui.edit': {
    en: 'Edit',
  },
  'footer.copyright': {
    en: '© {year} ',
  },
  'ui.backToServers': {
    en: 'Back to servers',
  },
};

// Function to get translation
export const getTranslation = (key: string, locale: Locale, params?: Record<string, string | number>): string => {
  const translation = translations[key]?.[locale];
  
  if (!translation) {
    console.warn(`Translation missing for key "${key}" in locale "${locale}"`);
    return key;
  }
  
  // Replace parameters in string
  if (params) {
    return Object.entries(params).reduce((result, [param, value]) => {
      return result.replace(new RegExp(`{${param}}`, 'g'), String(value));
    }, translation);
  }
  
  return translation;
};

// Localization context
type LocalizationContextType = {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

export const LocalizationContext = createContext<LocalizationContextType | null>(null);

// Hook for using localization
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// Localization provider
export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  
  // Load locale from localStorage during initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale | null;
      if (savedLocale === 'en') {
        setLocaleState(savedLocale);
      }
    }
  }, []);
  
  // Function to change locale
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Also change the lang attribute for HTML
      document.documentElement.lang = newLocale;
    }
  };
  
  // Translation function
  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(key, locale, params);
  };
  
  return (
    <LocalizationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocalizationContext.Provider>
  );
}; 