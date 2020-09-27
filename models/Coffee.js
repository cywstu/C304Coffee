const mongoose = require("mongoose");

const coffee = mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    addDate: { type: Date, required: true },
    image: { type: Buffer, required: true }
});

module.exports = mongoose.model("Coffee", coffee);