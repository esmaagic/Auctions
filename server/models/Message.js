const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }, 
    content: {
        type: String,
        required: true,
        trim: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    seen: {
        type: Boolean,
        required: true,
        default: false
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Article'
    }
}, {
    timestamps: true
});




const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
