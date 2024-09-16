const express = require('express')
const router = express.Router();
const {getCurrentUser, getAllUsers, addToSaved,removeFromSaved, banUser, unbanUser} = require('../controllers/usersController')
const {isAuth} = require("../middleware/auth")
const {isAdmin} = require("../middleware/auth")

router.get('/me',getCurrentUser );
router.get('/', getAllUsers)
router.put('/save/:articleId', isAuth,addToSaved)
router.delete('/save/:articleId', isAuth, removeFromSaved)
router.put('/:userId/ban', isAdmin,  banUser);
router.put('/:userId/unban', isAdmin, unbanUser);
module.exports = router;