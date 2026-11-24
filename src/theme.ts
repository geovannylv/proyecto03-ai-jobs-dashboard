import { createTheme } from '@mui/material/styles';

export const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
      light: '#334155',
      dark: '#020617',
    },
    secondary: {
      main: '#0ea5e9',
    },
    success: {
      main: '#15803d',
      light: '#dcfce7',
    },
    info: {
      main: '#0369a1',
      light: '#e0f2fe',
    },
    warning: {
      main: '#b45309',
      light: '#fef3c7',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
