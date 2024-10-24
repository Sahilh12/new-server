const express = require('express')
const { isAuthMiddleware } = require('../auth/authentication')
const { addTimeline, getAllTimeline, deleteTimeline, getTimelines, updateTimeline } = require('../controller/timelineController')

const router = express.Router()


router.post("/add", isAuthMiddleware, addTimeline)
router.get("/getAll",isAuthMiddleware, getAllTimeline)
router.get('/getAll/:id' , getTimelines)
router.put('/update/:id' , updateTimeline)
router.delete('/delete/:id', isAuthMiddleware, deleteTimeline)


module.exports = router