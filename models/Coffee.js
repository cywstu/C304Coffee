const mongoose = require("mongoose");

const coffee = mongoose.Schema({
    name: {type: String, required: true },
    desc: String
});

module.exports = mongoose.model("Coffee", coffee);