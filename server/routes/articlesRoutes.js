const express = require('express');
const { createArticle, 
    getUserArticles,
    searchArticlesByTitle,
    getArticleById, 
    getArticles,
    updateArticle, 
    deleteArticle, 
    getArticleSavedCount,
    incrementArticleViews,
    getArticlesByCategory } = require('../controllers/articlesController'); // Adjust the path as needed

const {isAuth} = require("../middleware/auth")
const router = express.Router();

// Route to create a new article
router.post('/', isAuth, createArticle);

router.get('/search', searchArticlesByTitle);

router.get('/category/:categoryId', getArticlesByCategory)

router.get('/me/:userId', isAuth, getUserArticles)

//Route to increment views
router.patch('/:id/views',incrementArticleViews)

// Route to get an article by ID
router.get('/:id', getArticleById);

router.get('/', getArticles);

// Route to update an article by ID
router.put('/:id',  isAuth, updateArticle);

// Route to delete an article by ID
router.delete('/:id', isAuth,  deleteArticle);

router.get('/:articleId/saved-count', getArticleSavedCount);

module.exports = router;
