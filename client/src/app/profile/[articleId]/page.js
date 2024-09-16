'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Box, Container,Typography, Chip, Button, Link, IconButton } from '@mui/material'
import React from 'react'
import { format } from 'date-fns';
import { fetchUser } from '@/services/fetchUser';
import { useRouter } from 'next/navigation';
import CustomSkeleton from '@/components/CustomSkeleton';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MyArticle = () => {
  const { articleId } = useParams()
  const [article, setArticle] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [savedCount, setSavedCount] = useState(0);
  const [bids, setBids] = useState([])

  async function fetchArticle() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch articles', error);
    }
  }

  async function fetchBids() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bids/article/${articleId}`);
      setBids(response.data);
    } catch (error) {
      console.error('Failed to fetch bids', error);
    }
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
      fetchBids();
    }

  }, [articleId]);

  const deleteArticle = async (articleId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this article? This action cannot be undone.");
  
    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}`);
       // setArticles(prevArticles => prevArticles.filter(article => article._id !== articleId));
        router.push("/profile")
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    } else {
      console.log('Article deletion canceled');
    }
  };
  

if (!article ) return <CustomSkeleton/>
const lastBid = bids.length > 0 ? bids[0] : null;

  return (
    <Box>
    <Container maxWidth="md" sx={{ border: "1px solid #f1f4f5", marginBottom: 3 }}>
      <Box sx={{ backgroundColor: "white", padding: 3, marginTop: 3 }}>
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link key={article._id} href={`/profile/${article._id}/edit`} passHref>
            <IconButton aria-label="edit">
              <EditIcon color="primary" />
            </IconButton>
          </Link>
          <IconButton aria-label="delete" onClick={() => deleteArticle(article._id)}>
            <DeleteIcon color="secondary" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: "white", padding: 3, marginY: 3 }}>
        <Box sx={{ marginBottom: 1 }}><AccountCircleIcon /> {article.owner.username}</Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ borderRight: "1px solid #bdbdbd", padding: 1 }}>
            <Typography sx={{ color: '#616161', fontSize: "0.8em" }}>CURRENT PRICE</Typography>
            <Typography sx={{ fontWeight: 'bold', textAlign: "center" }}>{article.currentBid} KM</Typography>
          </Box>
          <Box sx={{ borderRight: "1px solid #bdbdbd", padding: 1 }}>
            <Typography sx={{ color: '#616161', fontSize: "0.8em" }}>END DATE</Typography>
            <Typography sx={{ fontWeight: 'bold', textAlign: "center" }}>{format(new Date(article.createdAt), 'dd.MM.yyyy. HH:mm:ss')}</Typography>
          </Box>
          <Box sx={{ borderRight: "1px solid #bdbdbd", padding: 1 }}>
            <Typography sx={{ color: '#616161', fontSize: "0.8em" }}>VIEWS</Typography>
            <Typography sx={{ fontWeight: 'bold', textAlign: "center" }}>{article.views}</Typography>
          </Box>
          <Box sx={{ borderRight: "1px solid #bdbdbd", padding: 1 }}>
            <Typography sx={{ color: '#616161', fontSize: "0.8em" }}>SAVED</Typography>
            <Typography sx={{ fontWeight: 'bold', textAlign: "center" }}>{savedCount}</Typography>
          </Box>
        </Box>
      </Box>


      {/* Bids Section */}
      <Box sx={{ backgroundColor: "white", padding: 3, marginY: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Bids</Typography>
        {/* Highlight the latest bid */}
        {lastBid && (
          <Box sx={{ marginTop: 3, padding: 2, backgroundColor: '#f0f8ff', borderRadius: 1 }}>
          <Typography variant="h6">Current Bid</Typography>
            <Typography sx={{display:"flex"}}>
              <span><strong>{lastBid.bidder.username}</strong> - {lastBid.amount} KM</span>
              <span className="mx-3 text-muted ">
                Email: {lastBid.bidder.email}
              </span>
          </Typography>
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {format(new Date(lastBid.createdAt), 'dd.MM.yyyy. HH:mm:ss')}
          </Typography>
        </Box>
        )}
        {bids.length > 1 ? (
          <Box>
            {bids.slice(1).map((bid) => (
              <Box key={bid._id} sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography><strong>{bid.bidder.username}</strong> - {bid.amount} KM</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{format(new Date(bid.createdAt), 'dd.MM.yyyy. HH:mm:ss')}</Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No bids placed yet.</Typography>
        )}

        
      </Box>
    </Container>
  </Box>
  )
}

export default MyArticle