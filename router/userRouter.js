const express = require('express')
const { register, login, updateUser, logOut, getUserForPortfolio, forgotPassword, resetPassword, updatePassword, getUser } = require('../controller/userController')
const { isAuthMiddleware } = require('../auth/authentication')
const router = express.Router()
const upload = require('../utils/multer')


router.post("/register", upload.fields([
    { name: 'avtar', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), register);

router.post("/login", login)
router.get('/logout', logOut)
router.get("/getuser", isAuthMiddleware, getUser)

router.put("/update/profile", isAuthMiddleware, upload.fields([
    { name: 'avtar', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), updateUser)

router.put("/update/password", isAuthMiddleware, updatePassword)
router.get("/me/portfolio/:id", getUserForPortfolio)
router.post("/password/reset", forgotPassword)
router.put("/password/reset/:token", resetPassword)


module.exports = router