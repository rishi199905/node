const express = require('express')
const auth = require("../middlewares/middleware")
const User = require('../models/user')

const profileRouter = express.Router()


profileRouter.get('/profile/view',auth, (req, res) => {
    res.send(req.response)
})

// app.post("/user", async (req, res) => {
//   try {
//     const response = await User.findOne({ email: req.body.email });
//     if (response) {
//       res.send(response);
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

profileRouter.patch("/profile/edit",auth, async (req, res) => {
    try {
      const allowed_updates = ["firstName","lastName","photoUrl", "about", "gender", "age", "skills"]
      const isAllowed = (field) => allowed_updates.includes(field)
      const validate = Object.keys(req.body).every(isAllowed)
      if (!validate) {
          res.status(401).send("Update Not Allowed")
      } else {
          await User.findByIdAndUpdate(req.response._id +'', req.body, {runValidators : true});
          res.send({ updated: req.response.firstName +''})
      }
      
    } catch (err) {
      res.status(500).send("something went wrong " + err.message);
    }
  });

  profileRouter.patch('/profile/passUpdate', auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body
        const oldSavedPassword = await findOne({_id : req.response._id + ''})
        const validate = await bcrypt.compare(oldPassword, oldSavedPassword)
        if (!validate) {
            res.status(401).send("Wrong old password")
        } else {
            const hashedPass = await bcrypt.hash(newPassword, 12)
            await User.findByIdAndUpdate(req.response._id +'', {password : hashedPass});
            res.send({ updated: req.response.firstName +''})
        }
        
      } catch (err) {
        res.status(500).send("something went wrong " + err.message);
      }
})

module.exports = profileRouter