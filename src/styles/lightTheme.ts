import { createTheme } from '@mui/material/styles';
import { roboto } from './roboto';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
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
      main: '#B30200',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
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
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
  },
});
