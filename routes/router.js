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
 *      - name: User
 *        description: object of user
 *        in: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/User"
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/TokenMessage"
 */
router.post("/login", Controller.login);

/**
 * @swagger
 * /coffees:
 *  get:
 *    description: request all types of coffee
 *    produces:
 *      - application/json
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          type: array
 *          items:
 *            $ref: "#/definitions/Coffee"
 */
router.get("/coffees", Controller.getAllCoffees);

 /**
 * @swagger
 * /coffees/:coffeeName:
 *  get:
 *    description: request a single coffee via name
 *    produces:
 *      - application/json
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/Coffee"
 */
router.get("/coffees/:coffeeName", Controller.getCoffee);

/**
 * @swagger
 * /coffees/:coffeeName/image:
 *  get:
 *    description: request the image of a coffee
 *    produces:
 *      - application/json
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/CoffeeImage"
 */
router.get("/coffees/:coffeeName/image", Controller.getCoffeeImage);
//router.get("/coffees/id/:coffeeId", Controller.getCoffeeFromId);

/**
 * @swagger
 * /add:
 *  post:
 *    description: adding a coffee
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: token
 *        description: a valid token from login
 *        in: Headers/Authorization
 *        required: true
 *      - name: Coffee
 *        description: object of a coffee
 *        in: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/Coffee"
 *      - name: CoffeeImage
 *        description: image of a coffee
 *        in: form
 *        required: true
 *        schema:
 *          $ref: "#/definitions/CoffeeImage"
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/AddMessage"
 */
router.post("/add", auth, upload.single("image"), Controller.addCoffee);

/**
 * @swagger
 * /edit/:coffeeId:
 *  put:
 *    description: editing a coffee
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: token
 *        description: a valid token from login
 *        in: Headers/Authorization
 *        required: true
 *      - name: Coffee
 *        description: object of a coffee
 *        in: body
 *        required: true
 *        schema:
 *          $ref: "#/definitions/Coffee"
 *      - name: CoffeeImage
 *        description: image of a coffee
 *        in: form
 *        required: true
 *        schema:
 *          $ref: "#/definitions/CoffeeImage"
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/Message"
 */
router.put("/edit/:coffeeId", auth, upload.single("image"), Controller.editCoffee);

/**
 * @swagger
 * /remove/:coffeeId:
 *  delete:
 *    description: deleting a coffee
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: token
 *        description: a valid token from login
 *        in: Headers/Authorization
 *        required: true
 *      - name: id
 *        description: id of the coffee
 *        in: body
 *        required: true
 *        type: string
 *        example: "5f70ff5b5cddac1e8c389414"
 *    responses:
 *      "2xx":
 *        description: successful response
 *        schema:
 *          $ref: "#/definitions/Message"
 */
router.delete("/remove/:coffeeId", auth, Controller.removeCoffee);

//================================================
//swagger defs
//================================================

/**
 * @swagger
 *
 * definitions:
 *   Message:
 *     type: object
 *     properties:
 *       message:
 *         description: telling if api request succeed or failed
 *         type: string
 *         required: true
 *         example: "adding coffee success!"
 */

 /**
 * @swagger
 *
 * definitions:
 *   TokenMessage:
 *     type: object
 *     properties:
 *       message:
 *         description: telling if api request succeed or failed
 *         type: string
 *         required: true
 *         example: "login success!"
 *       token:
 *         description: will be given on login success, for validating the ap request was sent from approved user
 *         type: string
 *         required: true
 *         example: "df458mnMkoa7hW87sU56nnb7hsnkjaF"   
 */

 /**
 * @swagger
 *
 * definitions:
 *   AddMessage:
 *     type: object
 *     properties:
 *       message:
 *         description: telling if api request succeed or failed
 *         type: string
 *         required: true
 *         example: "coffee added!"
 *       id:
 *         description: will be given on adding coffee success
 *         type: string
 *         required: true
 *         example: "5f70ff5b5cddac1e8c389414"   
 */

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       username:
 *         description: username
 *         type: string
 *         required: true
 *         example: "username"
 *       password:
 *         description: password
 *         type: string
 *         required: true
 *         example: "password"
 */

 /**
 * @swagger
 *
 * definitions:
 *   Coffee:
 *     type: object
 *     properties:
 *       name:
 *         description: name of the coffee
 *         type: string
 *         required: true
 *         example: "simple coffee"
 *       desc:
 *         description: description of the coffee
 *         type: string
 *         required: true
 *         example: "this is simple coffee"
 *       addDate:
 *         description: the date of coffee being added, don't need to add this for request
 *         type: date
 *         example: 1945-02-08T19:45:02.080Z
 */

/**
 * @swagger
 *
 * definitions:
 *   CoffeeImage:
 *     type: buffer
 *     properties:
 *       image:
 *         description: image buffer of the coffee
 *         type: buffer
 *         required: true
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