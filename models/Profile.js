const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  name: {
    type: String
  },
  gender: {
    type: String
  },
  age: {
    type: Number,
    min: 16,
    max: 75
  },
  nationality: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  // Languages can teach
  teach: [
    {
      type: String
    }
  ],
  // Languages want learn
  learn: [
    {
      type: String
    }
  ],
  photo: {
    type: String
  },
  chats: {
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "chat"
        },
        prof: {
          type: Schema.Types.ObjectId,
          ref: "profile"
        }
      }
    ],
    default: []
  }
});

let Profile = mongoose.model("profile", ProfileSchema);
module.exports = Profile;
