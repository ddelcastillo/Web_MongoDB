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
  let msg = req.body;
  msg.ts = Date.now();
  const { error } = schema.validate(msg);
  if (error) {
    console.log(error);
    return res.status(412).send(error_412 + error.message + ".");
  }
  messages_controller.createMessage(msg, (result) => {
    res.status(201).send(msg);
    ws.sendMessages();
  });
});

router.put("/:ts", function (req, res, next) {
  let msg = req.body;
  const { error } = schema.validate(msg);
  if (error) return res.status(412).send(error_412 + error.message + ".");
  msg.ts = Number(req.params.ts); // ¡No se debe modifica ts con el put!
  messages_controller.updateMessage(Number(req.params.ts), msg, (result) => {
    if (result.result.n === 1) {
      ws.sendMessages();
      return res.status(200).send(msg);
    }
    res.status(404).send(error_404);
  });
});

router.delete("/:ts", function (req, res, next) {
  let ts = req.params.ts;
  messages_controller.deleteMessage(Number(ts), (result) => {
    if (result.result.n === 1) {
      ws.sendMessages();
      return res
        .status(200)
        .send("Deleted the message with the timestamp " + ts + ".");
    }
    res.status(404).send(error_404);
  });
});

module.exports = router;
