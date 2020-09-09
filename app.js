require("dotenv/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//import custom modules
const connectDB = require("./connections/db");
const router = require("./routes/router");
app.use(router);

//vars
const port = process.env.PORT || 3000;

//============================================
//connectDB();

const mongoose = require("mongoose");

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log("db connected")
);

//router(app);

//============================================
app.listen(port, () => console.log("listening on port " + port));