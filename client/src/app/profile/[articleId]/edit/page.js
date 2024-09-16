'use client'
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import CustomSkeleton from '@/components/CustomSkeleton';
import { fetchUser } from '@/services/fetchUser';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import withAuth from '@/hoc/withAuth';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

const formatDateForInput = (date) => {
  const d = new Date(date);
  const formattedDate = d.toISOString().slice(0, 16); // "yyyy-MM-ddThh:mm"
  return formattedDate;
};


const EditArticle = () => {
  const { articleId } = useParams()
  const [article, setArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, control, formState: { errors },setValue } = useForm();

  async function fetchArticle() {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`);
      setArticle(response.data);
  }
 

  useEffect(() => {
    
    fetchUser(setUser, setError);

    if (articleId) {    
      fetchArticle()
    }
    const getCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);

        setCategories(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to fetch categories');
      }
    };
    
    getCategories();

  }, [articleId]);


  useEffect(() => {
    if (article) {
      setValue('title', article.title);
      setValue('description', article.description);
      setValue('details', article.details);
      setValue('startingBid', article.startingBid);
      setValue('endTime', formatDateForInput(article.endTime));
      setValue('categories', article.categories.map(category => category._id)); 
    }
  }, [article, setValue]);

  if (!article && !user) return <CustomSkeleton/>
  

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`, data);
      console.log("Article updated:", response.data);
      router.push(`/${articleId}`);
    } catch (error) {
      console.error("Error updating article:", error);
    }
  }


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', marginY: 5,padding:3, backgroundColor:"white"}}>
      <Typography variant="h4" component="h1" gutterBottom>
       Edit Article
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
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
          disabled
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
          <Controller
            name="details"
            control={control}
            defaultValue=""
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
        <Button variant="contained" type="submit" fullWidth>
          Save Article
        </Button>
      </form>
    </Box>
  )
}

export default withAuth(EditArticle)