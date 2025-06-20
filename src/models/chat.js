const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
sender: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        text: {
            type: String,
            required:true
        }

} , {timestamps: true})

const chatSchema = new mongoose.Schema({
        participants: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        }],
        messages: [msgSchema]
});

const Chat = mongoose.model("Chat", chatSchema)
const Msg = mongoose.model("Msg", msgSchema)
module.exports = { Chat, Msg }