const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
});

const ChatSchema = new Schema({
  userA: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  userB: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  log: [ MessageSchema ]
});

let Chat = mongoose.model("chat", ChatSchema);
module.exports = Chat;
