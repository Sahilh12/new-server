const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { ErrorHandler } = require("../middlewares/error");
const { jwtToken } = require('../utils/jwtToken.js')
const { sendEmail } = require("../utils/sendEmail.js");
const crypto = require('crypto')
const userModel = require('../models/userSchema')
const messageModel = require('../models/messageSchema.js')
const projectModel = require('../models/projectSchema.js')
const skillModel = require('../models/skillSchema.js')
const applicationModel = require('../models/softwareApplicationSchema.js')
const timelineModel = require('../models/timelineSchema.js');
const path = require('path')
const fs = require('fs')




module.exports.register = catchAsyncError(async (req, res, next) => {

    if (!req.files) {
        return next(new ErrorHandler("Avtar and Resume are Required! ", 400))
    }
    const avatarFile = req.files['avtar'] ? req.files['avtar'][0].path : null;

    const resumeFile = req.files['resume'] ? req.files['resume'][0].path : null;


    const {
        fullName,
        email,
        phone,
        password,
        githubUrl } = req.body

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
        return next(new ErrorHandler("Email Already Exist!", 400))
    }


    const user = await userModel.create({
        fullName,
        email,
        phone,
        password,
        githubUrl,
        avtar: avatarFile,
        resume: resumeFile
    })

    jwtToken(user, "User Registered", 201, res)

})

module.exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("email and password are required", 400))
    }

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("user not found", 400))
    }

    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("email or password incorrect", 400))
    }

    jwtToken(user, "Logged In", 200, res)

})

module.exports.updateUser = catchAsyncError(async (req, res, next) => {

    const loggedInUser = await userModel.findById(req.user)

    if (req.files['avtar']) {
        if (loggedInUser.avtar) {
            const oldImagePath = path.join(`D:/Portfolio/MERN/New folder/New folder/server/${loggedInUser.avtar}`);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log('avtar deleted : ', oldImagePath);
            }
        }
    }
    if (req.files['resume']) {
        if (loggedInUser.resume) {
            const oldImagePath = path.join(`D:/Portfolio/MERN/New folder/New folder/server/${loggedInUser.resume}`);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log('resume deleted : ', oldImagePath);
            }
        }
    }


    const newData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioUrl: req.body.portfolioUrl,
        githubUrl: req.body.githubUrl,
        instagramUrl: req.body.instagramUrl,
        twitterUrl: req.body.twitterUrl,
        linkedInUrl: req.body.linkedInUrl,
        avtar: req.files['avtar'] && req.files['avtar'][0].path,
        resume: req.files['resume'] && req.files['resume'][0].path
    }

    const user = await userModel.findOneAndUpdate({ _id: req.user }, newData)
    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        user
    })

})

module.exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await userModel.find({ _id: req.user })
    const message = await messageModel.find({ receiverId: req.user })
    const project = await projectModel.find({ userId: req.user })
    const skill = await skillModel.find({ userId: req.user })
    const application = await applicationModel.find({ userId: req.user })
    const timeline = await timelineModel.find({ userId: req.user })

    res.status(200).json({
        success: true,
        user,
        message,
        project,
        skill,
        application,
        timeline
    })
})

module.exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const { currPassword, createNewPassword, confirmNewPassword } = req.body

    const user = await userModel.findById(req.user).select("+password")

    if (!currPassword || !createNewPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Fill all fields properly!", 400))
    }
    if (createNewPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New password and confirm password do not match!", 400))
    }
    if (currPassword === createNewPassword) {
        return next(new ErrorHandler("Current password and new password cannot be the same!", 400))
    }

    const isMatch = await user.comparePassword(currPassword)
    if (!isMatch) {
        return next(new ErrorHandler("password incorrect"))
    }

    user.password = createNewPassword
    await user.save()

    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        user
    })

})

module.exports.logOut = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        sameSite: "None",
        secure: true
    })
    res.status(200).send("User Logged Out")
})

module.exports.getUserForPortfolio = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById({ _id: req.params.id })
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    res.status(200).json({ user })
})

module.exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }
    const resetToken = await user.getResetToken()
    await user.save({ validateBeforeSave: false })
    const resetUrl = `https://fancy-blini-23a92e.netlify.app/resetPassword/${resetToken}`
    const message = `Your password reset link is :- \n\n ${resetUrl} \n\n if you've not request for this , ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Personal Portfolio Dashboard Recovery Password',
            message: message
        })
        res.status(200).json({
            success: true,
            message: `Email sent successfully to ${user.email}`,
            user
        })
    } catch (error) {
        await user.save()
        user.resetPasswordExpired = undefined
        user.resetPasswordToken = undefined
        return next(new ErrorHandler("Error sending email", 500))
    }
})

module.exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpired: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid token or Token expired", 400))
    }
    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler("Please provide both password and confirm password", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpired = undefined
    await user.save()
    res.status(200).json({
        success: true,
        message: "Password reset successfully",
        user
    })
})