const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  text: {
    type: String,
    required: true
  },
  teach: {
    type: String,
    required: true
  },
  learn: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

let Post = mongoose.model("post", PostSchema);
module.exports = Post;
