"use strict"

const Coffee = require("../models/Coffee");
const User = require("../models/User");

const auth = require("../middlewares/auth");
//============================================

exports.getAllCoffees = async (req, res) =>{
    try{
        const coffees = await Coffee.find();
        res.json(coffees);
    }catch(err){
        res.json({message: "failed to find"});
    }
}

exports.removeCoffee = auth, async(req, res) =>{

}