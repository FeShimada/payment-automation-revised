/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTheme } from '@mui/material/styles';
import { roboto } from './roboto';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#14B02B',
      dark: '#119324',
      light: '#1DD437',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#666666',
      light: '#848484',
      dark: '#4D4D4D',
    },
    error: {
      main: '#FF1744',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#2C2C2C',
          },
        },
      },
    },
  },
});