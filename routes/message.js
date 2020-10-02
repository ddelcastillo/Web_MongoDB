const express = require("express");
const router = express.Router();
const Joi = require("joi");
const messages_controller = require("../controllers/message");
const ws = require("../wslib");

const error_412 = "Invalid message, ";
const error_404 = "No message with such timestamp exists.";

const schema = Joi.object({
  message: Joi.string().min(5).required(),
  ts: Joi.number().integer(),
  author: Joi.string()
    .pattern(new RegExp("(^[a-zA-Z0-9.-]+[ ][a-zA-Z0-9. -]+)"))
    .required(),
});

router.get("/", function (req, res, next) {
  messages_controller.getMessages((result) => {
    res.status(200).send(result);
  });
});

router.get("/:ts", function (req, res, next) {
  messages_controller.getMessage(Number(req.params.ts), (result) => {
    if (!result) return res.status(404).send(error_404);
    res.status(200).send(result);
  });
});

router.post("/", function (req, res, next) {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(412).send(error_412 + error.message + ".");
  }
  messages_controller.createMessage(req.body, (result) => {
    res.status(201).send(req.body);
    ws.sendMessages();
  });
});

router.put("/:ts", function (req, res, next) {
  const { error } = validateMessage(req.body);
  if (error) {
    return res.status(412).send(error_412 + error.message + ".");
  }
  messages_controller.updateMessage(
    Number(req.params.ts),
    req.body,
    (result) => {
      if (result.result.n === 1) return res.status(200).send(req.body);
      res.status(404).send(error_404);
    }
  );
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
