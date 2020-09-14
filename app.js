"use strict"
require("dotenv/config");
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import custom modules
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