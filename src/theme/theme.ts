import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      paper: '#f2f2f2',
      default: '#fff',
    },
    text: {
      primary: 'rgba(13, 13, 13, 1)',
      secondary: 'rgba(13, 13, 13, 0.6)',
      disabled: 'rgba(13, 13, 13, 0.38)',
    },
  },
  typography: {
    fontFamily: 'Söhne, ui-sans-serif, system-ui',
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    body1: {
      lineHeight: 1.75,
    },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
});
