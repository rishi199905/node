const express = require("express");
const auth = require("../middlewares/middleware");
const requestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toId", auth, async (req, res) => {
  try {
    //invalid status
    if (!["interested", "ignored"].includes(req.params.status)) {
      res.status(400).send("Invalid status");
    }

    const requestObj = {
      fromId: req.response._id + "",
      toId: req.params.toId,
      status: req.params.status,
    };
    const requestModelObject = new requestModel(requestObj);
    // request to self
    if (req.response._id + "" === req.params.toId) {
      throw new Error("Dont send the request to yourself, how lonely are you!");
    }

    //target user not found
    const isUserExists = await User.findById(req.params.toId);
    if (!isUserExists) {
      throw new Error("User Not Found");
    }

    //request to same user
    const isRequestSentBefore = await requestModel.findOne({
      $or: [
        { fromId: req.response._id + "", toId: req.params.toId },
        { toId: req.response._id + "", fromId: req.params.toId },
      ],
    });
    if (isRequestSentBefore) {
      throw new Error("Request sent before");
    }

    const response = await requestModelObject.save();
    res.json({
      message: "sent request with status " + req.params.status,
      sentTo: response,
    });
  } catch (error) {
    res
      .status(500)
      .send("something went wrong while sending connections : " + error);
  }
});

requestRouter.post(
  "/request/review/:status/:connectionId",
  auth,
  async (req, res) => {

    try {
      //invalid status
      if (!["accepted", "rejected"].includes(req.params.status)) {
        res.status(400).send("Invalid status");
      }
      console.log(req.params.connectionId + '')
      const existingConnection = await requestModel.findById(req.params.connectionId + '');

      if (!existingConnection) { throw new Error("Connection Not Found"); } 
      else {
        //fromUsER not found
        const isUserExists = await User.findById(
            existingConnection.fromId
        );
        if (!isUserExists) {
          await requestModel.findByIdAndDelete(existingConnection._id);
          throw new Error("Sender Not Found, removing the connection");
        }
        // is connection status interested
        if (!existingConnection.status === "interested") {
          throw new Error("Can accept only interested connections");
        }

        existingConnection.status = req.params.status
        existingConnection.save()
        res.json({
            message: "request " + req.params.status,
            data: existingConnection,
        });
      }
      
    } catch (error) {
      res
        .status(500)
        .send("something went wrong while sending connections : " + error);
    }
  }
);

module.exports = requestRouter;
