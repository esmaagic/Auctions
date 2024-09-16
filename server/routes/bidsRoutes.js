const express = require('express');
const Bid = require('../models/Bid');
const Article = require('../models/Article')
const router = express.Router();
const {userBids, articleBids} = require("../controllers/bidsController")
const {isAuth, isAdmin} = require("../middleware/auth")

router.get('/:userId', isAuth, userBids)

router.get("/article/:articleId", articleBids)

// Route to create a new category
router.post('/', isAuth, async (req, res) => {
    console.log(req.body)
    try {
        const bid = new Bid(req.body);
        await bid.save();

        const article = await Article.findById(bid.article);

        if (!article) {
            return res.status(404).send({ message: 'Article not found' });
        }

        if (bid.amount > article.currentBid) {
            article.currentBid = bid.amount;
            await article.save();
        }

        res.status(201).send(bid);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;