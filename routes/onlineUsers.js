var express = require("express");

const crypto = require("crypto");

const router = express.Router();

var onlineUsers = [];

router.get("/", (req, res, next) => {

    res.json(onlineUsers);
    
});

router.post("/", (req, res, next) => {
    req.body.userId = crypto.randomBytes(16).toString("hex");
   
    var foundIndex = onlineUsers.findIndex(user => user.name.trim() === req.body.name.trim() && user.surname.trim() === req.body.surname.trim());

    if(foundIndex > -1){
        res.status(500).send({
            error: "This user has already joined chat. Please use another name&surname :)"
        });
        //res.status(500, { error: "This user has already joined chat. Please use another name&surname :)" });
    }

    onlineUsers.push(req.body);
    res.status(201).json(req.body);

});

function logoutUser(loggedOutUser){
   console.log(loggedOutUser);
    onlineUsers = onlineUsers.filter(user => user.userId !== loggedOutUser.userId);
}

module.exports = {router, logoutUser};