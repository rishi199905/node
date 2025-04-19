const mongoose = require('mongoose')

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://bhattalwarr:CQIFpoX2NL4NitYk@cluster0.vchltst.mongodb.net/namaste_node')
}

module.exports = connectDb