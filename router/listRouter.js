const express = require('express')
const { catchAsyncError } = require('../middlewares/catchAsyncError')
const userModel = require('../models/userSchema')
const router = express.Router()

router.get('/portfolio', catchAsyncError(async (req, res, next) => {
    try {
        const user = await userModel.find()
        res.send(user)
    } catch (error) {
        console.error(error.message);
    }
}))


module.exports = router