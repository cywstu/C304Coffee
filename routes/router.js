const express = require("express");
const router = express.Router();
const Coffee = require("../models/Coffee");

//=============================================
// coffee
//=============================================

router.get("/", (req, res) => {
    res.send("hi");
});

router.get("/coffee", async (req, res) => {
    try{
        const coffee = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({message:err});
    }
});

router.get("/coffee/:coffeeId", async (req, res) => {
    try{
        const curCoffee = await Coffee.findById(req.params.coffeeId);
        res.json(curCoffee);
    }catch(err){
        res.json({message:err});
    }
});

//=============================================
// login/logout
//=============================================


router.get("/login", (req, res) => {
    try{
        res.send("login");
    }catch(err){
        res.json({message:err});
    }
});

router.post("/login", async (req, res) => {
    const curPost = new Post({
        title: req.body.title,
        desc: req.body.desc
    });

    try{
        const savedPost = await curPost.save();
        res.json(savedPost);
    }catch(err){
        res.json({message: err});
    }
    console.log("login post");
});

//=============================================
// add/delete coffee
//=============================================

router.delete("/deleteCoffee/:coffeeId", async(req,res) =>{
    try{
        const removedPost = await Coffee.remove({_id: req.params.postId});
        res.json(removedPost);
    }catch(err){
        res.json({ message: err});
    }    
});

router.patch("/updateCoffee/:coffeeId", async(req,res) =>{
    try{
        const updatedCoffee = await Coffee.update(
            {_id: req.params.postId},
            {$set:{
                name: req.body.name,
                desc:req.body.desc
            }});
        res.json(updatedCoffee);
    }catch(err){
        res.json({ message: err});
    }    
});

router.post("/addcoffee", async (req, res) => {
    const newCoffee = new Coffee({
        name: req.body.name,
        desc: req.body.desc
    });

    try{
        const savedCoffee = await newCoffee.save();
        res.json(savedCoffee);
    }catch(err){
        res.json({message: err});
    }
    console.log("coffee posted");
});

module.exports = router;