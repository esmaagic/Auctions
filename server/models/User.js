const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
     firstname: {
        type: String, required:true
    },
    lastname: {
        type: String, required:true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    banned: {type: Boolean, required: true, default: false}
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});


module.exports = mongoose.model("User", userSchema)