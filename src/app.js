const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const requestRouter = require('./routes/requestRouter');
const userRouter = require("./routes/userRouter");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)


app.get("/feed", async (req, res) => {
  try {
    const response = await User.find({});
    console.log(response);
    if (response?.length === 0) {
      res.status(400).send("No users");
    } else {
      res.send(response);
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.body._id);
    if (response) {
      res.send({ deleted: response });
    }
  } catch (err) {
    res.send("something went wrong");
  }
});

app.delete("/deleteByEmail", async (req, res) => {
  try {
    const response = await User.findOne({ email: req.body.email });
    if (response) {
      try {
        await User.findOneAndDelete({ email: req.body.email });
        res.send("deleted");
      } catch (e) {
        res.status(500).send("Error while deleting by email");
      }
    } else {
      res
        .status(404)
        .send("User with email id " + req.body.email + "not found.");
    }
  } catch (err) {
    res.status(500).send("Error while deleting by email");
  }
});



connectDb()
  .then(() => {
    console.log("connected");
    app.listen(8080, () => {
      console.log("listening");
    });
  })
  .catch(() => {
    console.log("NOT!");
  });
