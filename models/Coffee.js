const mongoose = require("mongoose");

const coffee = mongoose.Schema({
    name: {type: String, required: true },
    desc: {type: String, required: true }
});

module.exports = mongoose.model("Coffee", coffee);