const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();
const {isAuth} = require("../middleware/auth")

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuth, logoutUser);

module.exports = router;
