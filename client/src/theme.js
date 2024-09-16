'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#003034'
    },
    secondary: {
      main: '#ff5635',  // Define the secondary color
    },
    background: {
      default: '#f1f4f5',  // Background color
    },
  } // Define a spacing unit (default is 8px)
});

export default theme;