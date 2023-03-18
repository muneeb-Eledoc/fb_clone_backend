const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// Create Post
router.post("/", verifyToken, async (req, res)=>{
    if(!req.user.id) return res.status(500).json({"error": "You are not Logged in"})
    const newpost = new Post({...req.body, userId: req.user.id});
    try{
       const savedPost = await newpost.save()
       return res.status(201).json(savedPost);
    }catch(e){
        return res.status(500).json({"error": "server error"})
    }
});

// Update Post
router.put("/:id", verifyToken, async (req, res)=>{
    try{
       const post = await Post.findById(req.params.id);
       if(post.userId === req.user.id){
           await post.updateOne({$set: req.body});
           return res.status(200).json("Post has been Updated");
       }else{
        return res.status(403).json("You can only update your post");
       }
    }catch(e){
        return res.status(500).json({"error": "server error"})
    }
});

// Delete Post
router.delete("/:id/:userId", async (req, res)=>{
    try{
       const post = await Post.findById(req.params.id);
       if(post.userId === req.params.userId){
           const deletedPost = await post.deleteOne();
           return res.status(200).json("Post has been Deleted");
       }else{
       return res.status(403).json("You can only delete your post");
       }
    }catch(e){
        return res.status(500).json({"error": "server error"})
    }
});

// Like / Dislike Post
router.put("/:id/like", verifyToken, async (req, res)=>{
    try{
       const post = await Post.findById(req.params.id);
       if(!post.likes.includes(req.user.id)){
           await post.updateOne({$push:{ likes: req.user.id}});
           return res.status(200).json("post liked");
       }else{
        await post.updateOne({$pull:{ likes: req.user.id}});
        return res.status(200).json("post disliked");
    }
    }catch(e){
        return res.status(500).json({"error": "server error"})
    }
});

// Get a Post
router.get("/:id", async (req, res)=>{
    try{
       const post = await Post.findById(req.params.id);
       res.status(200).json(post);    
    }catch(e){
        return res.status(500).json({"error": "server error"})
    }
});

// Get Timeline Posts
router.get("/timeline/:userId", async (req, res)=>{
    try{
       const currentUser = await User.findById(req.params.userId);
       const userPosts = await Post.find({userId: currentUser._id});
       const friendsPosts = await Promise.all(
           currentUser.followins.map((friendId)=>{
              return Post.find({userId: friendId});
           })
       );
       const timelinePosts = userPosts.concat(...friendsPosts)
       res.status(200).json(timelinePosts);    
    }catch(e){
    return res.status(500).json(e)
    }
});

// Get user all Posts
router.get("/profile/:username", async (req, res)=>{
    try{
       const user = await User.findOne({username: req.params.username});
       const userPosts = await Post.find({userId: user._id});
       res.status(200).json(userPosts);    
    }catch(e){
    return res.status(500).json(e)
    }
});

module.exports = router 