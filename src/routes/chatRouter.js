const express = require('express');
const { Chat } = require('../models/chat');
const auth = require('../middlewares/middleware');

const chatRouter = express.Router()

chatRouter.get('/chat/:id', auth, async (req, res) => {
    const  {id} = req.params;
    const userId = req.response._id
    try {
        let chat = await Chat.findOne({participants : { $all : [userId, id]}}).populate({
            path: "messages.sender",
            select : "firstName"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, id],
                messages:[]
            });
        }
        const savedChat = await chat.save();
        res.send(savedChat)
    } catch (error) {
        console.log(error);
    }
})

module.exports = chatRouter