const express = require('express')
const { isAuthMiddleware } = require('../auth/authentication')
const { addApplication, getAllApplication, deleteApplication, getApplication, updateApplication } = require('../controller/softwareApplicationController')

const router = express.Router()


router.post("/add", isAuthMiddleware, addApplication)
router.get("/getAll",isAuthMiddleware, getAllApplication)
router.get("/getApp/:id", getApplication)
router.put('/update/app/:id' ,isAuthMiddleware, updateApplication)
router.delete('/delete/:id', isAuthMiddleware, deleteApplication)


module.exports = router