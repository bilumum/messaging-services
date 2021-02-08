var express = require("express");

const router = express.Router();
const onlineUsers = [];

router.get("/", (req, res, next) => {

    res.json(onlineUsers);
    
});

router.post("/", (req, res, next) => {

    console.log(req);
    onlineUsers.push(req.body);
    res.status(201).json(req.body);

});

module.exports = router;