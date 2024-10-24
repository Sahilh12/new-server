const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const softwareApplicationModel = require('../models/softwareApplicationSchema.js')
const { v2 } = require('cloudinary')


module.exports.addApplication = catchAsyncError(async (req, res, next) => {
    if (!req.files || Object.values(req.files) <= 0) { 
        return next(new ErrorHandler('Please upload a file', 400))
    }

    const { svg } = req.files

    const cloudinaryResponseForApp = await v2.uploader.upload(
        svg.tempFilePath,
        { folder: "APPLICATION" }
    )

    const application = await softwareApplicationModel.create({
        userId: req.user,
        name: req.body.name,
        svg: {
            public_id: cloudinaryResponseForApp.public_id,
            url: cloudinaryResponseForApp.secure_url
        }
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
        name: req.body.name
    }
    if (!req.files) {
        return next(new ErrorHandler('Please upload a file', 400))
    }
    const application = await softwareApplicationModel.findById(req.params.id) 


    await v2.uploader.destroy(application.svg.public_id)

    const { svg } = req.files 

    const cloudinaryResponseForApp = await v2.uploader.upload(
        svg.tempFilePath,
        { folder: "APPLICATION" }
    )
    if (!cloudinaryResponseForApp || cloudinaryResponseForApp.error) {
        return next(new ErrorHandler("Failed to upload image", 400))
    }

    newData.svg = {
        public_id: cloudinaryResponseForApp.public_id,
        url: cloudinaryResponseForApp.secure_url
    }

    const updateApplication = await softwareApplicationModel.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true
    }) 
    res.status(200).json({success:true , message:'Updated successfully' , updateApplication })
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