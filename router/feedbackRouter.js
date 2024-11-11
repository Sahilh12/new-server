const express = require('express')  
const router = express.Router()

const { sendFeedback } = require('../controller/feedbackController') 

router.post("/send", sendFeedback)

module.exports = router