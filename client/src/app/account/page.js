'use client'

import React, { useState, useEffect } from 'react'
import withAuth from '@/hoc/withAuth';
import axios from 'axios';
import { fetchUser } from '@/services/fetchUser';
import CustomSkeleton from '@/components/CustomSkeleton';

import { Container, Box, Typography, Grid, Paper } from '@mui/material';
const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null)
    useEffect(() => {
        fetchUser(setUser, setError)
      }, []);
      
      if (!user ) return <CustomSkeleton/>
  return (
    
/* 
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Account Details
        </Typography>
      
        <Typography variant="body1">
          <strong>Username:</strong> {user?.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user?.email}
        </Typography>
       

       
      </Box>
    </Container> */
   

<Container maxWidth="sm">
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      Personal information
    </Typography>
    {/* Render user details only after user is loaded */}
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>

        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>First Name:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{user?.firstname}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Last Name:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{user?.lastname}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Username:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{user?.username}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Email:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">{user?.email}</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="body1">
            <strong>Date Created:</strong>
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {new Date(user?.createdAt).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  </Box>
</Container>

  )
}

export default withAuth(AccountPage)