const router = require("express").Router();
const Conversation = require("../models/Conversation");
const verifyToken = require("../middleware/verifyToken");

router.post("/:receiverId", verifyToken, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $all: [req.user.id, req.params.receiverId] }
        })
        if(!conversation.length > 0){
            const newConversation = new Conversation({
                members: [req.user.id, req.params.receiverId]
            })
            const savedConversation = await newConversation.save()
            return res.status(201).json({ "conversation": savedConversation });
        }
        return res.status(200).json({ "message": 'Conversation already exist.' });
    } catch (e) {
        return res.status(500).json(e)
    }
})

router.get("/", verifyToken, async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.user.id] }
        })
        return res.status(200).json({ "conversation": conversation });
    } catch (e) {
        return res.status(500).json(e)
    }
})

router.get("/:receiverId", verifyToken, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.user.id, req.params.receiverId] }
        })
        return res.status(200).json(conversation);
    } catch (e) {
        return res.status(500).json(e)
    }
})

module.exports = router 