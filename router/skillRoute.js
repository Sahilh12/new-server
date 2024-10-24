const express = require('express')
const { isAuthMiddleware } = require('../auth/authentication');
const { addSkill, updateSkill, deleteSkill, getSkills } = require('../controller/skillController');

const router = express.Router()


router.post("/add", isAuthMiddleware, addSkill)
router.put("/update/:id", isAuthMiddleware, updateSkill);
router.get("/getAll", isAuthMiddleware, getSkills)
router.delete('/delete/:id', isAuthMiddleware, deleteSkill)


module.exports = router