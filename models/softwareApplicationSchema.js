const mongoose = require('mongoose')

const softwareApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},
  name: {
    type: String,
    required: [true, "Application name is required"]
  },
  svg: {
    type: String,
    required: [true, "Application icon is required"]
  },
});

module.exports = mongoose.model("SoftwareApplication", softwareApplicationSchema);