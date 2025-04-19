const express = require('express')
const auth = require('./middlewares/middleware')

const app = express()

app.use('/test', auth)

app.get( '/test/:user',  (req, res, next) => {
    console.log("9, a")

    next()
    // res.send(req.query)
}, (req, res) => {
    res.send("yo")
})

app.listen(8080, () => {
    console.log("listening")
})