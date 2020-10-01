const express = require("express");
const router = express.Router();
const Joi = require("joi");
const messages = require("../controllers/message");

const validateMessage = (msg) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    ts: Joi.number().integer(),
    author: Joi.string()
      .pattern(new RegExp("(^[a-zA-Z]+[ ][a-zA-Z]+)"))
      .required(),
  });
  return schema.validate(msg);
};

router.get("/", function (req, res, next) {
  messages.getMessages((result) => {
    res.status(200).send(result);
  });
});

router.get("/:ts", function (req, res, next) {
  messages.getMessage(req.params.ts, (result) => {
    if (!result)
      return res
        .status(404)
        .send("The message with the given timestamp doesn't exist.");
    res.status(200).send(result);
  });
});

router.post("/", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send("Invalid message.");
  }
  messages.createMessage(req.body);
  res.status(200).send(req.body);
});

router.put("/:ts", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send("Invalid message.");
  }
  const newMessage = {
    message: req.body.message,
    ts: req.body.ts,
    author: req.body.author,
  };
  messages.updateMessage(req.body.ts, newMessage);
  res.send(newMessage);
});

router.delete("/:ts", function (req, res, next) {
  let ts = req.body.ts;
  messages.deleteMessage(ts);
  res.send("Deleted.");
});

module.exports = router;
