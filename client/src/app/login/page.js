"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import {Box,TextField,Button, Typography, Alert, Collapse, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { useSearchParams } from "next/navigation";
//import withNoAuth from '@/components/withNoAuth';
import CloseIcon from '@mui/icons-material/Close';



const Login = () => {
  
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const router = useRouter()
  const [open, setOpen] = React.useState(true);
  const searchParams = useSearchParams();
  let alert = searchParams.get("alert");

  
  

  const onSubmit = async (data) => {
    try {
       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
          data , 
          { withCredentials: true } 
        ); 


      router.push('/?login=true');  
     
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setLoginError('Your account has been banned. Please contact support.');
      } else {
        setLoginError('Invalid email or password');
      }
    }
  };

  return (
    <Box sx={{height:"75vh", display:"flex", flexFlow:"column", justifyContent:"space-between"}}>
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ 
        p: 3,       
        backgroundColor: "white",        
        boxShadow: 3,        
        border: '2px ', 
        borderColor: 'grey.500',
        borderRadius: 2,
        mt: 5, maxWidth: 500, mx: 'auto', }}
    >
      
      
      



      <Box sx={{ paddingX: 0, display:'flex', justifyContent:'space-between'}}>
          <Typography variant="h5" component="h1" gutterBottom>
            Sign in
          </Typography>

          <Link href="/">
            <Button sx={{color:'secondary.main'}}>Home</Button>
          </Link>
        </Box>
      {loginError && <Typography color="error">{loginError}</Typography>}
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        {...register('email', { required: 'Email is required' })}
        error={!!errors.email}
        helperText={errors.email ? errors.email.message : ''}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        {...register('password', { required: 'Password is required' })}
        error={!!errors.password}
        helperText={errors.password ? errors.password.message : ''}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign in
      </Button>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link href="/register">
          <Button variant="text">Sign up</Button>
        </Link>
      </Typography>
    </Box>
    {alert &&   
      <Collapse sx={{maxWidth:"500px", mx:3}} in={open}>
      <Alert
      
      severity="info"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
       You need to log in to access this page.
      </Alert>
    </Collapse>
    }
    </Box>
  );
}



//export default withNoAuth(Login);
export default Login;