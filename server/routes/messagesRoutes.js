const express = require('express');
const router = express.Router();
const { createMessage, getUserMessages, markAsRead, hasMessages } = require('../controllers/messagesController') ;
const {isAuth, isAdmin} = require("../middleware/auth")

router.get("/notifications/:userId", isAuth, hasMessages)
router.get("/:userId", isAuth, getUserMessages)
router.post("/", isAdmin, createMessage)
router.put("/:messageId", isAuth, markAsRead)


module.exports = router;