const router = require("express").Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/verifyToken");

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const savedMessage = await newMessage.save()
        return res.status(200).json(savedMessage);
    } catch (e) {
        return res.status(500).json(e)
    }

})

router.get("/:conversationId", async (req, res) => {
    const page_size = 8
    const page = parseInt(req.query.page || "0")
    try {
        const total = await Message.countDocuments({
            conversationId: req.params.conversationId
        })

        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        .sort({createdAt: -1})
        .limit(page_size)
        .skip(page_size*page)
        
        return res.status(200).json({total: Math.ceil(total/page_size), messages});
    } catch (e) {
        return res.status(500).json(e)
    }

})

router.get("/lastmessage/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ _id: -1 }).limit(1)
        return res.status(200).json(messages[0]);
    } catch (e) {
        return res.status(500).json(e)
    }

})

module.exports = router 