const conn = require("../lib/mongo");

const db = "chat";
const messages_collection = "messages";

const getMessages = (callback) => {
  conn.then((client) => {
    let msgs = client
      .db(db)
      .collection(messages_collection)
      .find()
      .toArray((err, data) => {
        callback(data);
      });
  });
};

const getMessage = (ts, callback) => {
  conn.then((client) => {
    client
      .db(db)
      .collection(messages_collection)
      .findOne({ ts: ts })
      .then((result) => {
        callback(result);
      });
  });
};

const createMessage = (msg) => {
  conn.then((client) => {
    client.db(db).collections(messages_collection).insertOne(msg);
  });
};

const updateMessage = (msg) => {
  conn.then((client) => {
    client
      .db(db)
      .collections(messages_collection)
      .updateOne({ ts: msg.ts }, { $set: msg });
  });
};

const deleteMessage = (msg) => {
  conn.then((client) => {
    client.db(db).collections(messages_collection).deleteOne({ ts: msg.ts });
  });
};

const messages = {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};

module.exports = messages;
