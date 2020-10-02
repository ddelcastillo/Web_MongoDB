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

const getMessage = (id, callback) => {
  conn.then((client) => {
    client
      .db(db)
      .collection(messages_collection)
      .findOne({ ts: id })
      .then((result) => {
        callback(result);
      });
  });
};

const createMessage = (msg, callback) => {
  conn.then((client) => {
    client
      .db(db)
      .collection(messages_collection)
      .insertOne(msg)
      .then((result) => callback(result));
  });
};

const updateMessage = (id, msg, callback) => {
  conn.then((client) => {
    client
      .db(db)
      .collection(messages_collection)
      .updateOne({ ts: id }, { $set: msg })
      .then((result) => {
        callback(result);
      });
  });
};

const deleteMessage = (id, callback) => {
  conn.then((client) => {
    client
      .db(db)
      .collection(messages_collection)
      .deleteOne({ ts: id })
      .then((result) => {
        callback(result);
      })
      .catch((err) => {
        console.log(err);
      });
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
