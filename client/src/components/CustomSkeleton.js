import { Container,Skeleton } from '@mui/material'
import React from 'react'

const CustomSkeleton = () => {
  return (
    <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',     // This centers items horizontally within the container
        width: '100%',            // Full width to take up the whole container's width
        textAlign: 'center',
        paddingTop:3,
      }}>
        <Skeleton sx={{m:1}} variant="h1" width={500} height={40} />
        <Skeleton sx={{m:1}} variant="h2" width={500} height={40} />
        <Skeleton sx={{m:1}} variant="h3" width={500} height={40} />
    </Container>
  )
}

export default CustomSkeleton