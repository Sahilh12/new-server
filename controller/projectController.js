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
            projectBanner: filePath
        })
        res.status(200).json({
            success: true,
            message: "Project Created!",
            project
        })
    } catch (error) {
        return next(new ErrorHandler("Please fill full form ", 400))
    }
})

module.exports.updateProject = catchAsyncError(async (req, res, next) => {
    try {
        const { title, description, deployed, stack, technologies, gitRepoLink, projectLink, deletedImages } = req.body;

        if (!title || !projectLink) {
            return next(new ErrorHandler("Please fill form properly ", 400))
        }

        const project = await projectModel.findById(req.params.id);

        // Update text fields if provided
        if (title) project.title = title;
        if (description) project.description = description;
        if (deployed) project.deployed = deployed;
        if (stack) project.stack = stack;
        if (technologies) project.technologies = technologies;
        if (gitRepoLink) project.gitRepoLink = gitRepoLink;
        if (projectLink) project.projectLink = projectLink;

        if (deletedImages) {
            const deletedImagePaths = (Array.isArray(deletedImages) ? deletedImages : [deletedImages]).map((url) => url.replace("https://new-server-e0l5.onrender.com/", ""));
            project.projectBanner = project.projectBanner.filter((path, i) => !deletedImagePaths.includes(path))
        }

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => file.path); 
            project.projectBanner = [...project.projectBanner, ...newImages];
        }

        if (project.projectBanner.length <= 0) {
            return next(new ErrorHandler("Please upload at least one banner image", 400))
        }

        await project.save();
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
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