const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    fromId: {
        type: String,
        ref: 'User'
    },
    toId: {
        type: String,
        ref: 'User'
    },
    status:{
        type: String,
        enum: {
            values:["accepted", "rejected", "interested", "ignore"],
            message: '{VALUE} is not valid'
        }
    }
}, {
    timestamps: true
})

const requestModel = new mongoose.model("requestModel", requestSchema)
module.exports = requestModel