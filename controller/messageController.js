const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const messageModel = require('../models/messageSchema.js') 


module.exports.sendMessage = catchAsyncError(async (req, res, next) => {
    const { senderName, message, subject } = req.body
    if (!message || !senderName || !subject) {
        return next(new ErrorHandler("Please fill full form ", 400))
    }
    const data = await messageModel.create({
        receiverId: req.params.id,
        senderName,
        subject,
        message
    })
    res.status(200).json({
        success: true,
        message: "Message Sent!",
        data
    })
})

module.exports.getAllMessages = catchAsyncError(async (req, res, next) => {
    const allMessages = await messageModel.find({ receiverId: req.user })
    res.status(200).json({
        success: true,
        allMessages
    })
})

module.exports.deleteMessage = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    await messageModel.findByIdAndDelete(id)
    res.status(200).json({
        message: "Message deleted successfully"
    })
})