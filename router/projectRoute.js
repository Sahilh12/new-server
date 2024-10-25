const express = require('express')
const router = express.Router() 
const { isAuthMiddleware } = require('../auth/authentication')
const { addProject, getAllProjects, deleteProject, getSingleProject, updateProject, getProjects } = require('../controller/projectController') 
const upload = require('../utils/multer')

router.post("/add", isAuthMiddleware, upload.array("projectBanner" , 4), addProject);
router.put("/update/:id", isAuthMiddleware, upload.array("projectBanner", 4), updateProject);
router.get("/getAll", isAuthMiddleware, getAllProjects)
router.get("/getAll/:id", getProjects)
router.get("/getProject/:id", getSingleProject)
router.delete('/delete/:id', isAuthMiddleware, deleteProject)


module.exports = router