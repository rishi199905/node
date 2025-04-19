const express = require('express')

const app = express()

app.use( '/ass',  (req, res) => {
    res.send("ass")
})

app.use( '/tits',  (req, res) => {
    res.send("tits")
})

app.listen(8080, () => {
    console.log("listening")
})