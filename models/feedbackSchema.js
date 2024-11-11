const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({ 
    receiverMail:{
        type: String,
        default:'sahilhirani01@gmail.com'
    },
    senderName: {
        type: String,
        minLength: [2, "Name must contain at least 2 characters!"]
    },
    email: {
        type: String,
        minLength: [10, "Subject must contain at least 10 characters!"]
    },
    feedback: {
        type: String,
        minLength: [15, "Feedback must contain at least 15 characters!"]
    },
    createdAt: {
        type: Date,
        default: Date.now() 
    }
})


module.exports = mongoose.model("Feedback" , feedbackSchema)