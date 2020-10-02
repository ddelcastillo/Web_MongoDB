const WebSocket = require("ws");
const messages_controller = require("./controllers/message");

const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();
    ws.on("message", (message) => {
      let msg = JSON.parse(message);
      msg.ts = Date.now();
      messages_controller.createMessage(msg, (result) => {
        sendMessages();
      });
    });
  });
};

const sendMessages = () => {
  let msgs = [];
  messages_controller.getMessages((messages) => {
    messages.forEach((element) => {
      msgs.push(element.message);
    });
    clients.forEach((client) => client.send(JSON.stringify(msgs)));
  });
};

module.exports.sendMessages = sendMessages;

exports.wsConnection = wsConnection;
