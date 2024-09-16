'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Paper, Container, Button, Link } from '@mui/material';
import { format } from 'date-fns';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const UserMessages = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  // Fetch user messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${user._id}`);
        setMessages(response.data);
      } catch (error) {
        setError('Failed to load messages');
        console.error(error);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  const handleClick= async (id) =>{
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/messages/${id}`);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === id ? { ...message, seen: true } : message
        )
      );
    } catch (error) {
      console.log('Error reading message:', error);
    }
  }
  
  return (
    <Container sx={{marginBottom: 3}}>
      <Typography variant="h6" gutterBottom>
        Your messages
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* Display the list of messages */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        {messages.length > 0 ? (
          <List>
            {messages.map((message) => (
              <ListItem
                key={message._id}
                alignItems="flex-start"
                style={{
                  backgroundColor: message.seen ? '#f0f0f0' : '#e3f2fd', // Different background color for seen/unseen messages
                  marginBottom: '10px',
                  padding: '10px',
                  borderRadius: '4px',
                }}
              >
                <ListItemText
                  primary={message.title}
                  secondary={
                    <>
                    
                      <Typography variant="body2">{message.content} <Link href={`/${message.article}`}>visit</Link></Typography>
                      <br />
                      <Typography variant="caption" color="textSecondary">
                        {format(new Date(message.createdAt), 'dd.MM.yyyy. HH:mm:ss')}
                      </Typography>
                    </>
                  }
                />
                {!message.seen && (
                  <Button
                    
                    
                    onClick={() => {handleClick(message._id)}}
                  >
                    <CheckBoxIcon color="secondary"/>
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No messages found</Typography>
        )}
      </Paper>
    </Container>
   /*  <Container>
      <Typography variant="h4" gutterBottom>
        Messages for {user?.firstname}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        {messages.length > 0 ? (
          <List>
            {messages.map((message) => (
              <ListItem key={message._id} alignItems="flex-start">
                <ListItemText
                  primary={message.title}
                  secondary={
                    <>
                    <>
        {message.content}
        <br />
        <Typography variant="caption" color="textSecondary">
         
          {format(new Date(message.createdAt), 'dd.MM.yyyy. HH:mm:ss')}
        </Typography>
      </>
                    </>
                  } 
                
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No messages found</Typography>
        )}
      </Paper>
    </Container> */
  );
};

export default UserMessages;
