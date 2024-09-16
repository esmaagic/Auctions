'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Container, Typography } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const getUsers = async () => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
            
            setUsers(response.data);
          } catch (error) {
            console.log(error);
          
          }
        };
        
        getUsers();
        
      }, []);

      const handleBan = async (userId) => {
        try {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/ban`);
          setUsers(users.map(user => user._id === userId ? { ...user, banned: true } : user));
        } catch (error) {
          console.log('Error banning user:', error);
        }
      };
    
      const handleUnban = async (userId) => {
        try {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/unban`);
          setUsers(users.map(user => user._id === userId ? { ...user, banned: false } : user));
        } catch (error) {
          console.log('Error unbanning user:', error);
        }
      };

  return (
    <Container sx={{marginTop: 3}}>
      <Typography variant="h5" gutterBottom>
        Manage users
      </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user._id} 
              style={{ backgroundColor: user.banned ? '#f0f0f0' : 'transparent' }}
            >
              <TableCell>{user.username}</TableCell>
              <TableCell>{format(new Date(user.createdAt), 'dd.MM.yyyy.')}</TableCell>
              <TableCell>
                {user.banned ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleUnban(user._id)}
                  >
                    Unban
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleBan(user._id)}
                  >
                    Ban
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>
     
  );
  
}

export default AdminPage