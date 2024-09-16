'use cleint'
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const SendMessageButton = ({user}) => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const onSubmit = async(data)=>{
      console.log(data);
      try{
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`, 
          data 
        ); 
        handleClose()
      }catch(error){

      }
    }
  return (
    <>
        <Button onClick={handleClickOpen}>Send Message </Button>

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div>Send Message to {user.username}</div>
        </DialogTitle>
        <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ''}
          />
          <TextField
            label="Message Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register('content', { required: 'Content is required' })}
            error={!!errors.content}
            helperText={errors.content ? errors.content.message : ''}
          />
          <TextField
              type="hidden"
              value={user._id}  // Pass the user's ID as the value
              {...register('receiver')}
            />
          <DialogActions>
            <Button type="submit"
              fullWidth
              variant="contained">
              Send
            </Button>
          </DialogActions>
        </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SendMessageButton