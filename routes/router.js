"use strict"
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./images");
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }else{
        cb(new Error("file type not allowed"), false);
    }
}
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024*1024*10 },
    fileFilter: fileFilter
});

//custom modules
const Coffee = require("../models/Coffee");
const User = require("../models/User");
//middlewares
const auth = require("../middlewares/auth");
//controller
const Controller = require("../controllers/controller");

//=============================================
// coffee
//=============================================

router.get("/", (req, res) => {
    res.send("hi");
});

router.post("/", (req, res) =>{
    res.send("hi post");
});

router.get("/link", (req, res)=>{
    res.send(process.env.DB_CONNECTION);
});

router.get("/coffees", Controller.getAllCoffees);

router.get("/coffees/:coffeeId", async (req, res) => {
    try{
        const reqCoffeeName = req.params.coffeeId.replace(/_/g, " ");
        const curCoffee = await Coffee.find({ name: reqCoffeeName});
        res.json(curCoffee);
    }catch(err){
        res.json({message:err});
    }
});

//=============================================
// login/logout
//=============================================

router.post("/signup", (req, res) =>{
    User.find({ username: req.body.username })
    .then(found =>{
        if(found.length != 0){
            res.json({message: "username already exists"});
        }else{
            bcrypt.hash(req.body.password, 16, (err, hash) => {
                if(err){
                    return res.status(500).json({ message: "hash failed: " + hash });
                }else{
                    const user = new User({
                        username: req.body.username,
                        password: hash
                    });
        
                    user.save()
                    .then(result =>{
                        res.json({message: "user created: "});
                    })
                    .catch(err =>{
                        res.json({message: "failed to create user"});
                    });
                }
            });
        }
    })
    .catch(err => {
        res.send({ message: "database connection failed"});
    });
});


router.post("/login", (req, res) => {
    User.findOne({ username: req.body.username })
    .then(found=>{
        if(found.length == 0){
            res.send({ message: "wrong username or password" })
        }else{
            bcrypt.compare(req.body.password, found.password, (err, result) =>{
                if(err){
                    res.send({ message: "wrong username or password"});
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
                }
            });
        }
    })
    .catch(err => {
        res.send({ message: "database connection failed"});
    });
});

//=============================================
// add/delete coffee
//=============================================

router.get("/delete", auth, async(req,res) =>{
    try{
        res.json({ data: "all removable coffees" });
    }catch(err){
        res.json({ message: err });
    }    
});

router.delete("/delete/:coffeeId", auth, async(req,res) =>{
    try{
        const removedCoffee = await Coffee.remove({name: req.params.coffeeId});
        res.json(removedCoffee);
    }catch(err){
        res.json({ message: err });
    }    
});

router.get("/update", auth, async(req,res) =>{
    try{
        res.json({ data: "all updatable coffees" });
    }catch(err){
        res.json({ message: err });
    }    
});

router.patch("/update/:coffeeId", auth, async(req,res) =>{
    try{
        const updatedCoffee = await Coffee.update(
            {name: req.params.name},
            {$set:{
                name: req.body.name,
                desc: req.body.desc
            }});
        res.json(updatedCoffee);
    }catch(err){
        res.json({ message: err });
    }    
});

router.post("/add", auth, upload.single("image"),async (req, res) => {
    //console.log(req.file);
    const newCoffee = new Coffee({
        name: req.body.name,
        desc: req.body.desc,
        addDate: new Date().toISOString(),
        image: req.file.path
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