"user strict"

const jwt = require("jsonwebtoken");

module.exports = (req,res,next) =>{
    try{
        //if using header(Bearer): req.headers.authorization.split(" ")[1];
        const decodedData = jwt.verify(req.headers.authorization, process.env.JWT_KEY);
        console.log("auth success");
        //req.userData = decodedData;
        next();
    }catch(err){
        console.log("auth failed");
        res.status(401).json({
            message: "Auth failed"
        });
    }
}
