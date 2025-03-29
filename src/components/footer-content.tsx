'use client';

import { Typography, Link, Box } from '@mui/material';
import { useLocalization } from '@/lib/utils/i18n';

export default function FooterContent() {
  const { t } = useLocalization();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {t('footer.copyright', { year: new Date().getFullYear() })}
        <Link color="inherit" href="https://t.me/almazvpnbot" target="_blank" sx={{ mx: 0.5 }}>
          Almaz VPN
        </Link>
      </Typography>
    </Box>
  );
} 