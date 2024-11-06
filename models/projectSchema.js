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
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  gitRepoLink: {
    type: String,
    trim: true,
    required: true,
  },
  projectLink: {
    type: String,
    trim: true,
    required: true,
  },
  technologies: {
    type: String,
    trim: true,
    required: true,
  },
  stack: {
    type: String,
    trim: true,
    required: true,
  },
  deployed: {
    type: String,
    trim: true,
    required: true,
  },
  projectBanner: []
});





module.exports = mongoose.model("Project", projectSchema);