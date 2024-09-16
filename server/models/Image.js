const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }
}, {
    timestamps: true
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
