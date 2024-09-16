'use client'
import { useState, useEffect} from "react";
import axios from "axios";
import { Box, Chip, Typography, Button, Link, Menu, MenuItem, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import ArticleCard from "@/components/ArticleCard"; 
import CustomSkeleton from "@/components/CustomSkeleton";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import NoArticles from "@/components/NoArticles";
import { incrementViews } from "@/services/incrementViews";

export default function Home() {
  const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const queryKeyword = searchParams.get('keyword');
    const queryCategory = searchParams.get('category')
  
    
    const [sortCriteria, setSortCriteria] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const openF = Boolean(anchorEl);

    const handleClickF = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseF = () => {
        setAnchorEl(null);
    };


    

    
    useEffect(() => {
      const getCategoryName = async () =>{
        try{
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/${queryCategory}`);
          setCategoryName(response.data)
        }catch(error) {
          console.log(error)
        }
        
      }

      if (queryKeyword) {
        setKeyword(queryKeyword);
      } else {
        setKeyword(""); 
      }
      if (queryCategory) {
        setCategory(queryCategory);
        getCategoryName()
      } else {
        setCategory(""); 
        setCategoryName(""); 
      }
    }, [queryKeyword,queryCategory]);

    

    useEffect(() => {
        const fetchArticles = async () => {
          setLoading(true); // Set loading to true before fetching
          try {
            let response;
            if (category) {
              response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/category/${queryCategory}`);
            } else if (keyword) {
              response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/search`, {
                params: { keyword },
              });
            } else {
              response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles`);
            }
            setArticles(response.data);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setArticles([]); // Set articles to an empty array if 404 is encountered
            } else {
              console.error("Failed to fetch articles:", error);
              setError('Failed to fetch articles');
            }
          } finally {
            setLoading(false); // Set loading to false once fetching is done
          }
        };
    
        fetchArticles();
      }, [keyword, category]);

      useEffect(() => {
        if (sortCriteria) {
            const sortedArticles = [...articles];
            switch (sortCriteria) {
                case 'priceLow':
                    sortedArticles.sort((a, b) => a.currentBid - b.currentBid);
                    break;
                case 'priceHigh':
                    sortedArticles.sort((a, b) => b.currentBid - a.currentBid);
                    break;
                case 'viewsHigh':
                    sortedArticles.sort((a, b) => b.views - a.views);
                    break;
                default:
                    break;
            }
            setArticles(sortedArticles);
        }
    }, [sortCriteria]);
    
    if (loading) return <CustomSkeleton />;
    if(articles.length === 0) return (
     <NoArticles/>
    )
    return (


        <Box
          sx={{
              backgroundColor:"#f1f4f5",
              paddingBottom: 3
          }}
        >
          <Container maxWidth="xl" sx={{display:"flex", justifyContent:"space-between"}}>
            <Box sx={{ margin: 2 }}>
              {category ? (
                <Chip
                  label={categoryName}
                  color="default"
                  sx={{ margin: 1 }}
                />
              ) : keyword ? null : (
                <Chip label="All" color="default" sx={{ margin: 1 }} />
              )}
            </Box>
            <div>
                    <Button
                        id="basic-button"
                        aria-controls={openF ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openF ? 'true' : undefined}
                        onClick={handleClickF}
                        sx={{margin: 2}}
                    >
                        Sort<SwapVertIcon/>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openF}
                        onClose={handleCloseF}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={() => { setSortCriteria('priceLow'); handleCloseF(); }}>Price low</MenuItem>
                        <MenuItem onClick={() => { setSortCriteria('priceHigh'); handleCloseF(); }}>Price high</MenuItem>
                        <MenuItem onClick={() => { setSortCriteria('viewsHigh'); handleCloseF(); }}>Views high</MenuItem>
                    </Menu>
            </div>
          </Container>
          
          
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
                  sx={{padding: 0, margin:0}}
                      item
                      xs={articles.length}
                      sm={articles.length/3}
                      md={articles.length/4}
                      lg={articles.length/5}
                      key={article._id}
                  >
                    <Link  onClick={()=>{incrementViews(article._id)}}  href={`/${article._id}`}  underline="none">
                      <ArticleCard article={article} index={i} />
                    </Link>
                  </Grid>
              ))}
          </Grid>
         
      </Box>
      


    );
}

