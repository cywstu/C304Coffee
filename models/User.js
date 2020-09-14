const mongoose = require("mongoose");

const user = mongoose.Schema({
username: {type: String, required: true, match: /[a-zA-Z0-9]*/ },
    password: {type: String, required: true }
});

module.exports = mongoose.model("User", user);