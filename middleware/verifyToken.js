const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=>{
    const token = req.headers.token
    console.log(token)
    if(token){
        jwt.verify(token, '4322jns', function(err, decoded) {
            console.log(decoded)
            if(err) return res.status(400).json("Invalid Token", )
            req.user = decoded
            req.token = token
            next()
          });
    }else{
        return res.status(401).json({"error": "You are not Authenticated"})
    }
}

module.exports = verifyToken