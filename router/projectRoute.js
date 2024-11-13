const express = require('express')
const router = express.Router()
const { isAuthMiddleware } = require('../auth/authentication')
const { addProject, getAllProjects, deleteProject, getSingleProject, updateProject, getProjects } = require('../controller/projectController')
const upload = require('../utils/multer')

// Remove the limit (4) from the upload array constraint
router.post("/add", isAuthMiddleware, upload.array("projectBanner"), addProject);
router.put("/update/:id", isAuthMiddleware, upload.array("projectBanner"), updateProject); 
router.get("/getAll", isAuthMiddleware, getAllProjects)
router.get("/getAll/:id", getProjects)
router.get("/getProject/:id", getSingleProject)
router.delete('/delete/:id', isAuthMiddleware, deleteProject)


module.exports = router