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
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("SoftwareApplication", softwareApplicationSchema);