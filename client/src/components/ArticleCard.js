import {  Card, CardActions, CardContent, CardMedia, Typography, Chip, Box} from "@mui/material";

const ArticleCard = ({article, index}) => {
    
  return (
    <Card
      sx={{
        width: 260,
        padding: 0,
        margin: 0,
        opacity: article.active ? 1 : 0.8, // Adjust opacity based on active state
        backgroundColor: article.active ? 'background.paper' : '#f0f0f0', // Optional: a different background color for inactive
        position: 'relative' // Enable absolute positioning inside the card
      }}
    >
      {/* If the article is not active, show the 'Expired' chip */}
      {!article.active && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
          }}
        >
          <Chip label="Finished" color="warning" size="large" />
        </Box>
      )}

      <CardMedia
        component="img"
        alt={index + 1}
        height="140"

        image={article.images && article.images[0] ? `http://localhost:5000${article.images[0].url}` : 'https://via.placeholder.com/400'}
        
        sx={{
          filter: article.active ? 'none' : 'grayscale(100%)' // Apply grayscale filter to inactive articles
        }}
      />

      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: article.active ? 'text.secondary' : 'text.disabled', // Muted text color for inactive articles
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            minHeight: '2.9em'
          }}
        >
          {article.title}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" color="textSecondary">
          views: {article.views}
        </Typography>
        <Typography>{article.startingBid} KM</Typography>
      </CardActions>
    </Card>
       
        
    
  )
}

export default ArticleCard