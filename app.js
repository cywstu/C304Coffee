const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

//import custom modules
const connectDB = require("./connections/db");
const router = require("./routes/router")
//============================================
connectDB();

router(app);

app.listen(port, () => console.log("listening on port " + port));