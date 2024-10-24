const express = require('express')

const skillModel = require('../models/skillSchema')
const { catchAsyncError } = require('../middlewares/catchAsyncError')
const { v2 } = require('cloudinary')
const { ErrorHandler } = require('../middlewares/error')

module.exports.addSkill = catchAsyncError(async (req, res, next) => {
    const { title, proficiency } = req.body
    if (!req.files || Object.values(req.files) <= 0) {
        return next(new ErrorHandler("SVG file is Required! ", 400))
    }
    const { svg } = req.files
    const cloudinaryResponse = await v2.uploader.upload(
        svg.tempFilePath,
        { folder: "SKILL IMAGE" }
    )
    const skill = await skillModel.create({
        userId: req.user,
        title,
        proficiency,
        svg: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    })
    res.status(201).json({ message: 'Skill added successfully', skill })

})

module.exports.updateSkill = catchAsyncError(async (req, res, next) => {
    const newSkill = {
        title: req.body.title,
        proficiency: req.body.proficiency
    }

    const updatedSkill = await skillModel.findByIdAndUpdate(req.params.id, newSkill, {
        new: true,
    })

    res.status(200).json({
        status: true,
        message: "Skill updated successfully",
        updatedSkill
    })
})

module.exports.getSkills = catchAsyncError(async (req, res, next) => {
    const skills = await skillModel.find({ userId: req.user }) 
    res.status(200).json({ status: true, skills })
})

module.exports.deleteSkill = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    await skillModel.findByIdAndDelete(id)
    res.status(200).json({ status: true, message: "Skill deleted successfully" })
})

