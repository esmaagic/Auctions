const Bid = require('../models/Bid'); 

/* 
exports.createBid = async (req, res) => {
    try {
        const bid = new newBid(req.body);
        await bid.save();
        res.status(201).send(bid);
    } catch (error) {
        res.status(400).send(error);
    }
}; */

exports.userBids = async (req, res) => {
    try {    
        const { userId } = req.params;
        const bids = await Bid.find({ bidder: userId }).populate('article');
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bids', error });
    }
};

exports.articleBids = async (req, res) => {
    try {
        const { articleId } = req.params;
        const bids = await Bid.find({ article: articleId })
                              .populate('bidder')  // Populate bidder details if needed
                              .sort({ createdAt: -1 });  // Sort descending by createdAt
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bids for the article', error });
    }
};


exports.makeBid = async (req, res) => {
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
}