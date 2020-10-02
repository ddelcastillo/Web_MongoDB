const express = require("express");
const router = express.Router();
const Joi = require("joi");
const messages = require("../controllers/message");
const ws = require("../wslib");

const error_400 = "Invalid message.";
const error_404 = "No message with such timestamp exists.";

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
  messages.getMessage(Number(req.params.ts), (result) => {
    if (!result) return res.status(404).send(error_404);
    res.status(200).send(result);
  });
});

router.post("/", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send(error_400);
  }
  messages.createMessage(req.body);
  res.status(201).send(req.body);
});

router.put("/:ts", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(400).send(error_400);
  }
  messages.updateMessage(Number(req.params.ts), req.body, (result) => {
    if (result.result.n === 1) return res.status(200).send(req.body);
    res.status(404).send(error_404);
  });
});

router.delete("/:ts", function (req, res, next) {
  const ts = req.params.ts;
  messages.deleteMessage(Number(ts), (result) => {
    if (result.result.n === 1)
      return res
        .status(200)
        .send("Deleted the message with the timestamp " + ts + ".");
    else return res.status(404).send(error_404);
  });
});

module.exports = router;
