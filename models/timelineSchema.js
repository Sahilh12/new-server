const mongoose = require('mongoose')

const timelineSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        trim:true,
        required: [true, "Title Required!"],
    },
    description: {
        type: String,
        trim:true,
        required: [true, "Description Required!"],
    },
    timeline: {
        from: {
            trim:true,
            type: String,
            required: [true, "Timeline start date is required"]
        },
        to: {
            default:"Present",
            type: String,
        },
    },
})


module.exports = mongoose.model("Timeline", timelineSchema)