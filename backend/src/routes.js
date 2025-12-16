const express = require("express");
const Message = require("./models/Message");

const router = express.Router();

router.get("/messages", async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

router.post("/messages", async (req, res) => {
  const msg = new Message({ content: req.body.content });
  await msg.save();
  res.json(msg);
});

module.exports = router;
