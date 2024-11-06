const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const softwareApplicationModel = require('../models/softwareApplicationSchema.js')
const path = require('path')
const fs = require('fs')


module.exports.addApplication = catchAsyncError(async (req, res, next) => {
    if (!req.file || Object.values(req.file) <= 0) {
        return next(new ErrorHandler('Please upload a file', 400))
    }

    const application = await softwareApplicationModel.create({
        userId: req.user,
        name: req.body.name,
        svg: req.file.path
    })

    res.status(200).json({
        success: true,
        message: "Application added successfully!",
        application
    })
})

module.exports.getAllApplication = catchAsyncError(async (req, res, next) => {
    const allApplication = await softwareApplicationModel.find({ userId: req.user })
    res.status(200).json({ allApplication })
})

module.exports.getApplication = catchAsyncError(async (req, res, next) => {
    const allApplication = await softwareApplicationModel.find({ _id: req.params.id })
    res.status(200).json({ allApplication })
})

module.exports.updateApplication = catchAsyncError(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        svg: req.file && req.file.path
    }

    const application = await softwareApplicationModel.findById(req.params.id)

    if (req.file && application.svg) {
        const oldPath = `D:/Portfolio/MERN/New folder/New folder/server/${application.svg}`
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath)
            console.log('old application image deleted');
        }
    }

    const updateApplication = await softwareApplicationModel.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({ success: true, message: 'Updated successfully', updateApplication })
})

module.exports.deleteApplication = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const application = await softwareApplicationModel.findById(id)
    if (!application) {
        return next(new ErrorHandler("Application not found", 404))
    }
    await application.deleteOne()
    res.status(200).json({
        message: "Application deleted successfully"
    })
})