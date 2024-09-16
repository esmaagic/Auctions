const mongoose = require('mongoose');
const Message = require("./Message")
const Bid = require("./Bid")
const cron = require('node-cron');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }, 
    description: {
        type: String,
        required: true,
        trim: true
    },
    details: {
        type: String,
        trim: true
    },
    startingBid: {
        type: Number,
        required: true,
        min: 0
    },
    currentBid: {
        type: Number,
        default: function() { return this.startingBid; }
    },
    endTime: {
        type: Date,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    views:{
        type:Number,
        default:0,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});



  cron.schedule('* * * * *', async () => {
    const currentTime = new Date();

  // Find articles whose `endTime` has passed and are still active
  const expiredArticles = await Article.find({ endTime: { $lte: currentTime }, active: true });
    
  for (const article of expiredArticles) {
    // Update the article to inactive
    article.active = false;

    // Create a new message for the owner of the article
    const messageOwner = new Message({
      title: 'Your article has expired',
      content: `Your article titled "${article.title}" has expired as of ${currentTime.toISOString()}. `,
      receiver: article.owner,
      article: article._id
    });

    // Find the latest bid for the article
    const lastBid = await Bid.findOne({ article: article._id })
      .sort({ createdAt: -1 }) // Sort in descending order by 'createdAt'
      .populate('bidder')
      .exec();

    // If there was a bid, create a message for the winning bidder
    let messageWinner;
    if (lastBid) {
      messageWinner = new Message({
        title: 'You acquired the article',
        content: `The article titled "${article.title}" has expired, and you are the winning bidder as of ${currentTime.toISOString()}.`,
        receiver: lastBid.bidder._id,
        article: article._id
      });
    }

    // Save article status and messages
    await Promise.all([
      article.save(),
      messageOwner.save(),
      messageWinner ? messageWinner.save() : Promise.resolve(), // Only save if a winner exists
    ]);
  }


  });


articleSchema.index({ title: 'text'});


const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
