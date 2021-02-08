var express = require("express");

const onlineUsersRoute = require('./routes/onlineUsers')

const app = express();
app.use(express.json());


app.use("/users", onlineUsersRoute);

app.use("/", function(req, res){
    return res.send("node api is working...");
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});