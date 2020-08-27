const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) =>{
    res.send("hi");
});

app.get("/coffee", (req,res) =>{
    res.send("coffee");
});

app.listen(port, () => console.log("listening on port " + port));