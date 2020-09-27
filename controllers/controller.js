"use strict"

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { reset } = require("nodemon");

const Coffee = require("../models/Coffee");
const User = require("../models/User");

//=============================================
// get /coffees
//=============================================
exports.getAllCoffees = async (req, res) =>{
    try{
        const coffees = await Coffee.find({}, "_id name desc addDate");
        res.json(coffees);
        console.log("get all coffees success")
    }catch(err){
        res.json({message: "failed to find"});
    }
}

exports.getCoffee = async (req, res) => {
    try{
        const reqCoffeeName = req.params.coffeeName.replace(/_/g, " ");
        const curCoffee = await Coffee.findOne({ name: reqCoffeeName }, "_id name desc addDate");
        res.json(curCoffee);
        console.log("get coffee success");
    }catch(err){
        res.json({ message: "coffee not found." });
    }
}

exports.getCoffeeFromId = async (req, res) => {
    try{
        const reqCoffeeId = req.params.coffeeId;
        const curCoffee = await Coffee.findOne({ _id: reqCoffeeId }, "_id name desc addDate");
        res.json(curCoffee);
        console.log("get coffee success");
    }catch(err){
        res.json({ message: "coffee not found." });
    }
}

exports.getCoffeeImage = async (req, res) => {
    try{
        const reqCoffeeName = req.params.coffeeName.replace(/_/g, " ");
        const curCoffee = await Coffee.findOne({ name: reqCoffeeName }, "image");
        res.set('Content-Type', 'image/png');
        res.send(curCoffee.image);
        console.log("get coffee success");
    }catch(err){
        res.json({ message: "coffee not found." });
    }
}

//=============================================
// login/logout
//=============================================
exports.login = (req, res) => {
    User.findOne({ username: req.body.username })
    .then(found=>{
        if(found.length == 0){
            res.json({ message: "wrong username or password" });
        }else{
            bcrypt.compare(req.body.password, found.password, (err, result) =>{
                if(err){
                    res.json({ message: "wrong username or password"});
                }else{
                    const token = jwt.sign(
                        {username: found.username},
                        process.env.JWT_KEY,
                        {expiresIn: "1h"}
                    );
                    res.status(200).json(
                        {message: "login success",
                        token: token}
                    );
                    console.log("login success");
                }
            });
        }
    })
    .catch(err => {
        res.json({ message: "login fail"});
    });
}

//=============================================
// add/edit/remove coffee
//==============================================
exports.addCoffee = async (req, res) => {
    //console.log(req.file);
    const newCoffee = new Coffee({
        name: req.body.name,
        desc: req.body.desc,
        addDate: new Date().toISOString(),
        image: req.file.buffer
    });
    try{
        const savedCoffee = await newCoffee.save();
        res.json({ message: "coffee added", id: savedCoffee._id });
        console.log("coffee added: " + savedCoffee._id);
    }catch(err){
        res.json({ message: err.message });
    }
}

exports.editCoffee = async (req, res) =>{
    try{
        const editedCoffee = await Coffee.updateOne(
            { _id: req.params.coffeeId },
            {$set:{
                name: req.body.name,
                desc: req.body.desc,
                image: req.file.buffer
            }}
        );
        res.json({ message: "coffee edited" });
        console.log("coffee edited");
    }catch(err){
        res.json({ message: err.message });
    }
}


exports.removeCoffee = async (req, res) =>{
    try{
        console.log("id: " + req.params.coffeeId);
        const removedCoffee = await Coffee.deleteOne({ "_id": req.params.coffeeId });
        res.json({ message: "coffee removed!" });
        console.log("coffee removed");
    }catch(err){
        res.json({ message: "failed to remove coffee." });
    }
}