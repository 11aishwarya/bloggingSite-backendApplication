const jwt = require('jsonwebtoken');


const auth = (req,res,next) => {
    const token = req.headers['x-auth-key'];

    if(!token){
        return res.send({ status: false, Error: "authentication failed, and token must be present" });
    }
    const decodeToken = jwt.verify(token,process.env.SECRET_KEY,(err,decodeToken) => {
        if(err){
            return res.status(400).send({ status: false, msg:"Invalid token"});
        }else{
            req.userId = decodeToken.userId;
            next();
        }
    });
}


module.exports = {auth}