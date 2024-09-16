'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SendMessageButton from './SendMessageButton';
import { fetchUser } from '@/services/fetchUser';
import { Container, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';

const SendMessages = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Fetch user messages
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        setError('Failed to load users');
      }
    };

    fetchUsers();
    
    
  }, []);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Send Message to Users
      </Typography>
      <List >
        {users.map((u) => (
          <ListItem sx={{backgroundColor:"white"}} key={u.id} divider>
            <ListItemText primary={u.username} />           
              <SendMessageButton user={u} />
          </ListItem>
        ))}
      </List>
    </Container>
  )
}

export default SendMessages