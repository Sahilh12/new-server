const mongoose = require('mongoose')

const skillSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required:[true , "Title is required"],
        trim:true
    },
    proficiency: {
        type: Number,
        required:[true , "Proficiency is required"],
        trim:true
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

module.exports = mongoose.model("Skill", skillSchema); 