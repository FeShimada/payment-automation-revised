/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import darklogo from '../../assets/images/darklogo.png';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewRoundedIcon from '@mui/icons-material/PowerSettingsNewRounded';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import PersonIcon from '@mui/icons-material/Person';
import { Tabs, Tab } from '@mui/material';

import { useRouter } from 'next/router';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';

const pages = ['Pedidos', 'Itens', 'Loja'];

interface ItemOrderHeaderProps {
  id: string;
}
export const ItemOrderHeader: React.FC<ItemOrderHeaderProps> = ({ id }) => {
  const router = useRouter();

  // Determina qual tab deve estar selecionada baseado na rota atual
  const getSelectedTab = () => {
    const path = router.pathname;
    if (path.includes('/item')) return 1;
    if (path.includes('/store')) return 2;
    return 0; // default para /order
  };

  const [selectedTab, setSelectedTab] = React.useState(getSelectedTab());

  // Atualiza a tab selecionada quando a rota muda
  React.useEffect(() => {
    setSelectedTab(getSelectedTab());
  }, [router.pathname]);

  const logout = api.auth.logout.useMutation({
    onSuccess: () => router.push('/'),
    onError: () => {
      toast.error("Ocorreu um erro", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    const page = pages[newValue];
    if (page === 'Pedidos') {
      void router.push(`/pdv/${id}/order`);
    }
    if (page === 'Itens') {
      void router.push(`/pdv/${id}/item`);
    }
    if (page === 'Loja') {
      void router.push(`/store/${id}`);
    }
  };

  const handleLogOut = () => {
    logout.mutate({});
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: '#14B02B' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '64px' }}>
            {/* Logo e título */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image
                src={darklogo}
                alt="Logo da empresa QuickPay"
                width="32"
                height="32"
                priority
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: 'white',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                QuickPay
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Botões da direita */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<PersonIcon />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                PDV
              </Button>
              <Button
                startIcon={<PowerSettingsNewRoundedIcon />}
                onClick={handleLogOut}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Sair
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Barra de navegação */}
        <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="xl">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  minHeight: '48px',
                  padding: '6px 16px',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: '#14B02B',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#14B02B',
                }
              }}
            >
              {pages.map((page) => (
                <Tab key={page} label={page} />
              ))}
            </Tabs>
          </Container>
        </Box>
      </AppBar>
      {/* Espaçador para compensar o header fixo */}
      <Box sx={{ height: 112 }} />
    </Box>
  );
};