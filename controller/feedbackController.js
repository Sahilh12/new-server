const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const feedbackModel = require('../models/feedbackSchema.js')


module.exports.sendFeedback = catchAsyncError(async (req, res, next) => {
    const { senderName, email, feedback } = req.body
    if (!email || !senderName || !feedback) {
        return next(new ErrorHandler("Please fill full form ", 400))
    }
    const data = await feedbackModel.create({
        senderName,
        email,
        feedback,
    })
    res.status(200).json({
        success: true,
        message: "Thank you for your feedback 👍",
        data
    })
})