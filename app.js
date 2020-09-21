"use strict"
require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());

/*
//cors problem
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});
*/

//custom modules
const router = require("./routes/router");
app.use(router);
app.use("/images", express.static("images"));

//vars
const port = process.env.PORT || 3000;

//============================================

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log("db connected")
);

//router(app);

//============================================
app.listen(port, () => console.log("listening on port " + port));