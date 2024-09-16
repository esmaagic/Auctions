"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import {Box, Link,TextField,Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

//import withNoAuth from '@/components/withNoAuth';



const Register = ()=> {
  
 

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
 

  const onSubmit = async (data) => {
    try {

      console.log(data)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, 
          { data }, 
          { withCredentials: true } 
        );
        console.log(response);
        

    
      router.push('/login'); 
    } catch (error) {
      setLoginError('Invalid email or password');
    }
  };

  return (
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
            Sign up
          </Typography>

          <Link href="/">
            <Button sx={{}}>Home</Button>
          </Link>
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          {...register('firstname', { required: 'First firstname is required' })}
          error={!!errors.firstname}
          helperText={errors.firstname ? errors.firstname.message : ''}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          {...register('lastname', { required: 'Last name is required' })}
          error={!!errors.lastname}
          helperText={errors.lastname ? errors.lastname.message : ''}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          {...register('username', { required: 'Username name is required' })}
          error={!!errors.username}
          helperText={errors.username ? errors.username.message : ''}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          {...register('email', { 
            required: 'Email is required', 
            pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: 'Invalid email address' } 
          })}
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
          Sign up
        </Button>
        
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already signed up?{' '}
        <Link href="/login">
          <Button variant="text">Sign in</Button>
        </Link>
      </Typography>
      
      </Box>
  );
}


/* export default withNoAuth(Register); */
export default Register;