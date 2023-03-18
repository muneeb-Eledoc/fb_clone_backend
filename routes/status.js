const router = require("express").Router();
const Status = require("../models/Status");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, async (req, res) => {
    try {
        const newStatus = new Status({ ...req.body, userId: req.user.id })
        const savedStatus = await newStatus.save()
        return res.status(201).json(savedStatus);
    } catch (e) {
        return res.status(500).json(e)
    }
})

router.get("/", verifyToken, async (req, res) => {
    try {
        let users = req.query.users.split('_')
        let status = await Promise.all(
            users.map((userId) => {
                return Status.find({ userId })
            }))
        let newStatus = []
        for (s of status) {
            if(!s[0]?.userId) continue
            newStatus.push({
                userId: s[0]?.userId,
                status: s
            })
        }
        return res.status(200).json(newStatus);
    } catch (e) {
        console.log(e)
        return res.status(500).json(e)
    }
})

module.exports = router 