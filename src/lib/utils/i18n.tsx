'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// Types for localization
export type Locale = 'ru' | 'en';
export type Translations = {
  [key: string]: {
    [locale in Locale]: string;
  };
};

// Translations for the application
export const translations: Translations = {
  // Common phrases
  'app.title': {
    ru: 'Almaz Manager',
    en: 'Almaz Manager',
  },
  'app.footer': {
    ru: '© {year} Almaz Manager',
    en: '© {year} Almaz Manager',
  },
  
  // Navigation
  'nav.backToServers': {
    ru: 'Назад к списку серверов',
    en: 'Back to server list',
  },
  'nav.servers': {
    ru: 'Серверы',
    en: 'Servers',
  },
  'nav.about': {
    ru: 'О проекте',
    en: 'About',
  },
  
  // Actions
  'action.add': {
    ru: 'Добавить',
    en: 'Add',
  },
  'action.edit': {
    ru: 'Редактировать',
    en: 'Edit',
  },
  'action.delete': {
    ru: 'Удалить',
    en: 'Delete',
  },
  'action.save': {
    ru: 'Сохранить',
    en: 'Save',
  },
  'action.cancel': {
    ru: 'Отмена',
    en: 'Cancel',
  },
  'action.confirm': {
    ru: 'Подтвердить',
    en: 'Confirm',
  },
  'action.refresh': {
    ru: 'Обновить',
    en: 'Refresh',
  },
  'action.settings': {
    ru: 'Настройки',
    en: 'Settings',
  },
  'action.copy': {
    ru: 'Копировать',
    en: 'Copy',
  },
  'action.copied': {
    ru: 'Скопировано',
    en: 'Copied',
  },
  
  // Servers
  'servers.title': {
    ru: 'Мои серверы',
    en: 'My servers',
  },
  'servers.manage': {
    ru: 'Управляйте вашими серверами Almaz VPN и ключами доступа',
    en: 'Manage your Almaz VPN servers and access keys',
  },
  'servers.add': {
    ru: 'Добавить сервер',
    en: 'Add server',
  },
  'servers.noServers': {
    ru: 'Нет добавленных серверов',
    en: 'No servers added',
  },
  'servers.addFirst': {
    ru: 'Добавить первый сервер',
    en: 'Add first server',
  },
  'servers.delete.title': {
    ru: 'Удалить сервер',
    en: 'Delete server',
  },
  'servers.delete.confirm': {
    ru: 'Вы уверены, что хотите удалить этот сервер? Это действие нельзя отменить.',
    en: 'Are you sure you want to delete this server? This action cannot be undone.',
  },
  'servers.delete.warning': {
    ru: 'Удаление сервера из приложения не повлияет на работу самого сервера Outline, но вы потеряете возможность управлять им через это приложение.',
    en: 'Deleting the server from the application will not affect the operation of the Outline server itself, but you will lose the ability to manage it through this application.',
  },
  'servers.settings.title': {
    ru: 'Настройки сервера',
    en: 'Server settings',
  },
  'servers.settings.config': {
    ru: 'Конфигурация сервера',
    en: 'Server configuration',
  },
  'servers.settings.changeSettings': {
    ru: 'Изменить настройки',
    en: 'Change settings',
  },
  'servers.settings.apiUrl': {
    ru: 'API URL',
    en: 'API URL',
  },
  'servers.settings.fingerprint': {
    ru: 'Fingerprint',
    en: 'Fingerprint',
  },
  'servers.settings.currentPort': {
    ru: 'Текущий порт для новых ключей',
    en: 'Current port for new keys',
  },
  'servers.settings.default': {
    ru: 'По умолчанию',
    en: 'Default',
  },
  'servers.settings.serverName': {
    ru: 'Название сервера',
    en: 'Server name',
  },
  'servers.settings.serverNamePlaceholder': {
    ru: 'Например: Мой сервер VPN',
    en: 'Example: My VPN server',
  },
  'servers.settings.port': {
    ru: 'Порт для новых ключей',
    en: 'Port for new keys',
  },
  'servers.settings.portPlaceholder': {
    ru: 'Например: 12345',
    en: 'Example: 12345',
  },
  'servers.settings.portHelp': {
    ru: 'Порт будет использоваться для всех новых ключей',
    en: 'Port will be used for all new keys',
  },
  'servers.keyCount': {
    ru: '{count} keys',
    en: '{count} keys',
  },
  'servers.port': {
    ru: 'Порт: {port}',
    en: 'Port: {port}',
  },
  
  // Keys
  'keys.title': {
    ru: 'Ключи доступа',
    en: 'Access keys',
  },
  'keys.manage': {
    ru: 'Управляйте ключами доступа для ваших пользователей',
    en: 'Manage access keys for your users',
  },
  'keys.add': {
    ru: 'Добавить ключ',
    en: 'Add key',
  },
  'keys.add.title': {
    ru: 'Добавить новый ключ',
    en: 'Add new key',
  },
  'keys.add.description': {
    ru: 'Создайте новый ключ доступа для пользователей',
    en: 'Create a new access key for users',
  },
  'keys.add.manualTab': {
    ru: 'Вручную',
    en: 'Manually',
  },
  'keys.add.fileTab': {
    ru: 'Из файла',
    en: 'From file',
  },
  'keys.add.jsonTab': {
    ru: 'Из JSON',
    en: 'From JSON',
  },
  'keys.add.name': {
    ru: 'Название сервера',
    en: 'Server name',
  },
  'keys.add.namePlaceholder': {
    ru: 'Мой сервер Almaz',
    en: 'My Almaz server',
  },
  'keys.add.apiUrl': {
    ru: 'API URL',
    en: 'API URL',
  },
  'keys.add.apiUrlPlaceholder': {
    ru: 'https://your-server-domain:port/...',
    en: 'https://your-server-domain:port/...',
  },
  'keys.add.certSha256': {
    ru: 'Fingerprint сертификата (SHA-256)',
    en: 'Certificate fingerprint (SHA-256)',
  },
  'keys.add.certSha256Placeholder': {
    ru: 'ABCDEF0123456789...',
    en: 'ABCDEF0123456789...',
  },
  'keys.add.port': {
    ru: 'Порт (необязательно)',
    en: 'Port (optional)',
  },
  'keys.add.portPlaceholder': {
    ru: '12345',
    en: '12345',
  },
  'keys.name': {
    ru: 'Название ключа',
    en: 'Key name',
  },
  'keys.namePlaceholder': {
    ru: 'Например: Пользователь 1',
    en: 'Example: User 1',
  },
  'keys.nameHelp': {
    ru: 'Задайте понятное название, чтобы можно было легко идентифицировать владельца ключа',
    en: 'Set a clear name so you can easily identify the key owner',
  },
  'keys.id': {
    ru: 'ID',
    en: 'ID',
  },
  'keys.port': {
    ru: 'Порт',
    en: 'Port',
  },
  'keys.method': {
    ru: 'Метод',
    en: 'Method',
  },
  'keys.limit': {
    ru: 'Лимит',
    en: 'Limit',
  },
  'keys.none': {
    ru: 'У этого сервера нет ключей доступа',
    en: 'This server has no access keys',
  },
  'keys.createFirst': {
    ru: 'Создать первый ключ',
    en: 'Create first key',
  },
  'keys.deleteConfirm': {
    ru: 'Вы уверены, что хотите удалить этот ключ?',
    en: 'Are you sure you want to delete this key?',
  },
  'keys.loading': {
    ru: 'Загрузка ключей...',
    en: 'Loading keys...',
  },
  'keys.creating': {
    ru: 'Создание...',
    en: 'Creating...',
  },
  'keys.createKey': {
    ru: 'Создать ключ',
    en: 'Create key',
  },
  'keys.loadError': {
    ru: 'Ошибка загрузки',
    en: 'Loading error',
  },
  'keys.loadingError': {
    ru: 'Не удалось загрузить ключи доступа. Проверьте подключение к серверу.',
    en: 'Failed to load access keys. Check your connection to the server.',
  },
  'keys.tryAgain': {
    ru: 'Попробовать снова',
    en: 'Try again',
  },
  'keys.showingCount': {
    ru: 'Показано {shown} из {total} ключей на странице {page} из {pages}',
    en: 'Showing {shown} of {total} keys on page {page} of {pages}',
  },
  'keys.groups.group': {
    ru: 'Группировать',
    en: 'Group',
  },
  'keys.groups.loading': {
    ru: 'Загрузка всех ключей для группировки...',
    en: 'Loading all keys for grouping...',
  },
  'keys.groups.refreshAll': {
    ru: 'Обновить все ключи',
    en: 'Refresh all keys',
  },
  'keys.groups.info': {
    ru: 'Ключи сгруппированы по {groupCount} группам ({keyCount} ключей)',
    en: 'Keys grouped by {groupCount} groups ({keyCount} keys)',
  },
  
  // Errors
  'error.title': {
    ru: 'Ошибка',
    en: 'Error',
  },
  'error.serverNotFound': {
    ru: 'Сервер не найден',
    en: 'Server not found',
  },
  'error.serverNotFoundDesc': {
    ru: 'Запрашиваемый сервер не существует или был удален',
    en: 'The requested server does not exist or has been deleted',
  },
  'error.addKeyFailed': {
    ru: 'Не удалось создать ключ',
    en: 'Failed to create key',
  },
  'error.deleteKeyFailed': {
    ru: 'Не удалось удалить ключ',
    en: 'Failed to delete key',
  },
  'error.copyFailed': {
    ru: 'Не удалось скопировать ссылку',
    en: 'Failed to copy link',
  },
  'error.updateServerFailed': {
    ru: 'Не удалось обновить настройки сервера',
    en: 'Failed to update server settings',
  },
  
  // UI components
  'ui.language': {
    ru: 'Язык',
    en: 'Language',
  },
  'ui.theme': {
    ru: 'Тема',
    en: 'Theme',
  },
  'ui.close': {
    ru: 'Закрыть',
    en: 'Close',
  },
  'ui.language.ru': {
    ru: 'Русский',
    en: 'Russian',
  },
  'ui.language.en': {
    ru: 'Английский',
    en: 'English',
  },
  'ui.loading': {
    ru: 'Загрузка...',
    en: 'Loading...',
  },
  'ui.loadingServer': {
    ru: 'Загрузка сервера...',
    en: 'Loading server...',
  },
  'ui.loadingGroups': {
    ru: 'Загрузка групп...',
    en: 'Loading groups...',
  },
  'ui.saving': {
    ru: 'Сохранение...',
    en: 'Saving...',
  },
  'ui.refreshing': {
    ru: 'Обновление...',
    en: 'Refreshing...',
  },
  'servers.add.title': {
    ru: 'Добавить сервер Almaz',
    en: 'Add Almaz Server',
  },
  'servers.add.description': {
    ru: 'Добавьте новый сервер Almaz для управления',
    en: 'Add a new Almaz server to manage',
  },
  'servers.add.manualTab': {
    ru: 'Вручную',
    en: 'Manually',
  },
  'servers.add.fileTab': {
    ru: 'Из файла',
    en: 'From file',
  },
  'servers.add.jsonTab': {
    ru: 'Из JSON',
    en: 'From JSON',
  },
  'servers.add.name': {
    ru: 'Название сервера',
    en: 'Server name',
  },
  'servers.add.namePlaceholder': {
    ru: 'Мой сервер Almaz',
    en: 'My Almaz server',
  },
  'servers.add.apiUrl': {
    ru: 'API URL',
    en: 'API URL',
  },
  'servers.add.apiUrlPlaceholder': {
    ru: 'https://your-server-domain:port/...',
    en: 'https://your-server-domain:port/...',
  },
  'servers.add.certSha256': {
    ru: 'Fingerprint сертификата (SHA-256)',
    en: 'Certificate fingerprint (SHA-256)',
  },
  'servers.add.certSha256Placeholder': {
    ru: 'ABCDEF0123456789...',
    en: 'ABCDEF0123456789...',
  },
  'servers.add.port': {
    ru: 'Порт (необязательно)',
    en: 'Port (optional)',
  },
  'servers.add.portPlaceholder': {
    ru: '12345',
    en: '12345',
  },
  'servers.add.fileContent': {
    ru: 'Содержимое файла access.txt',
    en: 'Access.txt file content',
  },
  'servers.add.fileFormat': {
    ru: 'Формат: apiUrl,certSha256',
    en: 'Format: apiUrl,certSha256',
  },
  'servers.add.jsonConfig': {
    ru: 'JSON конфигурация',
    en: 'JSON configuration',
  },
  'ui.cancel': {
    ru: 'Отмена',
    en: 'Cancel',
  },
  'ui.add': {
    ru: 'Добавить',
    en: 'Add',
  },
  'ui.save': {
    ru: 'Сохранить',
    en: 'Save',
  },
  'ui.delete': {
    ru: 'Удалить',
    en: 'Delete',
  },
  'ui.edit': {
    ru: 'Редактировать',
    en: 'Edit',
  },
  'footer.copyright': {
    ru: '© {year} ',
    en: '© {year} ',
  },
  'ui.backToServers': {
    ru: 'Вернуться к серверам',
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
  const [locale, setLocaleState] = useState<Locale>('ru');
  
  // Load locale from localStorage during initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale | null;
      if (savedLocale && (savedLocale === 'ru' || savedLocale === 'en')) {
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