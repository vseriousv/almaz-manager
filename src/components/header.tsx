'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useLocalization } from '@/lib/utils/i18n';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { t } = useLocalization();

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          <Link href="/" passHref style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Image 
                src="/android-chrome-192x192.png" 
                alt="Almaz Logo"
                width={32} 
                height={32}
                style={{ borderRadius: '4px' }}
              />
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.primary',
                  ml: 1
                }}
              >
                {t('app.title')}
              </Typography>
            </Box>
          </Link>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageToggle />
            <ThemeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 