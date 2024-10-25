const path = require('path')
const { catchAsyncError } = require('../middlewares/catchAsyncError.js')
const { ErrorHandler } = require('../middlewares/error.js')
const projectModel = require('../models/projectSchema.js')
const fs = require('fs')



module.exports.addProject = catchAsyncError(async (req, res, next) => {

    const filePath = req.files.map((file) => file.path)

    try {
        const { title,
            description,
            gitRepoLink,
            projectLink,
            technologies,
            stack,
            deployed } = req.body


        if (!title || !description || !gitRepoLink || !projectLink || !technologies || !stack || !deployed) {
            return next(new ErrorHandler("Please fill full form ", 400))
        }
        if (!req.files || Object.values(req.files) <= 0) {
            return next(new ErrorHandler("Project Banner is Required! ", 400))
        }


        const project = await projectModel.create({
            userId: req.user,
            title,
            description,
            gitRepoLink,
            projectLink,
            technologies,
            stack,
            deployed,
            // projectBanner: projectBanner.path,
            projectBanner: filePath
        })
        res.status(200).json({
            success: true,
            message: "Project Created!",
            project
        })
    } catch (error) {
        console.log('failed to upload', error);
    }
})

module.exports.updateProject = catchAsyncError(async (req, res, next) => { 

    const filePath = req.files.map((file) => file.path) 
    console.log(filePath);
    
    const project = await projectModel.findById(req.params.id)  

    if (req.files.length > 0) {
        project.projectBanner.forEach((singlePath, i) => {
            const oldImagePath = path.join(`D:/Portfolio/MERN/New folder/New folder/server/${singlePath}`)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath)
                console.log('old project image deleted');
            }
        })
    }

    const newData = {
        title: req.body.title,
        description: req.body.description,
        gitRepoLink: req.body.gitRepoLink,
        projectLink: req.body.projectLink,
        technologies: req.body.technologies,
        stack: req.body.stack,
        deployed: req.body.deployed,
        projectBanner: filePath.length > 0 ? filePath : project.projectBanner
    }

    const updatedProject = await projectModel.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "Project Updated!",
        updatedProject
    })

})

module.exports.getAllProjects = catchAsyncError(async (req, res, next) => {
    const allProjects = await projectModel.find({ userId: req.user })
    res.status(200).json({
        success: true,
        allProjects
    })
})
module.exports.getProjects = catchAsyncError(async (req, res, next) => {
    const allProjects = await projectModel.find({ userId: req.params.id })
    res.status(200).json({
        success: true,
        allProjects
    })
})

module.exports.getSingleProject = catchAsyncError(async (req, res, next) => {
    const project = await projectModel.findById(req.params.id)
    if (!project) {
        return next(new ErrorHandler("Project not found", 404))
    }
    res.status(200).json({
        success: true,
        project
    })

})

module.exports.deleteProject = catchAsyncError(async (req, res, next) => {
    const project = await projectModel.findByIdAndDelete(req.params.id)
    if (!project) {
        return next(new ErrorHandler("Project not found", 404))
    }
    res.status(200).json({
        message: "Project deleted successfully"
    })
})