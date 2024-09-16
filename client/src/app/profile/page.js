'use client'
import React, { useState, useEffect } from 'react';
import { fetchUser } from '@/services/fetchUser';
import withAuth from '@/hoc/withAuth';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Divider, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import Grid from "@mui/material/Grid2";
import ArticleCard from '@/components/ArticleCard';
import NoArticles from '@/components/NoArticles';
import { incrementViews } from '@/services/incrementViews';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [userError, setUserError] = useState('');
  const [loading, setLoading] = useState(true);
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchUser(setUser, setUserError);
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch articles when the user is available
      const fetchUserDetails = async () => {
        try {
          const userArticles = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/me/${user._id}`);
          setArticles(userArticles.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error: {userError}</div>;
  }

  return (
    <div>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Divider />
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="My articles" />
          <Tab label="Saved" />
        </Tabs>
      </Box>

      <Box sx={{ padding: 2 }}>
        {value === 0 && (
          <div>
            {articles.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {articles.map((article, i) => (
                  <Grid
                    sx={{ padding: 0, margin: 0 }}
                    item
                    xs={articles.length}
                    sm={articles.length / 3}
                    md={articles.length / 4}
                    lg={articles.length / 5}
                    key={article._id}
                  >
                    <Link href={`/profile/${article._id}`} underline="none">
                      <ArticleCard article={article} index={i} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <NoArticles/>
            )}
          </div>
        )}
        {value === 1 && (
          <div>
            {user.saved.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {user.saved.map((article, i) => (
                  <Grid
                    sx={{ padding: 0, margin: 0 }}
                    item
                    xs={user.saved.length}
                    sm={user.saved.length / 3}
                    md={user.saved.length / 4}
                    lg={user.saved.length / 5}
                    key={article._id}
                  >
                    <Link onClick={()=>{incrementViews(article._id)}} href={`/${article._id}`} underline="none">
                      <ArticleCard article={article} index={i} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <NoArticles/>
            )}
          </div>
        )}
      </Box>
    </div>
  );
};

export default withAuth(UserPage);
