const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({ 
    receiverId:{
        type:mongoose.Schema.ObjectId
    },
    senderName: {
        type: String,
        minLength: [2, "Name must contain at least 2 characters!"]
    },
    subject: {
        type: String,
        minLength: [2, "Subject must contain at least 2 characters!"]
    },
    message: {
        type: String,
        minLength: [2, "Message must contain at least 2 characters!"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model("Message" , messageSchema)