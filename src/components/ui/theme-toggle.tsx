'use client';

import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, useTheme } from '@mui/material';

export function ThemeToggle() {
  // Get the theme object and toggle function from the context
  const theme = useTheme();
  // @ts-ignore - Accessing our extended context property
  const toggleTheme = theme.toggleTheme;
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      aria-label="Toggle theme"
      sx={{
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'rotate(12deg)',
        },
      }}
    >
      {isDarkMode ? (
        <LightMode sx={{ color: 'primary.light' }} />
      ) : (
        <DarkMode sx={{ color: 'text.primary' }} />
      )}
    </IconButton>
  );
} 