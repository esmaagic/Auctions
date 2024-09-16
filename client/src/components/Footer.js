import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box 
      component="footer"
      
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: 'primary.main', // or any other background color
        color: '#D3D3D3',
        mt: 'auto', // Ensures it's at the bottom of the page
      }}
    >
      <Typography variant="body2"  >
        © {new Date().getFullYear()} Zavrsni projekat Esma Agic
      </Typography>
      <Typography variant="body2">
        <a href="mailto:esma.02agic@gmail.com" style={{ color: 'inherit',textDecoration: 'none'  }}>esma.02agic@gmail.com</a>
      </Typography>
    </Box>
  );
}
