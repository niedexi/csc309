const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for user following and followers
const RelationSchema = new Schema({
  following:
    {
        type: Schema.Types.ObjectId,
        ref: "profile"
    },
  follower:
   {
        type: Schema.Types.ObjectId,
        ref: "profile"
   }
});

let Relation = mongoose.model("relation", RelationSchema);
module.exports = Relation;
