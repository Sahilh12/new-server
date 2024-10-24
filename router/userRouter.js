const express = require('express')
const { register, login, updateUser, logOut, getUserForPortfolio, forgotPassword, resetPassword, updatePassword, getUser } = require('../controller/userController')
const { isAuthMiddleware } = require('../auth/authentication')

const router = express.Router()


router.post("/register", register)
router.post("/login", login)
router.get('/logout', logOut)
router.get("/getuser", isAuthMiddleware, getUser)
router.put("/update/profile", isAuthMiddleware, updateUser)
router.put("/update/password", isAuthMiddleware, updatePassword)
router.get("/me/portfolio/:id", getUserForPortfolio)
router.post("/password/reset", forgotPassword)
router.put("/password/reset/:token", resetPassword)


module.exports = router