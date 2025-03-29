'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo, useState, useEffect } from 'react';
import { LocalizationProvider } from '@/lib/utils/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  // Define user preferences when loading the page
  useEffect(() => {
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setMode(savedTheme);
      return;
    }
    
    // Check system preferences
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  // Create Material UI theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
          secondary: {
            main: mode === 'dark' ? '#ce93d8' : '#9c27b0',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: 'var(--font-geist-sans)',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === 'dark' ? '#2b2b2b #121212' : '#d9d9d9 #f5f5f5',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: mode === 'dark' ? '#2b2b2b' : '#d9d9d9',
                },
                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                  backgroundColor: mode === 'dark' ? '#3f3f3f' : '#bfbfbf',
                },
                '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
                  borderRadius: 8,
                  backgroundColor: mode === 'dark' ? '#121212' : '#f5f5f5',
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  // Theme toggle function (will be passed through context)
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  // Add toggleTheme to context properties
  // @ts-ignore - Ignore TypeScript error, as we are extending the standard ThemeContext
  theme.toggleTheme = toggleTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
} 