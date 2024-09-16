'use client'
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, Box, Typography } from '@mui/material';
import axios from 'axios';
import { fetchUser } from '@/services/fetchUser';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});
const CreatePost = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

        setCategories(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch categories');
      }
    };
    fetchUser(setUser,setUserError)
    getCategories();
    
  }, []);
  

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('details', data.details);
    formData.append('startingBid', data.startingBid);
    formData.append('endTime', data.endTime);
    formData.append('owner', user._id); 
    // Append categories
    data.categories.forEach(category => {
      formData.append('categories', category);
    });

    // Append images
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/articles`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      router.push(`/${response.data.article._id}`)
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <Box sx={{ backgroundColor:"#f1f4f5", border: "1px solid #f1f4f5"}}>
      <Box sx={{ maxWidth: 600, mx: 'auto', marginY: 5,padding:3, backgroundColor:"white"}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Article
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            sx={{backgroundColor:"white"}}
            label="Title"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  theme="snow"
                  placeholder="Enter a description..."
                />
              )}
            />
            {errors.description && <Typography color="error">{errors.description.message}</Typography>}
          </FormControl>
          
          
          <TextField
            fullWidth
            label="Starting Bid"
            type="number"
            {...register('startingBid', { required: 'Starting bid is required', min: 0 })}
            error={!!errors.startingBid}
            helperText={errors.startingBid?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            {...register('endTime', { required: 'End time is required' })}
            error={!!errors.endTime}
            helperText={errors.endTime?.message}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Categories</InputLabel>
            <Controller
              name="categories"
              control={control}
              defaultValue={[]}
              rules={{ required: 'At least one category is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  label="Categories"
                  renderValue={(selected) => 
                    selected
                      .map((id) => categories.find((category) => category._id === id)?.name)
                      .join(', ')
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.categories && <Typography color="error">{errors.categories.message}</Typography>}
            {error && <Typography color="error">{error}</Typography>}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Controller
              name="details"
              control={control}
              defaultValue=""
              rules={{ required: 'Shipping details are required' }}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  theme="snow"
                  placeholder="Make sure to include shipping details..."
                />
              )}
            />
            {errors.details && <Typography color="error">{errors.details.message}</Typography>}
          </FormControl>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
       
          <Box>
            {images.length > 0 && images.map((image, index) => (
              <Typography key={index}>{image.name}</Typography>
            ))}
          </Box>
          <Button variant="contained" type="submit" fullWidth sx={{marginBottom:1}}>
            Create Article
          </Button>
        </form>
      </Box>
    </Box>
   
  );
};

export default withAuth(CreatePost);
