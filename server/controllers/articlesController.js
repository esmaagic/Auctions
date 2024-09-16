const Article = require('../models/Article'); 
const Image = require('../models/Image')
const User = require('../models/User')
const multer = require('multer');
const path = require('path');


// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).array('images', 10); // Allows up to 10 images to be uploaded

// Check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}



const searchArticlesByTitle = async (req, res) => {
    const { keyword } = req.query; // Get the keyword from the query parameters
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }

    try {
        // Use a case-insensitive regex to find articles with the keyword in the title
        const articles = await Article.find({active: true, $text: { $search: keyword } }) 
        .populate('images')
        

        if (articles.length === 0) {
            return res.status(404).json({ message: 'No articles found' });
        }

        res.status(200).json(articles);
    } catch (error) {
        console.error('Error searching articles:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getArticlesByCategory = async (req, res) => {
    const {categoryId} = req.params;

    try {
    // Search for articles with the given category
    const articles = await Article.find({ categories: categoryId, active: true })
    .populate("images")


    // If no articles found, return a 404
    if (!articles.length) {
        return res.status(404).json({ message: 'No articles found in this category.' });
    }

    // Return the found articles
    res.json(articles);
    } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    }
}

const createArticle = async (req, res) => {
  /*   try {
        const article = new Article(req.body);
        await article.save();
        res.status(201).send(article);
    } catch (error) {
        res.status(400).send(error);
    } */
        /* try {
            // Ensure the request body is an array
            const articlesArray = Array.isArray(req.body) ? req.body : [];
    
            // Validate if the array contains articles
            if (articlesArray.length === 0) {
                return res.status(400).send('No articles provided');
            }
    
            // Create and save all articles
            const savedArticles = [];
            for (const articleData of articlesArray) {
                const article = new Article(articleData);
                const savedArticle = await article.save();
                savedArticles.push(savedArticle);
            }
    
            // Respond with the created articles
            res.status(201).json(savedArticles);
        } catch (error) {
            console.error(error);
            res.status(400).send(error.message);
        } */


            upload(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
        
                try {
                    const { title, description, details, startingBid, endTime, owner, categories } = req.body;
        
                    // Create the article
                    const article = new Article({
                        title,
                        description,
                        details,
                        startingBid,
                        endTime,
                        owner,
                        categories
                    });
        
                    await article.save();
        
                    // Handle image uploads
                    if (req.files) {
                        for (const file of req.files) {
                            const newImage = new Image({
                                url: `/uploads/${file.filename}`,
                                article: article._id
                            });
                            await newImage.save();
                            article.images.push(newImage._id);
                        }
                        await article.save();
                    }
        
                    res.status(201).json({ message: 'Article created successfully', article });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Server error' });
                }
            });
};

const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('categories') // Populate categories for better readability
            .populate('owner')
            .populate('images'); // Populate owner if needed

        if (!article) {
            return res.status(404).send({ error: 'Article not found' });
        }

        res.send(article);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getArticles = async(req,res)=>{
    try {
        const articles = await Article.find({ active: true })
        .populate('categories')
        .populate('images')

        res.status(200).json(articles);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const getUserArticles = async(req,res)=>{
    try {
        const { userId } = req.params;  
        const articles = await Article.find({ owner: userId })
          .populate('categories')
          .populate('images');
          
        res.status(200).json(articles);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, details, startingBid, endTime, categories } = req.body;
    
        // Find the article by ID and update it
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
          {
            title,
            description,
            details,
            startingBid,
            endTime: new Date(endTime),
            categories, // Assuming this is an array of category IDs
          },
          { new: true }
        )
    
        if (!updatedArticle) {
          return res.status(404).json({ message: 'Article not found' });
        }
    
        res.status(200).json({ message: 'Article updated successfully', article: updatedArticle });
      } catch (error) {
        res.status(500).json({ message: 'Failed to update article', error });
      }
          
};

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).send({ error: 'Article not found' });
        }

        res.send(article);
    } catch (error) {
        res.status(500).send(error);
    }
};

const incrementArticleViews = async (req, res) => {
    try {
        const articleId = req.params.id;

        // Find the article by ID and increment the views by 1
        const article = await Article.findByIdAndUpdate(
            articleId,
            { $inc: { views: 1 } }, // Increment the views field by 1
            { new: true } // Return the updated document
        );

        if (!article) {
            return res.status(404).send({ error: 'Article not found' });
        }

        res.send(article);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getArticleSavedCount = async (req, res) => {
    try {
      const { articleId } = req.params;
        
      const article = await Article.findById(articleId)
      if (!article) {
        return res.status(404).send({ error: 'Article not found' });
      }
      const count = await User.countDocuments({ saved: articleId });
      res.status(200).json(count);
    } catch (error) {
      console.error('Error fetching saved count:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };


module.exports = {
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
    incrementArticleViews,
    getArticles,
    searchArticlesByTitle,
    getUserArticles,
    getArticleSavedCount,
    getArticlesByCategory
};
