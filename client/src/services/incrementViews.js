import axios from "axios";

export async function incrementViews(articleId){
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/views`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };