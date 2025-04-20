const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
const auth = require("./middlewares/middleware");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {

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
    res.send({ saved: response });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const response = await User.findOne({ email : email})
        if (response) {
            const match = await bcrypt.compare(password, response.password)
            if (match) {
                const token = jwt.sign({ _id: response._id}, "tony@stark@42", { expiresIn: '1h' })
                res.cookie('token', token, {expires: new Date(Date.now() + 1 * 3600000)})
                res.send("Logged in")
            }  else {
                throw new Error("Invalid credentials")
            }
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (err) {
        res.status(500).send("something went wrong " + err)
    }
     
})



app.get('/profile',auth, (req, res) => {
    res.send(req.response)
})

app.post('/sendRequest', auth, (req, res) => {
  res.send(req.response.firstName + "sent request")
})

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
    const allowed_updates = ["_id", "photoUrl", "about", "gender", "age", "skills"]
    const isAllowed = (field) => allowed_updates.includes(field)
    const validate = Object.keys(req.body).every(isAllowed)
    if (!validate) {
        res.status(401).send("Update Not Allowed")
    } else {
        await User.findByIdAndUpdate(req.body._id, req.body, {runValidators : true});
        res.send({ updated: req.body._id });    
    }
    
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
