/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import logo from '../../assets/images/logo.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export function Header() {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        void router.push('/pdv');
        break;
      case 1:
        void router.push('/user');
        break;
      case 2:
        void router.push('/notificationInfo');
        break;
    }
  };

  const logout = api.auth.logout.useMutation({
    onSuccess: () => router.push('/'),
    onError: () => {
      toast.error('Ocorreu um erro', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    },
  });

  const handleLogOut = () => {
    logout.mutate({});
  };

  // Define o valor inicial da tab baseado na rota atual
  React.useEffect(() => {
    if (router.pathname.includes('/pdv')) setValue(0);
    else if (router.pathname.includes('/user')) setValue(1);
    else if (router.pathname.includes('/notificationInfo')) setValue(2);
  }, [router.pathname]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#14B02B',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
            {/* Logo e Nome */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image
                src={logo}
                alt="Logo da empresa QuickPay"
                width={32}
                height={32}
                style={{ marginRight: '8px' }}
                priority
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: 500,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                QuickPay
              </Typography>
            </Box>

            {/* Botões da direita */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                startIcon={<PersonIcon />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Administrador
              </Button>
              <Button
                onClick={handleLogOut}
                startIcon={<LogoutIcon />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Barra de navegação */}
        <Container maxWidth={false}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                minHeight: '48px',
                padding: '6px 16px',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
              }
            }}
          >
            <Tab label="PDVs" />
            <Tab label="Usuários" />
            <Tab label="Log de Pagamentos" />
          </Tabs>
        </Container>
      </AppBar>
      {/* Espaçador para compensar o header fixo */}
      <Toolbar />
      <Toolbar sx={{ minHeight: '48px !important' }} />
    </>
  );
}
