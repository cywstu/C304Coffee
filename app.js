"use strict"

require("dotenv/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
/*
//cors problem
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        return res.status(200).json({});
    }
    next();
});
*/
app.use(cors());


//custom modules
const router = require("./routes/router");
app.use(router);
const swagger = require("./swagger");
app.use("/api-docs", swagger.serve, swagger.setup);

//vars
const port = process.env.PORT || 3000;

//============================================

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log("db connected")
);

//============================================
app.listen(port, () => console.log("listening on port " + port));