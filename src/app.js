const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const response = await User.findOne({ email: req.body.email });
    if (response) {
      res.send("User already exists");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
  try {
    const response = await newUser.save();
    res.send({ saved: response });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/user", async (req, res) => {
  try {
    const response = await User.findOne({ email: req.body.email });
    if (response) {
      res.send(response);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

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
    console.log(err);
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

app.patch("/update", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body._id, req.body, {runValidators : true});
    res.send({ updated: req.body._id });
  } catch (err) {
    res.status(500).send("something went wrong" + err.message);
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
