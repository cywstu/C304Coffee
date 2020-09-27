"use strict"

const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage({
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
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

const router = express.Router();
const Controller = require("../controllers/controller");
const auth = require("../middlewares/auth");

//=============================================
router.get("/", (req, res) => {
    res.json({ message: "success connecting to home page" });
});

/**
 * @swagger
 * /login:
 *  post:
 *    description: request all types of coffee
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: username
 *        description: username
 *        in: body
 *        required: true
 *        type: string
 *      - name: password
 *        description: password.
 *        in: body
 *        required: true
 *        type: string
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: '#/definitions/NewUser'
 */
router.post("/login", Controller.login);

/**
 * @swagger
 * /coffees:
 *  get:
 *    description: request all types of coffee
 *    responses:
 *      "2xx":
 *        description: successful response
 *        content:
 *        application/json:
 *          schema:
 *            type: Coffee (models/Coffee.js)
 *            properties:
 *              _id:
 *                type: string
 *                example: q956kgnsdq3
 *              name:
 *                type: string
 *                example: simple coffee
 *              desc:
 *                type: string
 *                example: this is simple coffee
 *              addDate:
 *                type: date
 *                example: 1945-08-24T19:45:08.242Z
 *              image:
 *                type: buffer
 */
router.get("/coffees", Controller.getAllCoffees);
router.get("/coffees/:coffeeName", Controller.getCoffee);
router.get("/coffees/:coffeeName/image", Controller.getCoffeeImage);
router.get("/coffees/id/:coffeeId", Controller.getCoffeeFromId);

//take {name: ?string, desc: ?string, image: ?buffer}
router.post("/add", auth, upload.single("image"), Controller.addCoffee);
//take {name: ?string, desc: ?string, image: ?buffer}
router.put("/edit/:coffeeId", auth, upload.single("image"), Controller.editCoffee);
router.delete("/remove/:coffeeId", auth, Controller.removeCoffee);

//================================================
//swagger defs
//================================================

/**
 * @swagger
 *
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

module.exports = router;


//================================================
//signup(unused)
//================================================
/*
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
*/