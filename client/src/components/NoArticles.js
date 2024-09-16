import { Box, Container, Typography ,Button} from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff';
import React from 'react'
import { useRouter } from 'next/navigation';

const NoArticles = () => {
  const router = useRouter()
  return (
    <Container>
    <Box
      sx={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '50vh',
        textAlign: 'center'
      }}
    >
      <SearchOffIcon sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
      <Typography variant="h4" sx={{ mb: 2 }}>No articles found</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Try adjusting your search criteria or browse other categories.
      </Typography>
      <Button
        variant="contained" 
        color="primary" 
        onClick={() => router.push('/')} // Navigate to homepage or another page
      >
        Go back to Home
      </Button>
    </Box>
  </Container>
  )
}

export default NoArticles