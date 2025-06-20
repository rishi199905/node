const express = require('express')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const User = require("../models/user");

const authRouter = express.Router()

authRouter.post("/signup", async (req, res) => {

  const bodyCopy = req.body;
  const hash = await bcrypt.hash(req.body.password, 12);
  bodyCopy.password = hash;
  const newUser = new User(bodyCopy);
  try {
    const response = await User.findOne({ email: bodyCopy.email });
    if (response) {
      res.send("User already exists");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
  try {
    const response = await newUser.save();
    const token = jwt.sign({ _id: response._id}, "tony@stark@42", { expiresIn: '1h' })
    res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)})
    res.json({ message:"User Signed Up!", data: response})
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const response = await User.findOne({ email : email})
        if (response) {
          
            const match = await bcrypt.compare(password, response.password)
            if (match) {
                const token = jwt.sign({ _id: response._id}, "tony@stark@42", { expiresIn: '1h' })
                res.cookie('token', token, {expires: new Date(Date.now() + 8 * 3600000)})
                res.send(response)
            }  else {
                throw new Error("Invalid password")
            }
        } else {
            throw new Error("Invalid email")
        }
    } catch (err) {
        res.status(400).send("something went wrong " + err)
    }
     
})

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('token')
    .send("Logged out")
})
module.exports = authRouter