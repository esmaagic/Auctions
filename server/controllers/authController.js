const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registration Controller
const registerUser = async (req, res) => {
    try {
       
        const { username, email, password, firstname, lastname } = req.body.data;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        const user = new User({ username, email, password, firstname, lastname });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Login Controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (user.banned) {
            return res.status(403).json({ message: 'Your account has been banned. Please contact support.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Start session
        req.session.user = user;

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        
    }
};
 

// Logout Controller
const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {

            return res.status(500).json({ message: 'Failed to log out', error: err });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = {registerUser, loginUser, logoutUser}