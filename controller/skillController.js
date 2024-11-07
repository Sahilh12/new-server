const skillModel = require('../models/skillSchema')
const { catchAsyncError } = require('../middlewares/catchAsyncError')
const { ErrorHandler } = require('../middlewares/error')

module.exports.addSkill = catchAsyncError(async (req, res, next) => {
    const { title, proficiency } = req.body

    if (!title) {
        next(new ErrorHandler('Title is required', 400))
    }
    if (!proficiency) {
        next(new ErrorHandler('Proficiency is required', 400))
    }

    const isExistSkill = await skillModel.findOne({ title })

    if(isExistSkill){
        next(new ErrorHandler('Skill already added'))
    }

    const skill = await skillModel.create({
        userId: req.user,
        title,
        proficiency,
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

