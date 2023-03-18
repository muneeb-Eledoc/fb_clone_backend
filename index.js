const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cors = require("cors");
const multer = require("multer");
const path = require("path")
const webPush = require('web-push')
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/messages");
const statusRouter = require("./routes/status");

const app = express()

dotenv.config();
app.use(cors())

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

mongoose.connection.once('open', () => {
  console.log("Connected To MongoDB")
})

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files")
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name)
  }
})
const upload = multer({ storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({ "success": "File uploaded" })
  } catch (e) {
    return res.status(500).json({ "error": "server error" })
  }
})
app.get('/', (req, res)=>{
  res.status(200).json({
    status: 'working'
  })
})
app.use("/images", express.static(path.join(__dirname, "public/files")));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postsRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/status", statusRouter);

app.post('/api/subscribe', async (req, res) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:muneebjs.css@gmail.com',
      publicKey: 'BHD-irDuWfPkFu3FXdKXBJT-k7BUq_0mtgNt1Xg6UCfZfSxLHiudprK2YjkxVZb0KHiN-BZ6BCbJPc0lo1-2Go0',
      privateKey: '-iR9r-iOXH1xUu-prtdgw3gcHHNgcb2OJYtyEI3b4ls',
    },
  };
  try {

    const promises = req.body.subscription.map(async sub => {
      const payload = JSON.stringify(req.body.message);
      const resluts = await webPush.sendNotification(sub, payload, options);
      console.log('\n\nresults  \n', resluts)

    });

    await Promise.all(promises);

    res.sendStatus(200)

  } catch (error) {
    if(error.statusCode === 410){
      console.log('sub expired', error)
    }
    return res.sendStatus(500);
  }
});

app.listen(8800, () => {
  console.log("Server listening")
})

module.exports = app