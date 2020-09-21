"user strict"
const jwt = require("jsonwebtoken");

module.exports = (req,res,next) =>{
    try{
        //if using header(Bearer): req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(req.body.token, process.env.JWT_KEY);
        req.userData = decodedData;
        next();
    }catch(err){
        res.status(401).json({
            message: "Auth failed"
        });
    }
}