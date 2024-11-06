const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const timelineModel = require('../models/timelineSchema.js')


module.exports.addTimeline = catchAsyncError(async (req, res, next) => {
    try {
        const { title, description, from, to } = req.body

        console.log(from);


        const timeline = await timelineModel.create({
            userId: req.user,
            title, description,
            timeline: { from , to }
        })
        
        res.status(200).json({
            success: true,
            message: "Timeline added successfully!",
            timeline
        })
    } catch (error) {
        return next(new ErrorHandler('Please fill in all fields', 400))
    }
})

module.exports.getAllTimeline = catchAsyncError(async (req, res, next) => {
    const allTimeline = await timelineModel.find({ userId: req.user })
    res.status(200).json({ allTimeline })
})
module.exports.getTimelines = catchAsyncError(async (req, res, next) => {
    const allTimeline = await timelineModel.find({ _id: req.params.id })
    res.status(200).json(allTimeline)
})

module.exports.updateTimeline = catchAsyncError(async (req, res, next) => {
    const { title, description, from, to } = req.body
    if (!title || !description || !from) {
        return next(new ErrorHandler('Please fill in all fields', 400))
    }
    const timeline = await timelineModel.findByIdAndUpdate(req.params.id, {
        title, description, timeline: {
            from,
            to
        }
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ message: "Timeline Updated successfully", timeline })
})

module.exports.deleteTimeline = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const timeline = await timelineModel.findById(id)
    if (!timeline) {
        return next(new ErrorHandler(404, "Timeline not found"))
    }
    await timeline.deleteOne()
    res.status(200).json({
        message: "Timeline deleted successfully"
    })
})