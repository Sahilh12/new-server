const mongoose = require('mongoose')

// const projectBannerSchema = new mongoose.Schema({
//   public_id: { type: String, required: true },  
//   url: { type: String, required: true }, 
// });

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Please enter a title."],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please enter a description."],
  },
  gitRepoLink: {
    type: String,
    trim: true,
    required: [true, "Please enter a Git repository link."],
  },
  projectLink: {
    type: String,
    trim: true,
    required: [true, "Please enter a project link."],
  },
  technologies: {
    type: String,
    trim: true,
    required: [true, "Please enter the technologies used."],
  },
  stack: {
    type: String,
    trim: true,
    required: [true, "Please enter the project stack."],
  },
  deployed: {
    type: String,
    trim: true,
    required: [true, "Please specify if the project is deployed."],
  },
  projectBanner: [] // Store an array of objects
});





module.exports = mongoose.model("Project", projectSchema);