const auth = (req, res, next) => {
    const token = "aa"
    if (token !== "a") {
        console.log("4, m")
        res.status(401).send("invalid cred")
    } else {
        console.log("7, m")
        next()
    }
}

module.exports = auth