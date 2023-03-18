const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
const verifyToken = require("../middleware/verifyToken");

// Update user
router.post("/:id", verifyToken, async (req, res)=>{
   if(req.user.id === req.params.id){
       if(req.body.password){
           try{
             const salt = await bcrypt.genSalt(10);
             req.body.password = await bcrypt.hash(req.body.password, salt);
           }catch(e){
            return res.status(500).send({"error": err})
          }
       }
       try{
           const updated_user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
          return res.status(200).send({"success": "Account has been updated."})
    }catch(e){
    return res.status(500).send({"error": err})
    }
   }else{
    return res.status(500).send({"error": "you cant update"})
}
});

// subscribe for notification
router.post("/subscribe/:id", verifyToken, async (req, res)=>{
   if(req.user.id === req.params.id){
       try{
           const user = await User.findById(req.params.id);
           await user.updateOne({ $push: { subscriptions: req.body}})

          return res.status(200).send({"success": "Account has been updated."})
    }catch(e){
    return res.status(500).send({"error": err})
    }
   }else{
    return res.status(500).send({"error": "you cant update"})
}
});

// Delete user
router.delete("/:id", verifyToken, async (req, res)=>{
  if(req.user.id === req.params.id){
      try{
            const deleted_user = await User.findByIdAndDelete(req.params.id);
            res.status(200).send({"success": "Account has been Deleted."})
     }catch(e){
     return res.status(500).send({"error": err})
     }
    }else{
        return res.status(500).send({"error": "you cant delete"})
    }
 });

 // get a user
router.get("/", async (req, res)=>{
    const username = req.query.username;
    const userId = req.query.userId;
        try{
            const get_user = userId ? await User.findById(userId) : await User.findOne({username});
            const {password, updatedAt, ...other} = get_user._doc;
            return res.status(200).send(other)
     }catch(e){
     return res.status(500).json(e)
     }
 });
 //get current user
 router.get("/current", verifyToken, async (req, res)=>{
      try{
          const get_user = await User.findById(req.user.id);
          const {password, updatedAt, ...other} = get_user._doc;
          return res.status(200).json({"user": other})
   }catch(e){
   return res.status(500).json(e)
   }
});
//  get all user
 router.get("/all", verifyToken, async (req, res)=>{
      try{
          const all_user =  await User.find()
          // const {password, updatedAt, _id, ...other} = all_user._doc;
          return res.status(200).json({"all": all_user})
   }catch(e){
   return res.status(500).json(e)
   }
});

 //get friends
router.get("/friends", verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const friends = await Promise.all(
        user.followins.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      return res.status(200).json(friendList)
    } catch (err) {
      return res.status(500).send(err);
    }
  });  

 // follow user
router.put("/:id/follow", verifyToken, async (req, res)=>{
    if(req.user.id !== req.params.id){
        try{
            const follower_user = await User.findById(req.params.id);
            let currentUser = await User.findById(req.user.id);
            if(!follower_user.followers.includes(req.user.id)){
                await follower_user.updateOne({ $push: { followers: req.user.id}})
                await currentUser.updateOne({ $push: { followins: req.params.id}})
                currentUser = await User.findById(req.user.id);
                return res.status(200).json({"status":"followed", "user": currentUser})
            }else{
              await follower_user.updateOne({ $pull: { followers: req.user.id}})
              await currentUser.updateOne({ $pull: { followins: req.params.id}})
              currentUser = await User.findById(req.user.id);
              return res.status(200).json({"status":"unfollowed", "user": currentUser})
            }
     }catch(e){
     return res.status(500).send({"error": err})
     }
    }else{
        return res.status(403).send({"error": "You can't follow yourself."})
       }
 });

  // Unfollow user
// router.put("/:id/unfollow", async (req, res)=>{
//     if(req.body.userId !== req.params.id){
//         try{
//             const follower_user = await User.findById(req.params.id);
//             const currentUser = await User.findById(req.body.userId);
//             if(follower_user.followers.includes(req.body.userId)){
//                 await follower_user.updateOne({ $pull: { followers: req.body.userId}})
//                 await currentUser.updateOne({ $pull: { followins: req.params.id}})
//                 res.status(200).send({"success": "User has unfollowed."})
//             }else{
//                 return res.status(403).send({"error": "You didn't follow yet."})
//             }
//      }catch(e){
//      return res.status(500).send({"error": err})
//      }
//     }else{
//         return res.status(403).send({"error": "You can't follow yourself."})
//        }
//  });

module.exports = router;