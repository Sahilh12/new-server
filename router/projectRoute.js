const express = require('express')
const { isAuthMiddleware } = require('../auth/authentication')
const { addProject, getAllProjects, deleteProject, getSingleProject, updateProject, getProjects } = require('../controller/projectController')
const multer = require('multer')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Make sure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/add", isAuthMiddleware, upload.array("projectBanner", 4), addProject);
router.put("/update/:id", isAuthMiddleware, upload.array("projectBanner", 4), updateProject);
router.get("/getAll", isAuthMiddleware, getAllProjects)
router.get("/getAll/:id", getProjects)
router.get("/getProject/:id", getSingleProject)
router.delete('/delete/:id', isAuthMiddleware, deleteProject)


module.exports = router