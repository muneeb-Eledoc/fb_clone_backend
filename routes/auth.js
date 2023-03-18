const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const privateKey = "4322jns"

// Register
router.post("/register", async (req, res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const { password , ...other} = req.body
        const newuser = await new User({
            ...req.body,
            password: hashedPassword
        });
        const userdata = await newuser.save()
        return res.status(200).send(userdata)
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
});

// login
router.post("/login", async(req, res)=>{
   try{
     const user = await User.findOne({email: req.body.email});
      if(!user){
          return res.status(404).json({"error": "User Not Found"});
      }
     const validPassword = await bcrypt.compare(req.body.password, user.password);
      if(!validPassword){
         return res.status(400).json({"error": "Invalid Password"});
      } 
      const token = jwt.sign({ id: user._id }, privateKey);
      return res.status(200).json({"success": true, "token": token});
   }catch(e){
        return res.status(500).json({"error":"server error"})
    }
});

module.exports = router;
// if (error.statusCode === 410) {
//     console.log("Subscription has expired or is no longer valid");
//   } else {
//     console.log(error)
//   }

// const promises = req.body.subscription.map(async sub => {
//     const payload = JSON.stringify(req.body.message);
//     return webPush.sendNotification(sub, payload, options);
//   });

//   await Promise.all(promises);
