"use strict"
require("dotenv/config");
const express = require("express");
const app = express();
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
const cors = require("cors");
app.use(cors);


//custom modules
const db = require("./connections/db");
db.connect();
const router = require("./routes/router");
app.use(router);

//vars
const port = process.env.PORT || 3000;

//============================================




//router(app);

//============================================
app.listen(port, () => console.log("listening on port " + port));