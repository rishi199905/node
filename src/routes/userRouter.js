const express = require('express')
const auth = require('../middlewares/middleware')
const requestModel = require('../models/connectionRequest')
const User = require('../models/user')
const userRouter = express.Router()


userRouter.get('/user/requests', auth, async (req, res) => {

    try {
        const pedningRequests = await requestModel.find({toId: req.response._id +'', status: "interested"}).populate("fromId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"])
        if (pedningRequests?.length === 0){
            res.send("No pending requests")
        } else {
            res.json({
                data: pedningRequests,
                message: "requests fetch successfull"
            })
        }
    } catch (error) {
        res.status(500).send("Error" + error)
    }
})

userRouter.get('/user/connections', auth, async (req, res) => {

    try {
        const acceptedRequests = await requestModel.find({ $or: [{fromId: req.response._id+'', status: "accepted"} ,{ toId: req.response._id+'', status: "accepted"}] })
        .populate("fromId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"])
        .populate("toId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"])
        if (acceptedRequests?.length === 0){
            res.send("No pending requests")
        } else {
            const data = acceptedRequests.map( (row) => {
                if (row.fromId._id+'' === req.response._id+'') {
                    return row.toId
                }
                return row.fromId
            })
            res.json({
                data: data,
                message: "requests fetch successfull"
            })
        }
    } catch (error) {
        res.status(500).send("Error" + error)
    }
})


userRouter.get('/feed', auth, async (req, res) => {
    try {

        const pageNo = parseInt(req.query.page) ?? 1
        const limit = parseInt(req.query.limit) ?? 10
        const loggedInUser = req.response
        const mySentAndRevievedRequests = await requestModel.find({ $or: [{fromId: loggedInUser._id+''}, {toId: loggedInUser._id+''}]})
        
        const hideUsers = new Set()
        mySentAndRevievedRequests.forEach( (request) => {
            hideUsers.add(request.fromId)
            hideUsers.add(request.toId)
        })
        hideUsers.add(loggedInUser._id+'')
        const feedData = await User.find({
            _id : { $nin: Array.from(hideUsers)}
        }).select(["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]).skip((pageNo  * limit) - limit ).limit(limit)

        res.json({
            data : feedData
        })
        
    } catch (err) {
        res.status(500).send("something is wrong..." + err)
    }
})

module.exports  = userRouter