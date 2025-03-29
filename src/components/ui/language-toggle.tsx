'use client';

import { useState } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Translate as TranslateIcon } from '@mui/icons-material';
import { useLocalization } from '@/lib/utils/i18n';

export function LanguageToggle() {
  const { locale, t, setLocale } = useLocalization();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLanguageChange = (newLocale: 'ru' | 'en') => {
    setLocale(newLocale);
    handleClose();
  };
  
  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label={t('ui.language')}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(12deg)',
          },
        }}
      >
        <TranslateIcon />
      </IconButton>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('ru')} 
          selected={locale === 'ru'}
          sx={{ minWidth: 150 }}
        >
          <Typography>{t('ui.language.ru')}</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('en')} 
          selected={locale === 'en'}
          sx={{ minWidth: 150 }}
        >
          <Typography>{t('ui.language.en')}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
} 