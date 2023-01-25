const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for private message
const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  receiver: {
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

let Message = mongoose.model("message", MessageSchema);
module.exports = Message;
