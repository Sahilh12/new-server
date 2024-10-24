const express = require('express') 
const { sendMessage, getAllMessages, deleteMessage } = require('../controller/messageController')
const { isAuthMiddleware } = require('../auth/authentication')

const router = express.Router()


router.post("/send/:id", sendMessage)
router.get("/getAll" ,isAuthMiddleware, getAllMessages)
router.delete('/delete/:id' ,isAuthMiddleware, deleteMessage)



module.exports = router