const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
    }
}, {
    timestamps: true
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
