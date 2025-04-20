
const User = require("../models/user");
var jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const { token } = req.cookies
    
    try {
        const isValid = await jwt.verify(token, "tony@stark@42")

        if (!token) {
            throw new Error("Invalid token")
        }
        const response = await User.findById(isValid._id)
        if (response) {
            req.response = response
            next()
        } else {
            throw new Error("invalid cred")
        }
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports = auth