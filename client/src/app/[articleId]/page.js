'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Dialog, DialogContent, Chip, TextField, Button, InputAdornment, Tooltip, IconButton, Divider } from '@mui/material';
import CustomSkeleton from '@/components/CustomSkeleton';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { fetchUser } from '@/services/fetchUser';
import { useRouter } from 'next/navigation';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FullscreenIcon from '@mui/icons-material/Fullscreen';


const ArticlePage = () => {
  const { articleId } = useParams()
  const [article, setArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();
  const [savedCount, setSavedCount] = useState(0);

  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const handleFullscreenOpen = () => {
    setFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setFullscreenOpen(false);
  };  


  async function fetchArticle() {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`);
      setArticle(response.data);
  }
  async function fetchSavedCount() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/saved-count`);
      setSavedCount(response.data); // Assuming { count: number }
    } catch (error) {
      console.error('Failed to fetch saved count', error);
    }
  }

  useEffect(() => {
    
    fetchUser(setUser, setError);
    if (articleId) {    
      fetchArticle()
      fetchSavedCount();
    }

  }, [articleId]);

  useEffect(() => {
    if (user && user.saved && user.saved.some(item => item._id === articleId)) {
      setIsSaved(true); // Update isSaved only when user data is available
    }
  }, [user, articleId]);


  

  if (!article ) return <CustomSkeleton/>
  

  

  const onSubmit = async (data) => {
    if(!article.active){
      window.confirm("The auction for this article has finished. You can't submit any bids!");
      return
    }
    if(!user){
      router.push('/login?alert=notAuthenticated');
      return;
    }
    if(user._id === article.owner._id) {
      window.confirm("You can't bid on your own article!");
      return
    }
    
    if(user._id === article.owner._id){
      setError('You cannot bid on your own article.');
      return;
    }
    try {
      const bidData = {
        amount: parseFloat(data.newBid),
        article: articleId,
        bidder: user._id 
      };
  
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bids`, bidData);
  
      if (response.status === 201) {
        window.confirm("You have successfully made a bid!");
        fetchArticle();

      } else {
        console.error('Failed to create bid:', response);
      }
    } catch (error) {
      console.error('Error creating bid:', error);
    }
  }



  const handleSave = async () => {
    if(!user){
      router.push('/login?alert=notAuthenticated');
      return;
    }
    if(user._id === article.owner._id) {
      const isConfirmed = window.confirm("You can't save your own article!");
      return
    }
    
    
    try {
      if(user.saved.some(item => item._id === articleId)) setIsSaved(true)
      if (isSaved) {
        // If article is already saved, make a DELETE request to remove it
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/save/${articleId}`);
        setIsSaved(false);
      } else {
        // If article is not saved, make a PUT request to save it
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/save/${articleId}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.log('Error saving/removing article:', error);
    }
  };

  return (
    
    <Box >
    <Container maxWidth="md" sx={{ border: "1px solid #f1f4f5", marginBottom: 3 }}>
      <Box sx={{backgroundColor:"white", padding: 3, marginTop:3}}>
      <Typography variant="h4" sx={{ fontFamily: 'serif', mb: 2 }}>
        {article.title}
      </Typography>
      

      <Box sx={{ mb: 2 }}>
        {article.categories.map((category) => (
          <Chip
            key={category._id} 
            label={category.name} 
            size="small" 
            sx={{ mr: 1, mb: 1, color: 'text.secondary', fontSize: '0.875rem' }} 
          />
        ))}
      </Box>
       

      <IconButton onClick={handleFullscreenOpen} aria-label="fullscreen">
            <FullscreenIcon />
    </IconButton>
    <div id="carouselExampleIndicators" className="carousel carousel-dark slide">
        <div className="carousel-indicators">
          {article.images.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {article.images.map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img
                src={`http://localhost:5000${image.url}`}
                className="d-block w-100"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </div> 
    


    </Box>



        {/* Fullscreen Dialog */}
        <Dialog

          open={fullscreenOpen}
          onClose={handleFullscreenClose}
        >
          <DialogContent sx={{ padding: 0 }}>
            <div id="carouselFullscreen" className="carousel carousel-dark slide">
              <div className="carousel-indicators">
                {article.images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#carouselFullscreen"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : "false"}
                    aria-label={`Slide ${index + 1}`}
                  ></button>
                ))}
              </div>
              <div className="carousel-inner">
                {article.images.map((image, index) => (
                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                    <img
                      src={`http://localhost:5000${image.url}`}
                      className="d-block w-100"
                      alt={`Slide ${index + 1}`}
                      style={{
                        maxHeight: '100vh',  
                        width: 'auto',        
                        objectFit: 'contain', 
                        margin: '0 auto'     
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselFullscreen"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselFullscreen"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </DialogContent>
        </Dialog>
          
    <Box sx={{backgroundColor:"white", padding: 3, marginY:3}}>
      {/* price date view saved */}
      <Box sx={{marginBottom: 1}}><AccountCircleIcon/> {article.owner.username}</Box>
      <Box sx={{display:"flex"}}>
          <Box sx={{ borderRight:"1px solid #bdbdbd", padding:1}}>
            <Typography sx={{color: '#616161', fontSize:"0.8em" }}>CURRENT PRICE</Typography>
            <Typography sx={{ fontWeight: 'bold',textAlign:"center" }}>{article.currentBid} KM</Typography>
          </Box>
          <Box sx={{ borderRight:"1px solid #bdbdbd",  padding:1}}>
            <Typography sx={{color: '#616161', fontSize:"0.8em" }}>END DATE</Typography>
            <Typography sx={{ fontWeight: 'bold',textAlign:"center" }}>{format(new Date(article.createdAt), 'dd.MM.yyyy. HH:mm:ss')}</Typography>
          </Box>
          <Box sx={{ borderRight:"1px solid #bdbdbd", padding:1}}>
            <Typography sx={{color: '#616161', fontSize:"0.8em" }}>VIEWS</Typography>
            <Typography sx={{ fontWeight: 'bold',textAlign:"center" }}>{article.views}</Typography>
          </Box>
          <Box sx={{ borderRight:"1px solid #bdbdbd", padding:1}}>
            <Typography sx={{color: '#616161', fontSize:"0.8em" }}>SAVED</Typography>
            <Typography sx={{ fontWeight: 'bold',textAlign:"center" }}>{savedCount}</Typography>
          </Box>
        </Box>

          {/* add bids */}
        <Box sx={{marginY:2}}>
          <Box>
            <Typography>Starting bid: <span className=''>{article.startingBid}</span></Typography>
          </Box>
          <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
      >
        <Controller
          name="newBid"
          control={control}
          defaultValue=""
          rules={{
            required: 'New bid is required',
            min: {
              value: article.currentBid + 0.1,
              message: `Bid must be higher than the current bid (${article.currentBid} KM)`,
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter New Bid"
              type="number"
              fullWidth
              sx={{ width: 200 }}
              error={!!errors.newBid}
              helperText={errors.newBid ? errors.newBid.message : ''}
              FormHelperTextProps={{
                sx: { width: 400 },  // Set the width of the helper text
              }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">KM</InputAdornment>,
                },
              }}

            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ m: 2 ,backgroundColor:(theme) => theme.palette.secondary.main}}
        >
          Submit Bid
        </Button>
          </Box> 
     
        </Box>
        <Tooltip title={isSaved ? 'Remove from saved' : 'Save article'}>
      <IconButton onClick={handleSave}>
        {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
    </Box>
    

    <Typography variant="body1" sx={{ mb: 2,backgroundColor:"white", padding: 3 }}>
        <strong>Description:</strong> 
        <Box dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(article.description) }}/>
      </Typography>
      <Typography variant="body1" sx={{backgroundColor:"white", padding: 3}}>
        <strong>Shipping Details:</strong>
        
        <Box dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(article.details) }}/>
      </Typography>

    </Container>
    
  
    </Box>
    
  )
}

export default ArticlePage
